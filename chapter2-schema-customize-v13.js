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
  try{const u=new URL(v);if(u.origin===UPLOAD_ORIGIN&&/^\/assets\/[A-Za-z0-9_-]{1,128}\/[a-f0-9]{64}\.(webp|png|jpg|gif)$/.test(u.pathname)&&!u.search&&!u.hash)return u.href;}catch(_){}
  if(local&&/^local:[a-f0-9-]{36}$/i.test(v))return v;
  return '';
 }

 function validMusic(v,local=false){
  if(typeof v!=='string'||v.length>500)return '';if(local&&/^local:[a-f0-9-]{36}$/i.test(v))return v;
  try{const u=new URL(v);if(u.origin===UPLOAD_ORIGIN&&/^\/assets\/[A-Za-z0-9_-]{1,128}\/[a-f0-9]{64}\.(mp3|ogg|wav)$/.test(u.pathname)&&!u.search&&!u.hash)return u.href;}catch(_){}return '';
 }
 function obstacleRect(o,W,H){
  const w=clamp(o.w,20,W,100),h=clamp(o.h,15,H,80),angle=clamp(o.rotation,-180,180,0)*Math.PI/180,ex=(Math.abs(Math.cos(angle))*w+Math.abs(Math.sin(angle))*h)/2,ey=(Math.abs(Math.sin(angle))*w+Math.abs(Math.cos(angle))*h)/2;
  const cx=ex*2>W?W/2:clamp(Number(o.x)+w/2,ex,W-ex,W/2),cy=ey*2>H?H/2:clamp(Number(o.y)+h/2,ey,H-ey,H*.74+h/2);
  return {x:cx-w/2,y:cy-h/2,w,h};
 }
 function transform(v={},trim=false){v=v||{};return {rotation:clamp(v.rotation,-180,180,0),flipX:!!v.flipX,flipY:!!v.flipY,opacity:clamp(v.opacity,0,1,1),trim:v.trim==null?trim:!!v.trim};}
 function move(m={},i=0){
  const kind=kinds.includes(m.kind)?m.kind:'projectile',size=clamp(m.size,6,300,20),defaultWidth=kind==='beam'?Math.min(clamp(m.range,60,4000,400),1000):kind==='melee'?240:kind==='projectile'?size*3.6:180;
  return {...transform(m,true),name:str(m.name,32,'Attack '+(i+1)),offsetX:clamp(m.offsetX,-1600,1600,kind==='melee'?defaultWidth/2:35),offsetY:clamp(m.offsetY,-1600,800,-75),artWidth:clamp(m.artWidth,8,2400,defaultWidth),artHeight:clamp(m.artHeight,8,1800,kind==='beam'?Math.max(40,size*2):kind==='melee'?160:kind==='projectile'?size*3.6:180),kind,artFit:m.artFit==='stretch'?'stretch':'contain',color:color(m.color),asset:validAsset(m.asset,true),attackSprite:validAsset(m.attackSprite,true),attackSpriteStyle:transform(m.attackSpriteStyle,true),attackSpriteFacing:['left','right'].includes(m.attackSpriteFacing)?m.attackSpriteFacing:'inherit',poseWidth:clamp(m.poseWidth,0,2400,0),poseHeight:clamp(m.poseHeight,0,2000,0),poseDuration:clamp(m.poseDuration,.05,8,.45),visualDuration:clamp(m.visualDuration,.05,8,.5),showColor:m.showColor==null?!m.asset:!!m.showColor,showLabel:m.showLabel==null?kind!=='projectile':!!m.showLabel,damage:clamp(m.damage,0,500,24),cooldown:clamp(m.cooldown,.05,30,1.5),speed:clamp(m.speed,50,2400,480),size,range:clamp(m.range,20,4000,400),count:Math.round(clamp(m.count,1,12,1)),spread:clamp(m.spread,0,2.8,.22),angle:clamp(m.angle,-180,180,0),effect:effects.includes(m.effect)?m.effect:'none',duration:clamp(m.duration,.2,12,2),pierce:!!m.pierce};
 }
 function fighter(f={},i=0,world={width:1280,height:720}){
  const count=Math.round(clamp(f.moveCount,0,10,Array.isArray(f.moves)?Math.min(10,f.moves.length):4));
  return {...transform(f,true),id:str(f.id,48,'fighter-'+i),name:str(f.name,32,'Rombie'),sprite:validAsset(f.sprite,true)||'sprite:normal_rombie',spriteFit:f.spriteFit==='stretch'?'stretch':'contain',color:color(f.color),hp:Math.round(clamp(f.hp,50,20000,400)),speed:clamp(f.speed,0,1200,235),size:clamp(f.size,.1,8,1),spawnY:f.spawnY==null?null:clamp(f.spawnY,0,world.height-30,world.height*.8333),x:f.x==null?null:clamp(f.x,25,world.width-25,150+i*100),width:clamp(f.width,15,2400,130*clamp(f.size,.1,8,1)),height:clamp(f.height,15,2000,155*clamp(f.size,.1,8,1)),hitWidth:clamp(f.hitWidth,8,1600,64*clamp(f.size,.1,8,1)),hitHeight:clamp(f.hitHeight,8,1800,120*clamp(f.size,.1,8,1)),jumpPower:clamp(f.jumpPower,0,1600,630),wiggle:f.wiggle!==false,attackLunge:f.attackLunge!==false,followFacing:f.followFacing!==false,spriteFacing:f.spriteFacing==='left'?'left':'right',showName:f.showName!==false,showHealth:f.showHealth!==false,showAura:f.showAura!==false,ai:['balanced','rush','ranged','tank','support','stationary'].includes(f.ai)?f.ai:'balanced',moveCount:count,moves:Array.from({length:count},(_,n)=>move(f.moves?.[n],n)),ultimate:move(f.ultimate||{name:'Domain expansion',kind:'burst',damage:100,cooldown:12,range:800,size:80,color:f.color},count)};
 }
 function fight(raw,options={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('This fight has no valid configuration.');
  if(JSON.stringify(raw).length>220000)throw Error('This fight is too large.');
  const world={width:Math.round(clamp(raw.arena?.width,640,4096,1280)),height:Math.round(clamp(raw.arena?.height,360,2160,720))},W=world.width,H=world.height;
  const result={version:1,arena:world,title:str(raw.title,80,'Untitled chaos').trim()||'Untitled chaos',description:str(raw.description,1000),background:validAsset(raw.background,true)||'bg:desert',color:color(raw.color),mode:['defeat','survive','bossrush'].includes(raw.mode)?raw.mode:'defeat',duration:clamp(raw.duration,15,600,90),gravity:clamp(raw.gravity,0,4000,1300),friendlyFire:!!raw.friendlyFire,playerDamage:clamp(raw.playerDamage,0,5,1),enemyDamage:clamp(raw.enemyDamage,0,5,1),wiggle:raw.wiggle!==false,upArrowJumps:raw.upArrowJumps!==false,screenShake:raw.screenShake!==false,showHitboxes:!!raw.showHitboxes,
   floor:{...transform(raw.floor),x:clamp(raw.floor?.x,0,W-80,0),y:clamp(raw.floor?.y,100,H-30,H*5/6),w:clamp(raw.floor?.w,80,W-clamp(raw.floor?.x,0,W-80,0),W),h:clamp(raw.floor?.h,12,H-30,H/6),color:color(raw.floor?.color||'#273442'),asset:validAsset(raw.floor?.asset,true),tile:raw.floor?.tile!==false,visible:raw.floor?.visible!==false},
   backgroundRect:{...transform(raw.backgroundRect),x:clamp(raw.backgroundRect?.x,-W,W,0),y:clamp(raw.backgroundRect?.y,-H,H,0),w:clamp(raw.backgroundRect?.w,80,W*3,W),h:clamp(raw.backgroundRect?.h,45,H*3,H)},
   scene:raw.scene&&Number.isInteger(raw.scene.slide)&&raw.scene.slide>=1&&raw.scene.slide<=924?{slide:raw.scene.slide,masks:(Array.isArray(raw.scene.masks)?raw.scene.masks:[]).slice(0,24).map(o=>({x:clamp(o.x,0,1280),y:clamp(o.y,0,720),w:clamp(o.w,1,1280),h:clamp(o.h,1,720),color:color(o.color)})),ids:(Array.isArray(raw.scene.ids)?raw.scene.ids:[]).slice(0,100).map(v=>str(v,48))}:null,
   musicAsset:validMusic(raw.musicAsset,true),musicName:str(raw.musicName,70),musicVolume:clamp(raw.musicVolume,0,1,.7),musicLoop:raw.musicLoop!==false,music:['culling','pyramid','chaos','finale','quiet'].includes(raw.music)?raw.music:'chaos',party:(Array.isArray(raw.party)?raw.party:[]).slice(0,4).map((f,i)=>fighter(f,i,world)),waves:(Array.isArray(raw.waves)?raw.waves:[]).slice(0,8).map((w,i)=>({name:str(w.name,48,'Wave '+(i+1)),delay:clamp(w.delay,0,15,2),useCutsceneScene:!!w.useCutsceneScene,dialogue:(Array.isArray(w.dialogue)?w.dialogue:[]).slice(0,20).map(l=>({speaker:str(l.speaker,32,'Narrator'),text:str(l.text,1200),portrait:validAsset(l.portrait,true)})),enemies:(Array.isArray(w.enemies)?w.enemies:[]).slice(0,8).map((f,n)=>fighter(f,n,world))})),
   obstacles:(Array.isArray(raw.obstacles)?raw.obstacles:[]).slice(0,24).map((o,i)=>({...transform(o,true),id:str(o.id,48,'obstacle-'+i),name:str(o.name,32,'Obstacle'),type:['cover','platform','hazard','heal','bounce','decoration'].includes(o.type)?o.type:'cover',...obstacleRect(o,W,H),color:color(o.color),asset:validAsset(o.asset,true),invincible:typeof o.invincible==='boolean'?o.invincible:o.type!=='cover',hp:Math.round(clamp(o.hp,1,1000000,250)),damage:clamp(o.damage,0,500,12)}))};
  result.cutscene=null;
  if(raw.cutscene&&typeof raw.cutscene==='object'){
   const c=raw.cutscene,scene=c.scene&&typeof c.scene==='object'?fight({...c.scene,cutscene:null},options):null;
   result.cutscene={enabled:c.enabled!==false,trigger:['before','victory','both'].includes(c.trigger)?c.trigger:'before',scene,lines:(Array.isArray(c.lines)?c.lines:[]).slice(0,40).map(l=>({speaker:str(l.speaker,32,'Narrator'),text:str(l.text,1200),portrait:validAsset(l.portrait,true)}))};
  }
  if(!result.party.length)throw Error('Add at least one player character.');
  if(!result.waves.length||result.waves.some(w=>!w.enemies.length))throw Error('Add an enemy to every wave.');
  if(options.public&&JSON.stringify(result).includes('local:'))throw Error('Upload your custom artwork and music before publishing this fight.');
  return result;
 }
 window.RombiesSchema={UPLOAD_ORIGIN,kinds,effects,clamp,color,obstacleRect,transform,move,fighter,fight,validAsset,validMusic};
})();
