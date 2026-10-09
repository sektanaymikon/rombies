/* Reusable scene objects keep the entire story small enough for CodeHS. */
(() => {
 'use strict';
 function polygon(c,x,y,w,h,n=5,inner=.42){c.beginPath();for(let i=0;i<n*2;i++){const r=i%2?inner:1,a=-Math.PI/2+i*Math.PI/n;const px=x+w/2+Math.cos(a)*w/2*r,py=y+h/2+Math.sin(a)*h/2*r;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();}
 function wrap(c,text,width){const lines=[];for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(line&&c.measureText(line+' '+word).width>Math.max(width,20)){lines.push(line);line=word;}else line+=(line?' ':'')+word;}lines.push(line);}return lines;}
 function sceneDraw(c,slide,elapsed=10,cue=100){
  c.fillStyle=slide.bg||'#fff';c.fillRect(0,0,1280,720);
  const effects=[];(slide.cues||[]).forEach((group,i)=>group.forEach((e,j)=>effects.push({...e,cue:i+1,offset:j*.18})));
  for(const o of slide.items){
   const ids=[o.id,...(o.groups||[])],ef=effects.filter(e=>e.targets.some(id=>ids.includes(id)));let visible=true,opacity=1,dx=0,dy=0,sx=1,sy=1,rotation=0;
   for(const e of ef){
    const t=Math.max(0,Math.min(1,(elapsed-e.offset)/Math.max(.15,e.duration))),u=cue>e.cue?1:cue===e.cue?t:0;
    if(e.kind==='entr'&&cue<e.cue)visible=false;
    if(e.kind==='exit'&&(cue>e.cue||(cue===e.cue&&t>=1)))visible=false;
    if(e.filter==='fade'&&cue===e.cue)opacity*=e.kind==='exit'?1-t:e.kind==='entr'?t:1;
    if(cue<e.cue)continue;
    for(const track of e.tracks||[]){
     if(track.property==='rotation'){rotation+=track.by*u;continue;}
     const axis=track.property.slice(-1),unit=axis==='x'||axis==='w'?1280:720;
     const base=axis==='x'?(o.x+o.w/2)/1280:axis==='y'?(o.y+o.h/2)/720:axis==='w'?o.w/1280:o.h/720;
     const value=v=>v==='0'?0:base+(v.endsWith('+1')?1:v.endsWith('-1')?-1:0);
     const v=value(track.from)+(value(track.to)-value(track.from))*u;
     if(axis==='x')dx+=(v-base)*unit;if(axis==='y')dy+=(v-base)*unit;if(axis==='w')sx*=base?v/base:1;if(axis==='h')sy*=base?v/base:1;
    }
   }
   if(!visible)continue;c.save();c.globalAlpha=opacity;c.translate(o.x+o.w/2+dx,o.y+o.h/2+dy);if(o.rot||rotation)c.rotate(((o.rot||0)+rotation)*Math.PI/180);c.scale((o.flipH?-1:1)*sx,(o.flipV?-1:1)*sy);c.translate(-o.w/2,-o.h/2);
   if(o.t==='image'){
    const im=RombiesMedia.get(o.asset);if(im?.complete&&im.naturalWidth){if(o.crop){const [l,t,r,b]=o.crop,sw=im.width*(1-l-r),sh=im.height*(1-t-b);if(sw>0&&sh>0)c.drawImage(im,l*im.width,t*im.height,sw,sh,0,0,o.w,o.h);}else c.drawImage(im,0,0,o.w,o.h);}
   }else{
    c.fillStyle=o.fill||'transparent';c.strokeStyle=o.stroke||'transparent';c.lineWidth=o.lw||1;
    c.beginPath();
    if(o.shape==='ellipse')c.ellipse(o.w/2,o.h/2,Math.max(.1,o.w/2),Math.max(.1,o.h/2),0,0,Math.PI*2);
    else if(/star|irregularSeal/.test(o.shape))polygon(c,0,0,o.w,o.h,o.shape.includes('4')?4:o.shape.includes('16')?16:8,.45);
    else if(o.shape==='cloud'){for(const [x,y,r] of [[.25,.65,.24],[.2,.4,.2],[.4,.25,.23],[.64,.3,.23],[.8,.47,.2],[.72,.7,.24],[.47,.73,.25]]){c.moveTo(o.w*x+o.w*r,o.h*y);c.ellipse(o.w*x,o.h*y,o.w*r,o.h*r,0,0,Math.PI*2);}}
    else if(/triangle/i.test(o.shape)){c.moveTo(o.w/2,0);c.lineTo(o.w,o.h);c.lineTo(0,o.h);c.closePath();}
    else if(o.shape==='line'){c.moveTo(0,0);c.lineTo(o.w,o.h);}
    else c.rect(0,0,o.w,o.h);
    if(o.fill)c.fill();if(o.stroke)c.stroke();
    if(o.text){
     const blocks=o.text.map(p=>{c.font=`${p.bold?'700':'400'} ${p.size}px Arial`;return {...p,lines:wrap(c,p.text,Math.max(o.w-8,20))};});
     const total=blocks.reduce((n,b)=>n+b.lines.length*b.size*1.12,0);let y=o.anchor==='ctr'?Math.max(0,(o.h-total)/2):o.anchor==='b'?Math.max(0,o.h-total):3;
     for(const p of blocks){c.font=`${p.bold?'700':'400'} ${p.size}px Arial`;c.fillStyle=p.color||'#000';c.textBaseline='top';c.textAlign=p.align==='ctr'?'center':p.align==='r'?'right':'left';for(const line of p.lines){c.fillText(line,p.align==='ctr'?o.w/2:p.align==='r'?o.w-4:4,y);y+=p.size*1.12;}}
    }
   }
   c.restore();
  }
 }
 class Story {
  constructor(canvas,events={},start=1){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.events=events;this.slide=start;this.cue=0;this.elapsed=0;this.auto=true;this.paused=false;this.speed=1;this.busy=false;this.complete=false;this.review=false;this.setSlide(start);}
  setSlide(n){
   this.slide=Math.max(1,Math.min(924,n));this.cue=0;this.elapsed=0;this.busy=false;const s=ROMBIES_SCENES[this.slide-1];for(const o of s.items)if(o.asset)RombiesMedia.get(o.asset);for(const next of ROMBIES_SCENES.slice(this.slide,this.slide+3))for(const o of next.items)if(o.asset)RombiesMedia.get(o.asset);
   this.loadWait=0;this.events.slide?.(this.slide,s);this.events.save?.(this.slide);
  }
  next(force=false){
   if(this.busy||this.complete)return;const s=ROMBIES_SCENES[this.slide-1];
   if(this.cue<s.cues.length){this.cue++;this.elapsed=0;return;}
   const encounter=ROMBIES_CHAPTER2.encounters.find(e=>e.after===this.slide);
   if(encounter&&!this.review){this.busy=true;this.events.encounter?.(encounter,()=>{this.busy=false;this.setSlide(this.slide+1);});return;}
   if(this.slide>=900&&!this.review){this.complete=true;this.events.complete?.();return;}
   if(this.slide>=924){this.complete=true;return;}this.setSlide(this.slide+1);
  }
  previous(){if(this.busy)return;if(this.cue>0){this.cue--;this.elapsed=5;}else this.setSlide(this.slide-1);}
  update(dt){
   if(this.busy||this.paused||document.hidden||this.complete)return;this.loadWait+=dt;const ready=ROMBIES_SCENES[this.slide-1].items.filter(o=>o.asset).every(o=>{const i=RombiesMedia.get(o.asset);return i?.complete&&i.naturalWidth;});if(!ready&&this.loadWait<5)return;this.elapsed+=dt*this.speed;
   const slide=ROMBIES_SCENES[this.slide-1],text=slide.items.flatMap(o=>(o.text||[]).map(p=>p.text)).join(' ');
   const current=slide.cues[this.cue-1]||[],cueDuration=Math.max(.7,...current.map((e,i)=>e.duration+i*.18+.3));
   const wait=this.cue<slide.cues.length?Math.max(1.3,cueDuration):Math.max(cueDuration,text.length?Math.max(2.5,Math.min(11,text.length/20)):.7);
   if(this.auto&&this.elapsed>wait)this.next();
  }
  render(){if(this.busy)return;sceneDraw(this.ctx,ROMBIES_SCENES[this.slide-1],this.elapsed,this.cue);}
 }
 window.RombiesStory=Story;window.RombiesSceneDraw=sceneDraw;
})();
