/* Public fight data is declarative. No uploaded code is ever executed. */
(() => {
 'use strict';
 const UPLOAD_ORIGIN='https://rombies-uploads.sektanaymikon.workers.dev';
 const kinds=['projectile','melee','beam','burst','heal','shield','dash','freeze','summon'];
 const effects=['none','poison','burn','slow','stun','drain'];
 const clamp=(v,a,b,d=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):d;
 const str=(v,n,d='')=>typeof v==='string'?v.slice(0,n):d;
 const color=v=>/^#[\da-f]{6}$/i.test(v)?v:'#91efbd';
 const assetKeys=()=>new Set([...Object.keys(window.ROMBIES_ART||{}),...Object.keys(ASSETS.sprites).map(x=>'sprite:'+x),...Object.keys(ASSETS.bgs).map(x=>'bg:'+x),...Object.keys(ASSETS.fx).map(x=>'fx:'+x)]);
 function validAsset(v,local=false){
  if(typeof v!=='string'||v.length>500)return '';
  if(assetKeys().has(v))return v;
  try{const u=new URL(v);if(u.origin===UPLOAD_ORIGIN&&/^\/assets\/[A-Za-z0-9_-]{1,128}\/[a-f0-9]{64}\.(webp|png|jpg)$/.test(u.pathname)&&!u.search&&!u.hash)return u.href;}catch(_){}
  if(local&&/^local:[a-f0-9-]{36}$/i.test(v))return v;
  return '';
 }
 function move(m={},i=0){return {name:str(m.name,32,'Attack '+(i+1)),kind:kinds.includes(m.kind)?m.kind:'projectile',color:color(m.color),asset:validAsset(m.asset,true),damage:clamp(m.damage,0,150,24),cooldown:clamp(m.cooldown,.25,30,1.5),speed:clamp(m.speed,100,1200,480),size:clamp(m.size,6,100,20),range:clamp(m.range,60,1100,400),count:Math.round(clamp(m.count,1,7,1)),spread:clamp(m.spread,0,1.8,.22),effect:effects.includes(m.effect)?m.effect:'none',duration:clamp(m.duration,.2,8,2),pierce:!!m.pierce};}
 function fighter(f={},i=0){return {id:str(f.id,48,'fighter-'+i),name:str(f.name,32,'Rombie'),sprite:validAsset(f.sprite,true)||'sprite:normal_rombie',color:color(f.color),hp:Math.round(clamp(f.hp,50,5000,400)),speed:clamp(f.speed,70,500,235),size:clamp(f.size,.45,2.6,1),ai:['balanced','rush','ranged','tank','support'].includes(f.ai)?f.ai:'balanced',moves:Array.from({length:4},(_,n)=>move(f.moves?.[n],n)),ultimate:move(f.ultimate||{name:'Domain expansion',kind:'burst',damage:100,cooldown:12,range:800,size:80,color:f.color},4)};}
 function fight(raw,options={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('This fight has no valid configuration.');
  if(JSON.stringify(raw).length>220000)throw Error('This fight is too large.');
  const result={version:1,title:str(raw.title,80,'Untitled chaos').trim()||'Untitled chaos',description:str(raw.description,1000),background:validAsset(raw.background,true)||'bg:desert',color:color(raw.color),mode:['defeat','survive','bossrush'].includes(raw.mode)?raw.mode:'defeat',duration:clamp(raw.duration,15,600,90),gravity:clamp(raw.gravity,500,2000,1300),friendlyFire:!!raw.friendlyFire,playerDamage:clamp(raw.playerDamage,.3,3,1),enemyDamage:clamp(raw.enemyDamage,.3,3,1),music:['culling','pyramid','chaos','finale','quiet'].includes(raw.music)?raw.music:'chaos',party:(Array.isArray(raw.party)?raw.party:[]).slice(0,4).map(fighter),waves:(Array.isArray(raw.waves)?raw.waves:[]).slice(0,8).map((w,i)=>({name:str(w.name,48,'Wave '+(i+1)),delay:clamp(w.delay,0,15,2),enemies:(Array.isArray(w.enemies)?w.enemies:[]).slice(0,8).map(fighter)})),obstacles:(Array.isArray(raw.obstacles)?raw.obstacles:[]).slice(0,24).map((o,i)=>({id:str(o.id,48,'obstacle-'+i),name:str(o.name,32,'Obstacle'),type:['cover','platform','hazard','heal','bounce'].includes(o.type)?o.type:'cover',x:clamp(o.x,30,1190,640),y:clamp(o.y,200,610,535),w:clamp(o.w,20,350,100),h:clamp(o.h,15,240,80),color:color(o.color),asset:validAsset(o.asset,true),hp:clamp(o.hp,30,2000,250),damage:clamp(o.damage,1,60,12)}))};
  if(!result.party.length)throw Error('Add at least one player character.');
  if(!result.waves.length||result.waves.some(w=>!w.enemies.length))throw Error('Add an enemy to every wave.');
  if(options.public&&JSON.stringify(result).includes('local:'))throw Error('Upload your custom artwork before publishing this fight.');
  return result;
 }
 window.RombiesSchema={UPLOAD_ORIGIN,kinds,effects,clamp,color,move,fighter,fight,validAsset};
})();
