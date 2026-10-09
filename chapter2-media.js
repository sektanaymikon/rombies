(() => {
 'use strict';
 const cache=new Map(),urls=new Map();let dbPromise;
 function db(){return dbPromise||(dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('rombies_art_v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('images',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}));}
 async function transaction(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('images',mode),req=fn(t.objectStore('images'));let value;req.onsuccess=()=>value=req.result;t.oncomplete=()=>resolve(value);t.onerror=()=>reject(t.error);});}
 async function local(id){return transaction('readonly',s=>s.get(id));}
 async function resolve(key){
  if(window.ROMBIES_ART?.[key])return ROMBIES_ART[key].path;
  const [group,name]=key.split(':');if(['sprite','bg','fx'].includes(group))return ASSETS[{sprite:'sprites',bg:'bgs',fx:'fx'}[group]][name];
  if(key.startsWith('local:')){if(urls.has(key))return urls.get(key);const item=await local(key);if(!item)throw Error('Custom artwork is missing from this browser.');const url=URL.createObjectURL(item.blob);urls.set(key,url);return url;}
  return RombiesSchema.validAsset(key);
 }
 function get(key){if(!key)return null;if(cache.has(key)){const current=cache.get(key);cache.delete(key);cache.set(key,current);return current;}if(!cache.has(key)){if(cache.size>=128)cache.delete(cache.keys().next().value);const im=new Image();cache.set(key,im);resolve(key).then(src=>{if(src){if(/^https?:/.test(src))im.crossOrigin='anonymous';im.src=src;}}).catch(()=>{im.failed=true;});}return cache.get(key);}
 async function load(key){const im=get(key);if(!im)return null;if(im.complete&&im.naturalWidth)return im;return new Promise(resolve=>{let timer=setTimeout(()=>resolve(null),12000);im.addEventListener('load',()=>{clearTimeout(timer);resolve(im);},{once:true});im.addEventListener('error',()=>{clearTimeout(timer);im.failed=true;resolve(null);},{once:true});});}
 async function compress(file,kind){
  if(!/^image\/(png|jpeg|webp)$/.test(file.type))throw Error('Choose a PNG, JPEG or WebP image.');
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
  for(let i=0;i<ids.length;i++){const item=await local(ids[i]);if(!item)throw Error('A custom image is missing. Replace it before publishing.');progress?.(`Uploading artwork ${i+1}/${ids.length}…`);const url=await RombiesCloud.upload(item.blob,item.kind);result=result.replaceAll(ids[i],url);}
  return JSON.parse(result);
 }
 function draw(ctx,key,x,y,w,h,fit='contain'){
  const im=get(key);if(!im?.complete||!im.naturalWidth)return false;
  if(fit==='stretch')ctx.drawImage(im,x,y,w,h);
  else{const s=fit==='cover'?Math.max(w/im.width,h/im.height):Math.min(w/im.width,h/im.height);ctx.drawImage(im,x+(w-im.width*s)/2,y+(h-im.height*s)/2,im.width*s,im.height*s);}return true;
 }
 window.RombiesMedia={get,load,resolve,draw,compress,all,local,publishAssets};
})();
