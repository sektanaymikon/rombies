(() => {
 'use strict';
 const cache=new Map(),urls=new Map(),tiles=new WeakMap();let dbPromise;
 function db(){return dbPromise||(dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('rombies_art_v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('images',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}));}
 async function transaction(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('images',mode),req=fn(t.objectStore('images'));let value;req.onsuccess=()=>value=req.result;t.oncomplete=()=>resolve(value);t.onerror=()=>reject(t.error);});}
 async function local(id){return transaction('readonly',s=>s.get(id));}
 async function resolve(key){
  if(window.ROMBIES_ART?.[key])return ROMBIES_ART[key].path;
  const [group,name]=key.split(':');if(['sprite','bg','fx'].includes(group))return ASSETS[{sprite:'sprites',bg:'bgs',fx:'fx'}[group]][name];
  if(key.startsWith('local:')){if(urls.has(key))return urls.get(key);const item=await local(key);if(!item)throw Error('Custom artwork is missing from this browser.');const url=URL.createObjectURL(item.blob);urls.set(key,url);return url;}
  return RombiesSchema.validAsset(key)||RombiesSchema.validMusic(key);
 }

 // Canvas drawImage uses an animated image's default frame. Decode GIF frames
 // explicitly so artwork also animates inside canvas battles and tiled floors.
 function gifData(bytes){
  let p=0;const fail=()=>{throw Error('This GIF is damaged or unsupported.');};
  const read=n=>{if(p+n>bytes.length)fail();const out=bytes.subarray(p,p+n);p+=n;return out;};
  const byte=()=>read(1)[0],word=()=>{const b=read(2);return b[0]|b[1]<<8;};
  const blocks=()=>{const parts=[];let count=0,n;while((n=byte())){parts.push(read(n));count+=n;}const out=new Uint8Array(count);let at=0;for(const b of parts){out.set(b,at);at+=b.length;}return out;};
  const header=String.fromCharCode(...read(6));if(header!=='GIF87a'&&header!=='GIF89a')fail();
  const width=word(),height=word();if(!width||!height||width>4096||height>4096||width*height>4194304)throw Error('Resize this GIF to at most 4 million pixels, with each side under 4096 pixels.');
  const packed=byte(),background=byte();byte();const palette=packed&128?read(3*(1<<((packed&7)+1))):null;
  const frames=[];let control={delay:100,disposal:0,transparent:-1},loops=1,pixels=0,finished=false;
  while(p<bytes.length){
   const tag=byte();if(tag===59){finished=true;break;}
   if(tag===33){const label=byte();if(label===249){if(byte()!==4)fail();const flags=byte(),delay=word(),index=byte();if(byte()!==0)fail();control={delay:delay<2?100:delay*10,disposal:(flags>>2)&7,transparent:flags&1?index:-1};}
    else if(label===255){const id=String.fromCharCode(...read(byte())),data=blocks();if((id==='NETSCAPE2.0'||id==='ANIMEXTS1.0')&&data[0]===1&&data.length>=3){const repeat=data[1]|data[2]<<8;loops=repeat===0?Infinity:repeat+1;}}
    else blocks();continue;
   }
   if(tag!==44)fail();const x=word(),y=word(),w=word(),h=word(),flags=byte();if(!w||!h||x+w>width||y+h>height)fail();
   const colors=flags&128?read(3*(1<<((flags&7)+1))):palette;if(!colors)fail();const bits=byte(),data=blocks();if(bits<2||bits>8||!data.length)fail();
   pixels+=w*h;if(frames.length>=500||pixels>100000000)throw Error('Shorten this GIF: use at most 500 frames and fewer large frames.');
   frames.push({x,y,w,h,colors,bits,data,interlace:!!(flags&64),...control});control={delay:100,disposal:0,transparent:-1};
  }
  if(!finished||!frames.length)fail();return {width,height,palette,background,frames,loops};
 }
 function gifPixels(frame){
  const {data,bits}=frame,clear=1<<bits,end=clear+1,out=new Uint8Array(frame.w*frame.h),prefix=new Uint16Array(4096),suffix=new Uint8Array(4096),stack=new Uint8Array(4097);
  for(let i=0;i<clear;i++)suffix[i]=i;
  let bit=0,size=bits+1,next=end+1,previous=-1,first=0,pos=0,ended=false;
  const fail=()=>{throw Error('This GIF has damaged animation frames.');};
  while(bit+size<=data.length*8){let code=0;for(let i=0;i<size;i++)code|=((data[(bit+i)>>3]>>((bit+i)&7))&1)<<i;bit+=size;
   if(code===clear){size=bits+1;next=end+1;previous=-1;continue;}if(code===end){ended=true;break;}if(code>next||code>=4096)fail();
   if(previous<0){if(code>=clear||pos>=out.length)fail();out[pos++]=code;first=code;previous=code;continue;}
   const original=code;let top=0;if(code===next){stack[top++]=first;code=previous;}
   while(code>=clear){if(code>=next||top>=4096)fail();stack[top++]=suffix[code];code=prefix[code];}
   first=suffix[code];stack[top++]=first;if(pos+top>out.length)fail();while(top)out[pos++]=stack[--top];
   if(next<4096){prefix[next]=previous;suffix[next]=first;next++;if(next===(1<<size)&&size<12)size++;}previous=original;
  }
  if(!ended||pos!==out.length)fail();return out;
 }
 function gifPlayer(gif){
  const canvas=document.createElement('canvas');canvas.width=gif.width;canvas.height=gif.height;canvas.complete=true;canvas.naturalWidth=gif.width;canvas.naturalHeight=gif.height;
  const ctx=canvas.getContext('2d'),tile=document.createElement('canvas'),tc=tile.getContext('2d');let index=-1,cycles=0,backup=null,nextAt=performance.now(),done=false;
  function background(f){ctx.clearRect(f.x,f.y,f.w,f.h);if(f.transparent<0&&gif.palette){const i=gif.background*3;if(i+2<gif.palette.length){ctx.fillStyle=`rgb(${gif.palette[i]},${gif.palette[i+1]},${gif.palette[i+2]})`;ctx.fillRect(f.x,f.y,f.w,f.h);}}}
  function frame(){
   if(index>=0){const old=gif.frames[index];if(old.disposal===2)background(old);else if(old.disposal===3&&backup)ctx.putImageData(backup,old.x,old.y);}
   index++;if(index>=gif.frames.length){index=0;cycles++;ctx.clearRect(0,0,canvas.width,canvas.height);}
   const f=gif.frames[index];if(index===0&&f.transparent<0)background({x:0,y:0,w:canvas.width,h:canvas.height,transparent:-1});
   backup=f.disposal===3?ctx.getImageData(f.x,f.y,f.w,f.h):null;
   const pixels=gifPixels(f),rgba=tc.createImageData(f.w,f.h),rows=[];
   if(f.interlace){for(const [start,step] of [[0,8],[4,8],[2,4],[1,2]])for(let row=start;row<f.h;row+=step)rows.push(row);}else for(let row=0;row<f.h;row++)rows.push(row);
   for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const color=pixels[y*f.w+x],at=(rows[y]*f.w+x)*4;if(color===f.transparent)continue;const p=color*3;if(p+2>=f.colors.length)throw Error('Invalid GIF color palette.');rgba.data[at]=f.colors[p];rgba.data[at+1]=f.colors[p+1];rgba.data[at+2]=f.colors[p+2];rgba.data[at+3]=255;}
   tile.width=f.w;tile.height=f.h;tc.putImageData(rgba,0,0);ctx.drawImage(tile,f.x,f.y);nextAt+=f.delay;
  }
  frame();return {canvas,tick(){const now=performance.now();let steps=0;while(!done&&now>=nextAt&&steps++<10){if(index===gif.frames.length-1&&cycles+1>=gif.loops){done=true;break;}frame();}if(now>=nextAt&&!done)nextAt=now+gif.frames[index].delay;return canvas;}};
 }

 function alphaBounds(im){
  try{const canvas=document.createElement('canvas');canvas.width=im.width;canvas.height=im.height;const c=canvas.getContext('2d');c.drawImage(im,0,0);const pixels=c.getImageData(0,0,im.width,im.height).data;let l=im.width,t=im.height,r=0,b=0;
   for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(pixels[(y*im.width+x)*4+3]>8){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x+1);b=Math.max(b,y+1);}return r>l&&b>t?[l,t,r,b]:null;
  }catch(_){return null;}
 }
 function get(key){if(!key)return null;if(cache.has(key)){const current=cache.get(key);cache.delete(key);cache.set(key,current);return current.animation?current.animation.tick():current;}if(!cache.has(key)){if(cache.size>=128)cache.delete(cache.keys().next().value);const im=new Image();im.addEventListener('error',()=>{im.failed=true;},{once:true});if(key.startsWith('local:')||key.startsWith('https://rombies-uploads.'))im.addEventListener('load',()=>{if(!im.animation)im.bounds=alphaBounds(im);},{once:true});cache.set(key,im);resolve(key).then(async src=>{if(src){const isGif=/\.gif$/i.test(src)||(key.startsWith('local:')&&(await local(key))?.blob.type==='image/gif');if(isGif){const response=await fetch(src);if(!response.ok)throw Error('GIF could not be loaded.');const blob=await response.blob();if(blob.size>2097152)throw Error('GIF exceeds the upload limit.');im.animation=gifPlayer(gifData(new Uint8Array(await blob.arrayBuffer())));}if(/^https?:/.test(src))im.crossOrigin='anonymous';im.src=src;}}).catch(()=>{im.failed=true;});}return cache.get(key);}
 async function load(key){const im=get(key);if(!im)return null;if(im.complete&&im.naturalWidth)return im;return new Promise(resolve=>{let timer=setTimeout(()=>resolve(null),12000);im.addEventListener('load',()=>{clearTimeout(timer);resolve(im);},{once:true});im.addEventListener('error',()=>{clearTimeout(timer);im.failed=true;resolve(null);},{once:true});});}
 async function storeMusic(file){
  if(file.size>8*1024*1024)throw Error('Music must be 8 MiB or smaller. Use a compressed MP3 or OGG for longer tracks.');
  const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer()),text=String.fromCharCode(...bytes);let type;
  if(text.startsWith('ID3')||(bytes[0]===255&&(bytes[1]&224)===224))type='audio/mpeg';
  else if(text.startsWith('OggS'))type='audio/ogg';else if(text.startsWith('RIFF')&&text.slice(8,12)==='WAVE')type='audio/wav';
  if(!type||file.size<12)throw Error('Choose an MP3, OGG or WAV audio file.');
  const blob=new Blob([file],{type}),id='local:'+crypto.randomUUID();await transaction('readwrite',s=>s.put({id,blob,name:file.name.slice(0,70),kind:'music',createdAt:Date.now()}));return {id,blob};
 }
 async function compress(file,kind){
  if(kind==='music')return storeMusic(file);
  if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type))throw Error('Choose a PNG, JPEG, WebP or animated GIF.');
  if(file.type==='image/gif'){
   if(file.size>2097152)throw Error('GIFs must be 2 MiB or smaller. Shorten or resize the GIF to keep its animation.');
   const parsed=gifData(new Uint8Array(await file.arrayBuffer()));for(const f of parsed.frames)gifPixels(f);
   const blob=new Blob([file],{type:'image/gif'}),id='local:'+crypto.randomUUID();await transaction('readwrite',s=>s.put({id,blob,name:file.name.slice(0,70),kind,createdAt:Date.now()}));return {id,blob};
  }
  if(file.size>25*1024*1024)throw Error('Choose an image under 25 MB.');
  const im=await createImageBitmap(file);if(im.width*im.height>36000000||im.width>12000||im.height>12000){im.close();throw Error('Choose an image smaller than 36 million pixels.');}
  const limit=kind==='background'?1440:720,scale=Math.min(1,limit/Math.max(im.width,im.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(im.width*scale));canvas.height=Math.max(1,Math.round(im.height*scale));canvas.getContext('2d').drawImage(im,0,0,canvas.width,canvas.height);im.close();
  let blob;for(const q of [.85,.72,.58]){blob=await new Promise(r=>canvas.toBlob(r,'image/webp',q));if(blob&&blob.size<2097152)break;}
  if(!blob||blob.size>2097152)throw Error('This image cannot fit the 2 MB upload limit. Try a smaller image.');
  const id='local:'+crypto.randomUUID();await transaction('readwrite',s=>s.put({id,blob,name:file.name.slice(0,70),kind,createdAt:Date.now()}));return {id,blob};
 }
 async function all(){return transaction('readonly',s=>s.getAll());}
 async function publishAssets(config,progress){
  const clone=JSON.parse(JSON.stringify(config)),text=JSON.stringify(clone),ids=[...new Set(text.match(/local:[a-f0-9-]{36}/gi)||[])];let result=text;
  for(let i=0;i<ids.length;i++){const item=await local(ids[i]);if(!item)throw Error('A custom image or music file is missing. Replace it before publishing.');progress?.(`Uploading custom file ${i+1}/${ids.length}…`);const valid=item.kind==='music'?RombiesSchema.validMusic(item.uploadUrl):RombiesSchema.validAsset(item.uploadUrl);const url=valid||await RombiesCloud.upload(item.blob,item.kind);if(!valid){item.uploadUrl=url;await transaction('readwrite',s=>s.put(item));}result=result.replaceAll(ids[i],url);}
  return JSON.parse(result);
 }

 function draw(ctx,key,x,y,w,h,fit='contain',style){
  const im=get(key);if(!im?.complete||!im.naturalWidth)return false;
  const bounds=(style?.trim||(fit==='feet'&&style?.trim!==false))&&(window.ROMBIES_ART?.[key]?.bounds||im.bounds);
  if(style){ctx.save();ctx.globalAlpha*=(style.opacity??1);ctx.translate(x+w/2,y+h/2);ctx.rotate((style.rotation||0)*Math.PI/180);ctx.scale(style.flipX?-1:1,style.flipY?-1:1);x=-w/2;y=-h/2;}
  const [l,t,r,b]=bounds||[0,0,im.width,im.height],sw=r-l,sh=b-t;
  if(fit==='stretch')ctx.drawImage(im,l,t,sw,sh,x,y,w,h);
  else{const s=fit==='cover'?Math.max(w/sw,h/sh):Math.min(w/sw,h/sh);ctx.drawImage(im,l,t,sw,sh,x+(w-sw*s)/2,y+(h-sh*s)*(fit==='feet'?1:.5),sw*s,sh*s);}
  if(style)ctx.restore();return true;
 }
 function tile(ctx,key,x,y,w,h,style={}){
  if(style.tile===false)return draw(ctx,key,x,y,w,h,'stretch',style);
  const im=get(key);if(!im?.complete||!im.naturalWidth)return false;let pattern=im;const bounds=style.trim&&(window.ROMBIES_ART?.[key]?.bounds||im.bounds);if(bounds){pattern=tiles.get(im);if(!pattern){const [l,t,r,b]=bounds;pattern=document.createElement('canvas');pattern.width=r-l;pattern.height=b-t;pattern.getContext('2d').drawImage(im,l,t,r-l,b-t,0,0,r-l,b-t);tiles.set(im,pattern);}}ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x+w/2,y+h/2);ctx.rotate((style.rotation||0)*Math.PI/180);ctx.scale(style.flipX?-1:1,style.flipY?-1:1);ctx.globalAlpha*=(style.opacity??1);ctx.fillStyle=ctx.createPattern(pattern,'repeat');const radius=Math.hypot(w,h);ctx.fillRect(-radius,-radius,radius*2,radius*2);ctx.restore();return true;
 }
 window.RombiesMedia={get,load,resolve,draw,tile,compress,all,local,publishAssets};
})();
