/* Arena simulation shared by Chapter Two and the Sandbox editor. */
(() => {
 'use strict';
 const clamp=RombiesSchema.clamp;
 const down=new Set();let serial=0;
 const rectHit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 class Arena {
  constructor(canvas,raw,events={}){
   this.canvas=canvas;this.ctx=canvas.getContext('2d');this.config=RombiesSchema.fight(raw);this.events=events;this.W=this.config.arena.width;this.H=this.config.arena.height;canvas.width=this.W;canvas.height=this.H;
   this.lastAim={x:1,y:0};this.floor=this.config.floor;this.ground=this.floor.y;this.randomSeed=raw.seed||27391;this.party=this.config.party.map((f,i)=>this.actor(f,0,raw.party?.[i]?.x??150+i*100));this.enemies=[];this.shots=[];this.fx=[];this.time=0;this.wave=-1;this.waveDelay=this.config.waves[0].delay;this.selected=0;this.paused=false;this.done=false;this.combo=0;this.comboTime=0;this.score=0;this.parries=0;this.qte=null;this.freeze=0;this.freezeTeam=-1;this.slow=0;this.shake=0;this.message='';this.messageTime=0;this.obstacles=structuredClone(this.config.obstacles);this.difficulty=events.difficulty||1;this.nextHazard=5;this.hazard=null;
   this.listener=e=>this.key(e);this.release=e=>down.delete(e.code);addEventListener('keydown',this.listener);addEventListener('keyup',this.release);this.blur=()=>{down.clear();if(!this.dialogueActive)this.setPaused(true);};addEventListener('blur',this.blur);this.visibility=()=>{if(document.hidden)this.blur();};document.addEventListener('visibilitychange',this.visibility);
   this.banner(this.config.title,3);this.events.status?.(this);
  }
  random(){this.randomSeed=(1664525*this.randomSeed+1013904223)>>>0;return this.randomSeed/4294967296;}
  actor(def,team,x){return {id:++serial,def:structuredClone(def),team,x:clamp(x,this.floor.x+25,this.floor.x+this.floor.w-25),y:this.ground,z:Math.max(0,this.ground-(def.spawnY??this.ground)),vz:0,face:team?-1:1,aim:{x:team?-1:1,y:0},hp:def.hp,maxHp:def.hp,cd:def.moves.map(()=>0),ult:0,guard:0,parry:0,phase:0,dodgeCd:0,stun:0,hit:0,slow:0,burn:0,poison:0,ai:1.5+this.random(),cast:null,anim:0,shield:0,dead:0};}
  get player(){let p=this.party[this.selected];if(!p||p.hp<=0){this.selected=this.party.findIndex(a=>a.hp>0);p=this.party[this.selected];if(p){p.aim={...this.lastAim};if(this.lastAim.x)p.face=this.lastAim.x;}}return p;}
  living(team){return(team?this.enemies:this.party).filter(a=>a.hp>0);}
  banner(text,time=2){this.message=text;this.messageTime=time;}
  setPaused(value=!this.paused){if(this.done||this.dialogueActive)return;this.paused=value;down.clear();this.events.pause?.(value);}
  key(e){
   if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||this.done||this.dialogueActive)return;
   if(['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Escape','Enter'].includes(e.code))e.preventDefault();
   if(e.code==='Escape'){this.setPaused();return;}if(this.paused)return;
   if(e.repeat)return;
   down.add(e.code);if(this.qte){this.qteInput(({KeyA:'ArrowLeft',KeyD:'ArrowRight'})[e.code]||e.code);return;}this.rememberDirection(e.code);
   if(e.code==='Space')this.action('ultimate');else if(e.code==='Tab')this.action('swap');else if(e.code==='KeyC')this.action('dodge');else if(e.code==='KeyF')this.action('parry');else if(e.code==='KeyW'||(e.code==='ArrowUp'&&this.config.upArrowJumps))this.action('jump');else if(/^Digit[0-9]$/.test(e.code))this.action('attack'+(e.code==='Digit0'?10:e.code.slice(-1)));else if(/^Numpad[0-9]$/.test(e.code))this.action('attack'+(e.code==='Numpad0'?10:e.code.slice(-1)));
  }
  hold(code,value){if(this.qte){if(value)this.qteInput({KeyA:'ArrowLeft',KeyD:'ArrowRight'}[code]||code);return;}if(this.paused||this.done)return;if(value){down.add(code);this.rememberDirection(code);}else down.delete(code);}
  rememberDirection(code){const direction={ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],KeyS:[0,1]}[code],p=this.player;if(direction&&p){this.lastAim=p.aim={x:direction[0],y:direction[1]};if(direction[0])p.face=direction[0];}}
  action(action){
   if(this.paused||this.done)return;const p=this.player;if(!p)return;
   if(this.qte){this.qteInput(({ultimate:'Space',jump:['KeyW','ArrowUp'].includes(this.qte.sequence[this.qte.index])?this.qte.sequence[this.qte.index]:'Space',parry:'KeyF',right:'ArrowRight',left:'ArrowLeft',dodge:'KeyC'})[action]||action);return;}
   if(action==='swap'){for(let n=1;n<=this.party.length;n++){const i=(this.selected+n)%this.party.length;if(this.party[i].hp>0){this.selected=i;this.player.aim={...this.lastAim};if(this.lastAim.x)this.player.face=this.lastAim.x;this.banner(this.player.def.name,1);break;}}return;}
   if(p.stun>0)return;
   if(action==='jump'&&(p.z===0||p.onPlatform)){p.vz=p.def.jumpPower;p.onPlatform=false;}
   if(action==='dodge'&&p.dodgeCd<=0){p.phase=.42;p.dodgeCd=1.15;this.moveActor(p,p.face*150);this.effect(p.x,this.ground-p.z-70,'#b5ecff',50,'ring',.4);}
   if(action==='parry'&&p.guard<=0){p.parry=.24;p.guard=.8;this.effect(p.x,this.ground-p.z-75,'#fff1a5',60,'ring',.25);}
   if(action==='ultimate'&&p.ult>=100){p.ult=0;p.phase=.8;this.banner(p.def.name+' · '+p.def.ultimate.name,2);this.attack(p,p.def.ultimate,true);this.shake=12;}
   if(action.startsWith('attack')){const slot=Number(action.slice(6))-1,m=p.def.moves[slot];if(m&&p.cd[slot]<=0){p.cd[slot]=m.cooldown;this.attack(p,m);}}
  }
  moveActor(a,dx){
   const before=a.x;a.x=clamp(a.x+dx,this.floor.x+25,Math.min(this.W-25,this.floor.x+this.floor.w-25));
   for(const o of this.obstacles.filter(o=>o.type==='cover'&&o.hp>0)){if(this.ground-a.z>o.y&&this.ground-a.z-90<o.y+o.h&&Math.abs(a.x-(o.x+o.w/2))<o.w/2+22)a.x=dx>0?o.x-23:o.x+o.w+23;}
   a.walk=Math.abs(a.x-before)>.2;
  }
  target(a){return this.living(1-a.team).sort((b,c)=>Math.abs(b.x-a.x)-Math.abs(c.x-a.x))[0];}
  targets(a){return (this.config.friendlyFire?[...this.party,...this.enemies]:this.living(1-a.team)).filter(f=>f!==a&&f.hp>0);}
  effect(x,y,color,size,kind='burst',life=.5,label=''){this.fx.push({x,y,color,size,kind,life,t:0,label});if(this.fx.length>180)this.fx.shift();}
  hurt(source,target,damage,m={}){
   if(target.hp<=0||target.phase>0)return false;
   if(target.parry>0){target.ult=clamp(target.ult+14,0,100);if(source)source.stun=.85;this.effect(target.x,this.ground-target.z-90,'#fff6a6',90,'ring',.55,'PERFECT PARRY');this.parries++;this.score+=100;return false;}
   let power=damage*(source?.team===0?this.config.playerDamage:this.config.enemyDamage*this.difficulty);
   if(target.guard>0)power*=.35;if(target.shield>0){const blocked=Math.min(power,target.shield);target.shield-=blocked;power-=blocked;}
   target.hp=Math.max(0,target.hp-power);target.hit=.2;target.ult=clamp(target.ult+power/target.maxHp*70,0,100);
   if(source){source.ult=clamp(source.ult+power/20,0,100);if(source.team===0){this.combo++;this.comboTime=2.5;this.score+=Math.ceil(power);}}
   if(m.effect==='poison')target.poison=m.duration;if(m.effect==='burn')target.burn=m.duration;if(m.effect==='slow')target.slow=m.duration;if(m.effect==='stun')target.stun=Math.min(1.2,m.duration);if(m.effect==='drain'&&source)source.hp=clamp(source.hp+power*.25,0,source.maxHp);
   this.effect(target.x,this.ground-target.z-95,m.color||'#ffada4',24,'hit',.35,String(Math.round(power)));if(target.hp===0){this.score+=target.team?250:0;this.effect(target.x,this.ground-target.z-60,target.def.color,100,'burst',.7);}
   return true;
  }

  direction(a,m){
   let dir=a===this.player?{...a.aim}:{x:a.face,y:0};if(a!==this.player){const t=this.target(a);if(t){const dx=t.x-a.x,dy=(this.ground-t.z-t.def.hitHeight/2)-(this.ground-a.z-75),length=Math.hypot(dx,dy)||1;dir={x:dx/length,y:dy/length};}}
   const angle=(m.angle||0)*Math.PI/180;return{x:dir.x*Math.cos(angle)-dir.y*Math.sin(angle),y:dir.x*Math.sin(angle)+dir.y*Math.cos(angle)};
  }
  visual(a,m,dir,position){
   if(!m.asset)return;const x=position?.x??a.x+dir.x*m.offsetX,y=position?.y??this.ground-a.z+m.offsetY+dir.y*m.offsetX;
   this.fx.push({kind:'art',x,y,m,dir,t:0,life:m.visualDuration,color:m.color,label:m.showLabel?m.name:''});if(this.fx.length>180)this.fx.shift();
  }
  attack(a,m,ultimate=false){
   if(a.hp<=0||!m)return;a.anim=m.poseDuration;a.pose=m.attackSprite?{asset:m.attackSprite,left:m.poseDuration,style:m.attackSpriteStyle,width:m.poseWidth,height:m.poseHeight,facing:m.attackSpriteFacing}:null;
   const dir=this.direction(a,m),origin={x:a.x+dir.x*m.offsetX,y:this.ground-a.z+m.offsetY+dir.y*m.offsetX};
   if(m.kind!=='projectile'&&m.kind!=='beam')this.visual(a,m,dir);
   const effect=(x,y,size,kind='ring',life=m.visualDuration,label=m.name)=>{if(!m.asset||m.showColor)this.effect(x,y,m.color,size,kind,life,m.showLabel?label:'');};
   if(m.kind==='heal'){for(const f of this.living(a.team).filter(f=>Math.abs(f.x-a.x)<=m.range))f.hp=clamp(f.hp+m.damage,0,f.maxHp);effect(a.x,this.ground-a.z-70,90);return;}
   if(m.kind==='shield'){a.shield=clamp(a.shield+m.damage*2,0,2000);effect(a.x,this.ground-a.z-65,70);return;}
   if(m.kind==='freeze'){this.freeze=ultimate?3:Math.min(2,m.duration);this.freezeTeam=a.team;this.banner('ZA WARUDO · time stopped',this.freeze);this.living(1-a.team).forEach(f=>{if(Math.abs(f.x-a.x)<m.range)this.hurt(a,f,m.damage*.6,m);});return;}
   if(m.kind==='summon'){const side=a.team?this.enemies:this.party;if(side.filter(f=>f.hp>0).length>=10)return;const ally=this.actor({...a.def,name:m.name,hp:Math.min(220,a.maxHp*.3),size:a.def.size*.65,width:a.def.width*.65,height:a.def.height*.65,hitWidth:a.def.hitWidth*.65,hitHeight:a.def.hitHeight*.65},a.team,clamp(a.x+a.face*70,25,this.W-25));ally.temporary=10;side.push(ally);return;}
   if(m.kind==='dash'){a.phase=.3;this.moveActor(a,dir.x*m.range);if(dir.y<0){a.z=Math.min(this.ground-20,a.z-dir.y*m.range);a.vz=0;}effect(a.x,this.ground-a.z-65,100,'slash');for(const f of this.targets(a).filter(f=>Math.abs(f.x-a.x)<180))this.hurt(a,f,m.damage,m);return;}
   if(m.kind==='melee'||m.kind==='burst'){
    const range=m.range;for(const f of this.targets(a)){const dx=f.x-a.x,dy=a.z-f.z;if(Math.hypot(dx,dy)<=range+f.def.hitWidth/2&&(m.kind==='burst'||dx*dir.x+dy*dir.y>=-f.def.hitWidth/2))this.hurt(a,f,m.damage,m);}
    for(const o of this.obstacles)if(o.type==='cover'&&Math.abs(o.x-a.x)<range&&(m.kind==='burst'||(o.x-a.x)*dir.x>=0))o.hp-=m.damage;
    effect(origin.x,origin.y,range,m.kind==='melee'?'slash':'ring');return;
   }
   if(m.kind==='beam'){
    let length=m.range;const beamOrigin={x:a.x,y:this.ground-a.z+m.offsetY};
    const covers=[];for(const o of this.obstacles.filter(o=>o.type==='cover'&&o.hp>0)){let low=0,high=length;for(const [axis,size]of [['x','w'],['y','h']]){const velocity=dir[axis],start=beamOrigin[axis],min=o[axis]-m.size/2,max=o[axis]+o[size]+m.size/2;if(Math.abs(velocity)<1e-6){if(start<min||start>max){high=-1;break;}}else{let a=(min-start)/velocity,b=(max-start)/velocity;if(a>b)[a,b]=[b,a];low=Math.max(low,a);high=Math.min(high,b);}}if(high>=low&&high>=0)covers.push({o,d:Math.max(0,low)});}
    if(covers.length){const first=covers.sort((a,b)=>a.d-b.d)[0];length=first.d;first.o.hp-=m.damage;}
    const endX=beamOrigin.x+dir.x*length,endY=beamOrigin.y+dir.y*length;
    if(!m.asset||m.showColor)this.fx.push({kind:'beam',x:beamOrigin.x,y:beamOrigin.y,end:endX,endY,color:m.color,size:m.size,t:0,life:m.visualDuration,label:m.showLabel?m.name:''});
    this.visual(a,m,dir,{x:(beamOrigin.x+endX)/2,y:(beamOrigin.y+endY)/2});
    for(const f of this.targets(a)){const dx=f.x-beamOrigin.x,dy=this.ground-f.z-f.def.hitHeight/2-beamOrigin.y,along=dx*dir.x+dy*dir.y,across=Math.abs(dx*dir.y-dy*dir.x);if(along>=0&&along<length&&across<m.size/2+Math.min(f.def.hitWidth,f.def.hitHeight)/2)this.hurt(a,f,m.damage,m);}return;
   }
   const base=Math.atan2(dir.y,dir.x);for(let i=0;i<m.count;i++){const angle=base+(i-(m.count-1)/2)*m.spread;this.shots.push({x:origin.x,y:origin.y,vx:m.speed*Math.cos(angle),vy:m.speed*Math.sin(angle),life:m.range/m.speed+.2,source:a,m,hit:new Set()});}
   if(this.shots.length>220)this.shots.splice(0,this.shots.length-220);
  }
  startWave(){
   this.wave++;if(this.wave>=this.config.waves.length){if(this.config.mode==='survive'){this.wave=this.config.waves.length-1;}else{this.finish(true);return;}}
   this.enemies=this.config.waves[this.wave].enemies.map((f,i)=>this.actor(f,1,f.x??800+(i%4)*100));
   this.banner(this.config.waves[this.wave].name,2.5);this.waveDelay=-1;this.events.status?.(this);
  }
  startQte(spec,done){
   if(this.done||this.qte||!this.player)return false;
   this.qte={title:spec.title||'DOMAIN CLASH',sequence:spec.sequence||['KeyF','ArrowRight','Space'],index:0,left:spec.seconds||7,total:spec.seconds||7,done,kind:spec.kind||'sequence',hits:0,need:spec.need||12,failed:0};down.clear();this.events.qte?.(this.qte);
  }
  qteInput(code){
   const q=this.qte;if(!q||this.paused||this.done)return;
   if(q.kind==='mash'){if(code==='Space'||code==='KeyF'){q.hits++;if(q.hits>=q.need)this.endQte(true);}}
   else if(code===q.sequence[q.index]){q.index++;if(q.index>=q.sequence.length)this.endQte(true);}
   else if(['KeyF','ArrowRight','ArrowLeft','Space','KeyC','KeyW','ArrowUp'].includes(code)){q.failed++;q.left=Math.max(0,q.left-.6);}
   this.events.qte?.(this.qte);
  }
  endQte(success){const q=this.qte;if(!q)return;this.qte=null;down.clear();this.events.qte?.(null);this.banner(success?'PERFECT · power restored':'Recovery · keep fighting',2);if(success){this.score+=600;if(this.player)this.player.ult=100;}else if(this.player)this.hurt(null,this.player,this.player.maxHp*.12);this.qteResolved=true;this.events.status?.(this);q.done?.(success);if(!this.player)this.finish(false);else if(this.pendingWin)this.finish(true);}
  ai(a,dt){
   if(a.stun>0||a.hp<=0)return;const t=this.target(a);if(!t)return;const dx=t.x-a.x;a.face=Math.sign(dx)||1;
   const preferred=a.def.ai==='ranged'?430:a.def.ai==='rush'?80:210;
   if(a.def.ai!=='stationary'&&Math.abs(dx)>preferred)this.moveActor(a,Math.sign(dx)*a.def.speed*.5*dt);else if(a.def.ai==='ranged'&&Math.abs(dx)<200)this.moveActor(a,-Math.sign(dx)*a.def.speed*.35*dt);
   if(a.cast){a.cast.left-=dt;if(a.cast.left<=0){const i=a.cast.slot;a.cast=null;if(i===-1){a.ult=0;this.attack(a,a.def.ultimate,true);}else{a.cd[i]=a.def.moves[i].cooldown;this.attack(a,a.def.moves[i]);}a.ai=.9+this.random();}return;}
   if(a.ult>=100){a.cast={slot:-1,left:1.1,total:1.1,name:a.def.ultimate.name,color:a.def.ultimate.color};return;}
   a.ai-=dt;if(a.ai>0)return;const choices=a.def.moves.map((m,i)=>({m,i})).filter(({m,i})=>a.cd[i]<=0&&(m.kind!=='melee'||Math.abs(dx)<m.range+30));
   if(!choices.length){a.ai=.2;return;}const healing=a.def.ai==='support'&&this.living(a.team).some(f=>f.hp<f.maxHp*.8)?choices.find(x=>x.m.kind==='heal'):null;const {i,m}=healing||choices[Math.floor(this.random()*choices.length)];
   a.cast={slot:i,left:a.team?.65:.4,total:a.team?.65:.4,name:m.name,color:m.color};
   if(a.def.ai==='tank')a.shield=Math.max(a.shield,25);
  }
  update(dt){
   if(this.done||this.paused||document.hidden)return;dt=Math.min(dt,.034);
   this.messageTime=Math.max(0,this.messageTime-dt);this.shake=Math.max(0,this.shake-dt*40);
   if(this.qte){this.qte.left-=dt;if(this.qte.left<=0)this.endQte(false);this.events.qte?.(this.qte);return;}
   this.time+=dt;this.freeze=Math.max(0,this.freeze-dt);this.comboTime-=dt;if(this.comboTime<=0)this.combo=0;
   this.fx.forEach(f=>f.t+=dt);this.fx=this.fx.filter(f=>f.t<f.life);
   if(this.waveDelay>=0){this.waveDelay-=dt;if(this.waveDelay<=0)this.startWave();}if(this.done)return;
   const p=this.player;
   for(const a of [...this.party,...this.enemies]){
    a.walk=false;if(a.hp<=0){a.dead+=dt;continue;}if(this.freeze>0&&a.team!==this.freezeTeam)continue;
    if(a.pose){a.pose.left-=dt;if(a.pose.left<=0)a.pose=null;}for(const k of ['guard','parry','phase','dodgeCd','stun','hit','slow','anim'])a[k]=Math.max(0,a[k]-dt);a.cd=a.cd.map(c=>Math.max(0,c-dt));
    if(a.temporary){a.temporary-=dt;if(a.temporary<=0)a.hp=0;}
    if(a.burn>0){a.burn-=dt;a.hp=Math.max(0,a.hp-9*dt);}if(a.poison>0){a.poison-=dt;a.hp=Math.max(0,a.hp-6*dt);}
    const oldFoot=this.ground-a.z;
    if(a.z>0||a.vz>0){a.z+=a.vz*dt;a.vz-=this.config.gravity*dt;if(a.z<0){a.z=0;a.vz=0;}}
    let onPlatform=false;
    for(const o of this.obstacles){if(a.x<o.x-18||a.x>o.x+o.w+18)continue;
     if(o.type==='platform'&&a.vz<=0&&oldFoot<=o.y+12&&this.ground-a.z>=o.y){a.z=this.ground-o.y;a.vz=0;onPlatform=true;}
     if(Math.abs(this.ground-a.z-(o.y+o.h))<100&&a.x>=o.x&&a.x<=o.x+o.w){if(o.type==='hazard'&&a.phase<=0)a.hp=Math.max(0,a.hp-o.damage*dt);if(o.type==='heal')a.hp=Math.min(a.maxHp,a.hp+o.damage*dt);if(o.type==='bounce'&&a.vz<=0)a.vz=800;}
    }
    a.onPlatform=onPlatform;
    if(a===p&&a.stun<=0){const dir=(down.has('KeyD')||down.has('ArrowRight')?1:0)-(down.has('KeyA')||down.has('ArrowLeft')?1:0);if(dir){a.face=dir;this.moveActor(a,dir*a.def.speed*(down.has('ShiftLeft')?1.5:1)*(a.slow>0?.5:1)*dt);}if(onPlatform&&(down.has('KeyW')||(this.config.upArrowJumps&&down.has('ArrowUp'))))a.vz=a.def.jumpPower;}
    else this.ai(a,dt);
   }
   for(const s of this.shots){
    if(this.freeze>0&&s.source.team!==this.freezeTeam)continue;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
    for(const o of this.obstacles)if(o.type==='cover'&&o.hp>0&&rectHit({x:s.x-s.m.size,y:s.y-s.m.size,w:s.m.size*2,h:s.m.size*2},o)){o.hp-=s.m.damage;s.life=0;this.effect(s.x,s.y,s.m.color,40);break;}
    if(s.life<=0)continue;
    for(const t of this.targets(s.source)){if(s.hit.has(t.id))continue;if(Math.abs(t.x-s.x)<t.def.hitWidth/2+s.m.size&&Math.abs(this.ground-t.z-t.def.hitHeight/2-s.y)<t.def.hitHeight/2+s.m.size){s.hit.add(t.id);this.hurt(s.source,t,s.m.damage,s.m);if(!s.m.pierce){s.life=0;break;}}}
   }
   this.shots=this.shots.filter(s=>s.life>0&&s.x>-100&&s.x<this.W+100&&s.y>-100&&s.y<this.H+100);
   if(this.events.hazard){this.nextHazard-=dt;if(this.nextHazard<=0&&!this.hazard){this.nextHazard=7;this.hazard={x:p?.x||640,left:1.25};}if(this.hazard){this.hazard.left-=dt;if(this.hazard.left<=0){this.living(0).filter(a=>Math.abs(a.x-this.hazard.x)<90&&a.z<80).forEach(a=>this.hurt(null,a,55));this.effect(this.hazard.x,560,'#ff6f91',110,'burst',.8);this.hazard=null;}}}
   this.events.tick?.(this,dt);if(this.done||this.qte||this.dialogueActive)return;
   if(!this.player){this.finish(false);return;}
   if(this.config.mode==='survive'&&this.time>=this.config.duration){this.finish(!this.events.requiresObjective||!!this.objectiveComplete);return;}
   if(this.wave>=0&&!this.living(1).length&&this.waveDelay<0){this.waveDelay=this.config.waves[Math.min(this.wave+1,this.config.waves.length-1)].delay;this.party=this.party.filter(a=>!a.temporary);this.living(0).forEach(a=>a.hp=Math.min(a.maxHp,a.hp+a.maxHp*(this.config.mode==='bossrush'?.04:.12)));}
   this.events.status?.(this);
  }
  finish(won){if(this.done)return;if(won&&this.qte){this.pendingWin=true;return;}this.done=true;this.qte=null;this.events.qte?.(null);down.clear();this.events.finish?.({won,score:this.score,time:this.time,parries:this.parries,rank:won?(this.parries>=3?'S':this.player?.hp>this.player?.maxHp*.55?'A':'B'):'Retry'});}
  text(text,x,y,size=22,color='#fff',align='center'){const c=this.ctx;c.font=`700 ${size}px Arial`;c.textAlign=align;c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#111b';c.strokeText(text,x,y);c.fillStyle=color;c.fillText(text,x,y);}
  render(){
   const c=this.ctx,W=this.W,H=this.H;c.save();c.clearRect(0,0,W,H);c.fillStyle='#101826';c.fillRect(0,0,W,H);if(this.shake&&this.config.screenShake)c.translate((this.random()-.5)*this.shake,(this.random()-.5)*this.shake);
   c.save();c.beginPath();c.rect(0,0,W,H);c.clip();const br=this.config.backgroundRect;RombiesMedia.draw(c,this.config.background,br.x,br.y,br.w,br.h,'cover',br);c.restore();
   if(this.config.scene&&window.RombiesSceneDraw){c.save();c.scale(W/1280,H/720);for(const m of this.config.scene.masks){c.fillStyle=m.color;c.fillRect(m.x,m.y,m.w,m.h);}const source=ROMBIES_SCENES[this.config.scene.slide-1];RombiesSceneDraw(c,{...source,items:source.items.filter(o=>this.config.scene.ids.includes(o.id)),cues:[]},10,100,{transparent:true,hideText:true});c.restore();}
   if(this.floor.visible){const f=this.floor;c.fillStyle=f.color;c.fillRect(f.x,f.y,f.w,f.h);if(f.asset)RombiesMedia.tile(c,f.asset,f.x,f.y,f.w,f.h,f);c.fillStyle=this.config.color;c.fillRect(f.x,f.y,f.w,3);}
   if(this.freeze>0){c.fillStyle='#b0befc50';c.fillRect(0,0,W,H);}
   for(const o of this.obstacles){if(o.type==='cover'&&o.hp<=0)continue;c.fillStyle=o.color;c.globalAlpha=.65;c.fillRect(o.x,o.y,o.w,o.h);c.globalAlpha=1;if(o.asset)RombiesMedia.draw(c,o.asset,o.x,o.y,o.w,o.h,'stretch',o);c.strokeStyle='#fff9';c.lineWidth=2;c.strokeRect(o.x,o.y,o.w,o.h);this.text(o.name,o.x+o.w/2,o.y-12,13);}
   if(this.hazard){c.fillStyle='#ff345666';c.fillRect(this.hazard.x-90,100,180,500);this.text('DODGE!',this.hazard.x,180,22,'#ffe69c');}
   if(this.collectible){const o=this.collectible;c.fillStyle=o.color||'#b5ffd3';c.globalAlpha=.25+.15*Math.sin(this.time*5);c.fillRect(o.x-38,440,76,160);c.globalAlpha=1;c.strokeStyle=o.color||'#b5ffd3';c.lineWidth=4;c.strokeRect(o.x-38,440,76,160);this.text(o.label,o.x,417,20);}
   if(this.objectiveText)this.text(this.objectiveText,640,675,22,'#c5ffdf');
   for(const a of [...this.party,...this.enemies].sort((a,b)=>a.x-b.x))this.drawActor(a);

   for(const s of this.shots){let drawn=false;if(s.m.asset)drawn=this.drawAttackArt(s.m,s.x,s.y,{x:s.vx,y:s.vy});if(!s.m.asset||s.m.showColor||!drawn){c.fillStyle=s.m.color;c.shadowColor=s.m.color;c.shadowBlur=12;c.beginPath();c.arc(s.x,s.y,s.m.size,0,Math.PI*2);c.fill();c.shadowBlur=0;}if(s.m.showLabel)this.text(s.m.name,s.x,s.y-s.m.artHeight/2-15,15,'#fff');}
   for(const f of this.fx){const u=f.t/f.life;c.globalAlpha=1-u;
    if(f.kind==='art'){if(!this.drawAttackArt(f.m,f.x,f.y,f.dir)){c.strokeStyle='#f0f4ff';c.lineWidth=3;c.strokeRect(f.x-f.m.artWidth/2,f.y-f.m.artHeight/2,f.m.artWidth,f.m.artHeight);}}
    else{c.strokeStyle=f.color;c.fillStyle=f.color;c.lineWidth=f.kind==='beam'?f.size:5;
     if(f.kind==='beam'){c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.end,f.endY??f.y);c.stroke();}
     else if(f.kind==='slash'){c.beginPath();c.arc(f.x,f.y,Math.min(f.size,150)*(u+.4),-.9,.9);c.stroke();}
     else{c.beginPath();c.arc(f.x,f.y,Math.max(2,f.size*(.3+u*.7)),0,Math.PI*2);if(f.kind==='ring')c.stroke();else{c.globalAlpha=(1-u)*.6;c.fill();}}
    }
    c.globalAlpha=1;if(f.label)this.text(f.label,f.x,f.y-40-u*30,18,'#f5f7ff');
   }
   if(this.combo>=3)this.text(this.combo+' HIT COMBO',W-160,Math.min(170,H*.24),25,'#edffb3');
   if(this.messageTime>0){c.fillStyle='#061121d9';c.fillRect(W*.15,100,W*.7,48);this.text(this.message,W/2,124,24,'#e8fff4');}
   if(this.qte&&!this.events.domQte){const q=this.qte;c.fillStyle='#071326e8';c.fillRect(150,210,980,290);this.text(q.title,640,255,32,'#edffb3');const label=code=>({KeyF:'F',ArrowRight:'→',ArrowLeft:'←',Space:'SPACE',KeyC:'C',KeyW:'W'}[code]||code);
    this.text(q.kind==='mash'?`MASH SPACE · ${q.hits}/${q.need}`:q.sequence.map((k,i)=>i<q.index?'✓':label(k)).join('   '),640,340,38,'#fff');c.fillStyle='#ffffff33';c.fillRect(280,415,720,12);c.fillStyle='#95efbf';c.fillRect(280,415,720*Math.max(0,q.left/q.total),12);this.text(Math.ceil(q.left)+'s',640,465,18);}
   c.restore();
  }

  drawAttackArt(m,x,y,dir){const angle=Math.atan2(dir.y,dir.x),left=dir.x<0;return RombiesMedia.draw(this.ctx,m.asset,x-m.artWidth/2,y-m.artHeight/2,m.artWidth,m.artHeight,m.artFit,{...m,rotation:m.rotation+(angle-(left?Math.PI:0))*180/Math.PI,flipX:m.flipX!==left});}
  drawActor(a){

   const c=this.ctx;if(a.hp<=0&&a.dead>1.2)return;const f=a.def,key=a.pose?.asset||f.sprite,poseStyle=a.pose?.style,width=a.pose?.width||f.width,im=RombiesMedia.get(key),bounds=((poseStyle?.trim??f.trim)&&(window.ROMBIES_ART?.[key]?.bounds||im?.bounds)),aspect=bounds?(bounds[3]-bounds[1])/(bounds[2]-bounds[0]):im?.naturalWidth?im.height/im.width:1,height=f.spriteFit==='stretch'?(a.pose?.height||f.height):Math.min(a.pose?.height||f.height,width*aspect),y=this.ground-a.z;
   if(f.showAura){c.fillStyle='#02071755';c.beginPath();c.ellipse(a.x,this.ground+2,Math.min(width/2,160),10,0,0,Math.PI*2);c.fill();if(a.hp>0){c.strokeStyle=f.color;c.lineWidth=2;c.stroke();}}
   c.save();c.translate(a.x,y);if(a.hp<=0){c.rotate(a.face*1.4);c.globalAlpha=Math.max(0,1-a.dead/1.2);}else if(a.phase>0)c.globalAlpha=.45;
   if(a.walk&&f.wiggle&&this.config.wiggle)c.rotate(Math.sin(this.time*17)*.04);if(a.anim>0&&f.attackLunge)c.translate(a.face*15,-3);if(a.hit>0)c.filter='brightness(1.8)';
   const facing=a.pose?.facing&&a.pose.facing!=='inherit'?a.pose.facing:f.spriteFacing,autoFlip=f.followFacing&&(a.face<0)!==(facing==='left'),style={...f,rotation:f.rotation+(poseStyle?.rotation||0),opacity:f.opacity*(poseStyle?.opacity??1),trim:poseStyle?.trim??f.trim,flipX:(f.flipX!==autoFlip)!==!!poseStyle?.flipX,flipY:f.flipY!==!!poseStyle?.flipY};
   if(!RombiesMedia.draw(c,key,-width/2,-height,width,height,f.spriteFit==='stretch'?'stretch':'feet',style)){c.fillStyle=f.color;c.fillRect(-width*.3,-height,width*.6,height);this.text(f.name,0,-height/2,16);}
   c.restore();if(a.hp<=0)return;
   if(a.shield>0||a.guard>0){c.strokeStyle=a.parry>0?'#fff4a2':'#9fc6ff';c.lineWidth=4;c.beginPath();c.ellipse(a.x,y-height*.55,width*.65,height*.65,0,0,Math.PI*2);c.stroke();}
   const bw=96;if(f.showHealth){c.fillStyle='#0009';c.fillRect(a.x-bw/2,y-height-18,bw,6);c.fillStyle=a.team?'#ff7a90':'#98f2c0';c.fillRect(a.x-bw/2,y-height-18,bw*a.hp/a.maxHp,6);}if(f.showName)this.text(f.name,a.x,y-height-34,15);
   if(this.config.showHitboxes){c.strokeStyle=a.team?'#ff96a5':'#90ffbe';c.lineWidth=2;c.strokeRect(a.x-f.hitWidth/2,y-f.hitHeight,f.hitWidth,f.hitHeight);}
   if(a===this.player){c.fillStyle='#c4ffe0';c.beginPath();c.moveTo(a.x-10,y+10);c.lineTo(a.x+10,y+10);c.lineTo(a.x,y+2);c.fill();const dir=a.aim;c.strokeStyle='#c4ffe0';c.lineWidth=3;c.beginPath();c.moveTo(a.x,y-f.hitHeight/2);c.lineTo(a.x+dir.x*38,y-f.hitHeight/2+dir.y*38);c.stroke();}
   if(a.cast){c.fillStyle='#ffde75';c.fillRect(a.x-50,y-height-65,100*(1-a.cast.left/a.cast.total),5);this.text(a.cast.name,a.x,y-height-82,16,'#fff0a0');}
  }
  destroy(){this.qte=null;this.events.qte?.(null);down.clear();removeEventListener('keydown',this.listener);removeEventListener('keyup',this.release);removeEventListener('blur',this.blur);document.removeEventListener('visibilitychange',this.visibility);this.done=true;}
 }
 window.RombiesArena=Arena;
})();
