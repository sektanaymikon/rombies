/* The Night of the Living Rombies — October 2026 story revision. */
(() => {
'use strict';
const {CHAR, BATTLES, SCENES, LEGACY_ORDER} = GAME_DATA;
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d');
const W = 1280, H = 720, FLOOR = 580, SAVE_KEY = 'rombies_story_v2';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const testMode = new URLSearchParams(location.search).has('test');
let seed = 78342, uid = 0;
const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
const images = {}, assetErrors = [], history = [];
const record = (type, detail={}) => { history.push({type, ...detail}); if(history.length>2500) history.shift(); };
const paths = [...new Set(Object.values(ASSETS).flatMap(o => typeof o==='object' ? Object.values(o).filter(x=>typeof x==='string') : []))];
const assetsReady = Promise.all(paths.map(path => new Promise(resolve => {
 const im = new Image(); images[path] = im; im.onload=()=>resolve(true); im.onerror=()=>{assetErrors.push(path);resolve(false);}; im.src=path;
})));
const spritePath = key => ASSETS.sprites[key] || ASSETS.sprites[CHAR[key]?.sprite];
const pic = key => images[spritePath(key)];
const freshSave = () => ({version:2, checkpoint:{battleId:BATTLES[0].id, phase:'scene', wave:0}, completed:[], difficulty:1, music:.22, wiggle:true});
let save = freshSave();
try {
 const data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
 if(data?.version===2) save={...save,...data};
 else {
  // Previous builds used numeric indices. Convert them before the reordered story is loaded.
  for(const key of ['rombies_save_v1','rombies_story_save','rombies_save','rombies_story_v1']) {
   const old=JSON.parse(localStorage.getItem(key)||'null'); if(!old)continue;
   const n=Number(old.checkpoint?.battle ?? old.checkpoint ?? old.battleIndex ?? 0);
   save.checkpoint={battleId:LEGACY_ORDER[n]||BATTLES[0].id, phase:'scene',wave:0};
   save.completed=(old.completed||[]).map(x=>typeof x==='number'?LEGACY_ORDER[x]:x).filter(x=>BATTLES.some(b=>b.id===x)); break;
  }
 }
} catch (_) { /* A damaged save never prevents the title screen from loading. */ }
function persist() { try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(_){toast('Browser storage is unavailable. Use Export Data to keep your checkpoint.');} }
let state;
function resetState(mode='menu') {
 state={mode, index:0, wave:0, party:[], enemies:[], reserve:[], extras:[], projectiles:[], effects:[], tasks:[], selected:0,
  time:0, visualTime:0, room:'lab', fired:new Set(), qteDone:false, cinematic:null, event:null, dialogue:null,
  paused:false, independent:false, ending:false, waveReady:false, aiLock:0, enemyCinema:0, hazard:18, pending:null, fuseArmed:false,
  scene:null, maze:null, qte:null, trial:null, banner:'', bannerTime:0, inputCooldown:0};
 keys.clear(); ['dialogue','qte','pause','endChapter'].forEach(id=>$(id).style.display='none');
 $('settingsModal').classList.remove('open'); $('shell').classList.toggle('battle-active',mode!=='menu');
}
const keys=new Set(); resetState();
function toast(text) {$('toast').textContent=text;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',3200);}
function banner(text, seconds=2) {state.banner=text;state.bannerTime=seconds;}
function screen(id) {
 document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('active',el.id===id));
 $('hud').style.display=id?'none':'block';
 if(id) {state.paused=false; $('shell').classList.remove('battle-active');keys.clear();}
}
function menu(id='main'){resetState(); screen(id); renderBattleSelect(); music.update();}
function checkpoint(phase='battle') {
 if(state.independent)return;
 save.checkpoint={battleId:BATTLES[state.index].id, phase, wave:state.wave}; persist();
}
function actor(key,team,x,form=0) {
 if(!CHAR[key])throw new Error('Unknown character: '+key);
 const c=CHAR[key], difficulty=team===1?save.difficulty:1;
 return {id:++uid,key,team,x,y:FLOOR,z:0,vz:0,face:team===0?1:-1,def:c,form,sprite:c.forms?.[form]||c.sprite,
  hp:c.hp*difficulty,maxHp:c.hp*difficulty,cd:[0,0,0,0],ult:0,ultLock:0,stand:false,rombie:false,
  shield:0,protect:0,invisible:0,phase:0,stun:0,buff:0,poison:0,poisonTick:0,poisonSource:null,burn:0,
  hit:0,attack:0,attackSlot:0,move:0,ai:.8+random(),telegraph:null,banished:false,deadTime:0,
  summon:0,temporary:false,noMeter:false,scale:c.scale||1,damageScale:1};
}
function player() {
 let p=state.party[state.selected];
 if(!p || p.hp<=0 || p.banished) {
  const next=state.party.findIndex(a=>a.hp>0&&!a.banished&&!a.temporary);
  if(next<0)return null; state.selected=next;p=state.party[next];
 }
 return p;
}
function switchPlayer() {
 const p=player(); if(!p)return;
 for(let n=1;n<=state.party.length;n++) {
  const i=(state.selected+n)%state.party.length, a=state.party[i];
  if(a.hp>0&&!a.banished&&!a.temporary){state.selected=i;state.pending=null;banner(a.def.name,1);break;}
 }
}
function living(team) {return (team===0?state.party:state.enemies).filter(a=>a.hp>0&&!a.banished);}
function targetFor(a) {return living(1-a.team).filter(e=>e.invisible<=0).sort((x,y)=>Math.abs(x.x-a.x)-Math.abs(y.x-a.x))[0];}
function findActor(key) {return [...state.party,...state.enemies,...state.extras].find(a=>a.key===key);}
function abilities(a) {
 if(a.rombie)return a.def.rombieAbilities;
 if(a.stand&&a.def.standAbilities)return a.def.standAbilities;
 if(a.key==='raleigh' && BATTLES[state.index]?.raleighRombie) return [...a.def.abilities.slice(0,3),['4','Rombie Mode','rombie_toggle',0,1]];
 return a.def.abilities;
}
function arrangeParty(list,forms={}) {state.party=list.map((key,i)=>actor(key,0,190+i*92,forms[key]||0));state.selected=0;}
function startScene(index,independent=false) {
 resetState('scene');screen(null);state.index=index;state.independent=independent;
 const b=BATTLES[index], s=SCENES[b.id];state.room=s.room;state.scene={data:s,step:0};
 arrangeParty(s.party,s.forms);checkpoint('scene');banner(s.title,3);record('sceneStart',{id:b.id});music.start();
}
function startBattle(index,independent=false,wave=0) {
 resetState('battle');screen(null);state.index=index;state.independent=independent;state.wave=wave;
 const b=BATTLES[index];state.room=b.rooms[0];arrangeParty(b.party,b.initialForms);
 checkpoint();banner(b.title,3);record('battleStart',{id:b.id});music.start();
 const begin=()=>{if(b.maze){state.mode='maze';state.room='backrooms';generateMaze();}else beginWave(wave);};
 // Actors used in introductory death/summoning scenes are scenery until combat begins.
 if(b.id==='rohito')state.extras.push(actor('oliver',0,640));
 if(wave>0)begin();else dialogue(b.pre||[],begin);
}
function beginWave(wave) {
 const b=BATTLES[state.index];state.wave=wave;state.waveReady=false;state.pending=null;state.projectiles=[];state.extras=[];
 if(wave>=b.waves.length){finishBattle();return;}
 const w=b.waves[wave];if(w.room!==undefined)state.room=b.rooms[w.room];
 state.enemies=[];state.reserve=w.enemies.flatMap(([key,count])=>Array.from({length:count},()=>key));
 const spawn=()=>{
  fillEnemies();state.waveReady=true;checkpoint();banner(w.objective,2.5);
  if(b.qte?.wave===wave&&!state.qteDone){state.qteDone=true;startQte(b.qte.type);}
 };
 dialogue(b.waveLines?.[wave]||[],spawn);
}
function fillEnemies(){
 while(state.enemies.filter(a=>a.hp>0).length<3&&state.reserve.length){
  const a=actor(state.reserve.shift(),1,850+state.enemies.filter(e=>e.hp>0).length*120);
  a.ai=1.6+random();state.enemies.push(a);
 }
}
function finishBattle() {
 if(state.ending)return;state.ending=true;state.waveReady=false;state.projectiles=[];
 const b=BATTLES[state.index];record('battleWon',{id:b.id});
 if(!save.completed.includes(b.id))save.completed.push(b.id);persist();
 dialogue(b.post||[],()=>{
  if(state.independent){showResult('Battle complete',b.title,()=>menu('battleSelect'));return;}
  if(state.index===BATTLES.length-1){state.mode='complete';$('endChapter').style.display='flex';$('hud').style.display='none';$('shell').classList.remove('battle-active');save.checkpoint={battleId:b.id,phase:'complete',wave:0};persist();return;}
  startScene(state.index+1);
 });
}
function showResult(title,text,done) {state.mode='result';modal(title,text,[['Continue',done]]);}
function defeat(){if(state.mode!=='battle')return;state.mode='defeat';state.pending=null;modal('The team is down','Try again from this encounter. Your story checkpoint is safe.',[['Retry',()=>startBattle(state.index,state.independent)],['Battle Select',()=>menu('battleSelect')]]);}

function dialogue(lines,done=()=>{}) {
 if(!lines.length){done();return;}
 state.pending=null;state.dialogue={lines,index:0,done};$('dialogue').style.display='block';showLine();
}
function showLine() {
 const d=state.dialogue, line=d?.lines[d.index];if(!line)return;
 $('dialogueSpeaker').textContent=line.speaker;$('dialogueText').textContent=line.text;
 const path=spritePath(line.portrait||line.speaker.toLowerCase().replaceAll(' ','_'));
 $('portrait').style.visibility=path?'visible':'hidden';if(path)$('portrait').src=path;
 record('dialogue',{speaker:line.speaker,text:line.text});
}
function nextDialogue() {
 const d=state.dialogue;if(!d||state.event)return;
 const line=d.lines[d.index];
 const advance=()=>{if(state.dialogue!==d)return;d.index++;if(d.index<d.lines.length)showLine();else{state.dialogue=null;$('dialogue').style.display='none';d.done();}};
 if(line.action){$('dialogue').style.display='none';animateAction(line.action,()=>{$('dialogue').style.display='block';advance();});}else advance();
}
function skipDialogue() {
 const d=state.dialogue;if(!d)return;
 let start=d.index;
 if(state.event){const ev=state.event;state.event=null;ev.commit();start++;}
 for(let i=start;i<d.lines.length;i++)if(d.lines[i].action)applyAction(d.lines[i].action);
 state.dialogue=null;$('dialogue').style.display='none';d.done();
}
function animateAction(action,done=()=>{}) {
 let a=findActor(action.key||action.target);
 if(action.type==='kidnap'&&a&&a.hp<=0){a.hp=1;a.deadTime=0;}
 if(!a&&['death','belly_slap','summon_enemy'].includes(action.type)) {
  const key=action.key||(action.type==='belly_slap'?'michael':action.target);a=actor(key,1,760);state.extras.push(a);
 }
 state.event={action,actor:a,elapsed:0,duration:action.type==='source_slide'?3.5:2.1,commit:()=>applyAction(action),done};
 record('animation',{action:action.type,key:action.key||action.target});
}
function applyAction(action) {
 const a=findActor(action.key||action.target||(action.type==='belly_slap'?'michael':null));record('action',action);
 switch(action.type){
 case 'death': if(a){a.hp=0;a.deadTime=1;}break;
 case 'evolve': if(a){a.form=action.form||0;a.sprite=a.def.forms?.[a.form]||action.sprite||a.sprite;a.shield+=65;banner(a.def.name+' evolved!',2);}break;
 case 'join': if(!state.party.some(p=>p.key===action.key&&p.hp>0))state.party.push(actor(action.key,0,340,action.form||0));break;
 case 'leave':case 'kidnap':case 'turn_rombie':state.party=state.party.filter(p=>p.key!==action.key);state.selected=0;break;
 case 'domain_kill': if(a){a.hp=0;a.deadTime=0;}break;
 case 'belly_slap': if(a)a.hp=0; if(findActor('rohito'))findActor('rohito').hp=Math.max(1,findActor('rohito').hp*.2);break;
 case 'heal_party':state.party.forEach(p=>p.hp=p.maxHp);break;
 case 'build_mech':state.extras.push(actor('aqua_mech',0,820));break;
 }
 player();
}
function interact() {
 if(state.dialogue){nextDialogue();return;}if(state.event)return;
 if(state.mode==='scene'){
  const s=state.scene,p=player(),x=sceneTargetX();if(!p)return;
  if(Math.abs(p.x-x)>105){banner('Move to the glowing marker, then press E.',2);return;}
  const step=s.data.steps[s.step];
  dialogue([{speaker:step.speaker,text:step.text,portrait:step.speaker.toLowerCase().replaceAll(' ','_'),action:step.action}],()=>{
   s.step++;if(s.step>=s.data.steps.length)startBattle(state.index,state.independent);else banner(s.data.steps[s.step].label,2);
  });
 }
}
const sceneTargetX=()=>[720,1040,300,930][state.scene?.step||0];

// A single combat clock owns cooldowns, buffs and delayed attacks. Pausing cannot leak a hit into another fight.
function schedule(delay,fn){state.tasks.push({left:delay,fn});}
function effect(kind,x,y,color,power=1,extra={}){state.effects.push({kind,x,y,color,power,t:0,life:extra.life||.7,...extra});}
function damage(a,t,amount,options={}) {
 if(!t||t.hp<=0||t.banished||(!options.force&&(t.phase>0||t.invisible>0)))return 0;
 if(t.hit>0&&!options.force)return 0;
 let n=amount*(a?.damageScale||1)*(a?.buff>0?1.55:1)*(a?.team===1?save.difficulty*.68:1);
 if(a?.key==='saul'&&options.melee&&state.trial?.sword==='lethal')n=t.hp+t.shield+1;
 else if(a?.key==='saul'&&options.melee&&state.trial?.sword==='confession')n*=2.5;
 if(t.protect>0)n*=.45;
 if(options.oneshot || (a?.key==='saul'&&options.melee&&state.trial?.sword==='lethal'))n=t.hp+t.shield;
 const blocked=Math.min(t.shield,n);t.shield-=blocked;n-=blocked;
 let after=Math.max(0,t.hp-n);
 if(t.team===1&&!options.force&&!options.oneshot){
  const threshold=nextThreshold(t);if(threshold!==null&&t.hp>t.maxHp*threshold)after=Math.max(after,t.maxHp*threshold);
 }
 const actual=t.hp-after;t.hp=after;t.hit=options.dot ? .05 : .15;
 if(actual>0){effect('number',t.x,FLOOR-155-t.z,a?.def.theme[0]||'#fff',actual,{life:.75,text:Math.ceil(actual)});}
 if(!options.noMeter&&!a?.noMeter){if(a&&a.hp>0)a.ult=clamp(a.ult+actual*.09,0,100);t.ult=clamp(t.ult+actual*.035,0,100);}
 if(t.hp<=0){t.deadTime=0;record('death',{key:t.key,team:t.team});if(t.key==='nande')releaseBanished(t);player();}
 return actual;
}
function nextThreshold(t) {
 const b=BATTLES[state.index];if(t.key!==b.boss&&t.originalKey!==b.boss)return null;
 const gates=(b.mid||[]).map((m,i)=>({...m,gate:'mid'+i})).filter(m=>!state.fired.has(m.gate)&&(m.wave===undefined||m.wave===state.wave));
 if(b.qte?.at&&!state.qteDone)gates.push({...b.qte,gate:'qte'});
 const ratios=gates.map(m=>m.at).filter(at=>t.hp/t.maxHp>at+.00001);return ratios.length?Math.max(...ratios):null;
}
function getBoss(){const b=BATTLES[state.index];return state.enemies.find(a=>a.hp>0&&(a.key===b.boss||a.originalKey===b.boss))||state.enemies.find(a=>a.hp>0);}
function checkStoryTriggers(){
 const b=BATTLES[state.index],boss=getBoss();if(!boss)return;
 if(b.boss&&boss.key!==b.boss&&boss.originalKey!==b.boss)return;
 const ratio=boss.hp/boss.maxHp;
 if(b.qte?.at&&!state.qteDone&&ratio<=b.qte.at+.00001){state.qteDone=true;startQte(b.qte.type);return;}
 const i=(b.mid||[]).findIndex((m,i)=>!state.fired.has('mid'+i)&&(m.wave===undefined||m.wave===state.wave)&&ratio<=m.at+.00001);
 if(i<0)return;const m=b.mid[i];state.fired.add('mid'+i);
 if(m.room!==undefined)state.room=b.rooms[m.room];
 dialogue(m.lines||[],()=>{
  const follow=()=>{
   if(m.action==='choso_ashes'){const choso=findActor('choso');if(choso){choso.hp=0;player();}}
   if(m.move){const caster=findActor(m.caster)||((m.lines?.[0]?.portrait&&findActor(m.lines[0].portrait))||boss); cinematic(caster,m.move,0,{scripted:true,noMeter:true});}
  };
  if(m.evolve){const old= boss.key;animateAction({type:'evolve',key:old,sprite:CHAR[m.evolve].sprite},()=>{boss.originalKey=b.boss;boss.key=m.evolve;boss.def=CHAR[m.evolve];boss.sprite=CHAR[m.evolve].sprite;follow();});}else follow();
 });
}
function requestAttack(slot) {
 const a=player();if(!a||state.mode!=='battle'||state.dialogue||state.event||state.cinematic||state.qte||state.paused)return;
 const ab=abilities(a)[slot];if(!ab||a.cd[slot]>0||a.stun>0)return;
 const attackTypes=['melee','rush','projectile','blast','cinematic','poison_melee','poison_projectile','burning','barrage','lift','stun','phase','oneshot','selfdestruct'];
 if(!attackTypes.includes(ab[2])){flushPending();useAbility(a,slot);return;}
 if(state.pending&&state.pending.actor===a&&state.pending.slot!==slot){
  const prior=state.pending;state.pending=null;state.fuseArmed=false;fuse(a,prior.slot,slot);return;
 }
 if(state.pending)return;
 state.pending={actor:a,slot,left:state.fuseArmed?2:.16};
}
function flushPending(){const p=state.pending;state.pending=null;if(p&&p.actor.hp>0)useAbility(p.actor,p.slot);}
function fuse(a,s1,s2) {
 const aa=abilities(a),x=aa[s1],y=aa[s2];if(a.cd[s1]>0||a.cd[s2]>0)return;
 a.cd[s1]=Math.max(2,x[4]);a.cd[s2]=Math.max(2,y[4]);
 record('fusion',{key:a.key,slots:[s1,s2]});
 cinematic(a,x[1]+' × '+y[1],Math.min(500,(x[3]+y[3])*1.3),{fusion:true,noMeter:true,motifs:[s1,s2]});
}
function ultimate(){
 const a=player();if(!a||state.mode!=='battle'||state.dialogue||state.event||state.qte||state.cinematic||state.paused||a.stun>0)return false;
 if(a.ult<100||a.ultLock>0){banner('Ultimate '+Math.floor(a.ult)+'% — land regular attacks to charge.',1.4);return false;}
 state.pending=null;a.ult=0;a.ultLock=8;record('ultimate',{key:a.key});
 const [name,type,power]=a.def.ultimate;
 if(type==='buff'){perform(a,['U',name,type,power,0],{noMeter:true,ultimate:true});}
 else if(type==='summon'){perform(a,['U',name,type,power,0],{noMeter:true,ultimate:true});}
 else cinematic(a,name,Math.min(600,power),{noMeter:true,ultimate:true});return true;
}
function useAbility(a,slot,options={}) {
 const ab=abilities(a)[slot];if(!ab||a.cd[slot]>0||a.hp<=0||a.stun>0)return false;
 a.cd[slot]=Math.max(ab[4],a.team===1?1.4:0);a.attack=.4;a.attackSlot=slot;
 record('ability',{key:a.key,slot,type:ab[2]});perform(a,ab,options);return true;
}
function releaseBanished(a){for(const e of state.enemies)if(e.banishedBy===a.id){e.banished=false;e.banishedBy=null;e.x=1000;effect('portal',e.x,FLOOR-60,'#bda0ff',1,{life:1});}}
function perform(a,ab,options={}) {
 const [,name,type,power]=ab,t=targetFor(a),color=a.def.theme[0];
 options={...options,motif:moveVisual(a,name)};
 if(t)a.face=t.x>=a.x?1:-1;
 const hit=(target,p=power,extra={})=>damage(a,target,p,{...options,...extra});
 if(type==='toggle'){a.stand=!a.stand;a.cd=[.2,.2,.2,.2];banner(a.stand?a.def.standName+' summoned':'Stand dismissed',1.3);effect('aura',a.x,FLOOR-60,color,1,{life:1});return;}
 if(type==='rombie_toggle'){a.rombie=!a.rombie;a.sprite=a.rombie?'rombie_raleigh':a.def.sprite;a.cd=[.2,.2,.2,.2];banner(a.rombie?'Rombie Mode':'Raleigh restored',1.3);effect('aura',a.x,FLOOR-60,color,1,{life:1});return;}
 if(type==='heal'){living(a.team).forEach(p=>{p.hp=Math.min(p.maxHp,p.hp+power);effect('music',p.x,FLOOR-70,color,1,{life:1.2});});releaseBanished(a);banner(name,1.3);return;}
 if(type==='banish'){if(t){t.banished=true;t.banishedBy=a.id;effect('portal',t.x,FLOOR-80,color,1,{life:1.2});banner(t.def.name+' sent to space. Healing Music brings them back.',2.5);}return;}
 if(type==='invisible'){a.invisible=5;effect('smoke',a.x,FLOOR-60,color);return;}
 if(type==='buff'){a.buff=power;effect('gamble',a.x,FLOOR-60,color,1,{life:2});banner('JACKPOT — speed and strength for 1:44',3);return;}
 if(type==='selfprotect'||type==='protector'){(type==='protector'?living(a.team):[a]).forEach(p=>{p.shield=Math.max(p.shield,power);p.protect=6;});effect('shield',a.x,FLOOR-70,color,1,{life:1});return;}
 if(type==='summon'){
  state.party=state.party.filter(p=>!(p.temporary&&p.owner===a.id));
  const ally=actor('ironman_polyester',a.team,a.x+85);ally.temporary=true;ally.owner=a.id;ally.summon=8;ally.noMeter=true;ally.damageScale=options.ultimate?3:2.2;
  (a.team===0?state.party:state.enemies).push(ally);effect('summon',ally.x,FLOOR-75,color,1,{life:1.5});cinematic(a,name,0,{...options,scripted:true,noMeter:true});return;
 }
 if(type==='swap'){if(t){const x=a.x;a.x=t.x;t.x=x;t.stun=.7;effect('portal',a.x,FLOOR-60,color);effect('portal',t.x,FLOOR-60,color);}return;}
 if(type==='cinematic'||type==='selfdestruct'||type==='oneshot'){
  if(a.team===1&&state.enemyCinema>0){a.cd[Number(ab[0])-1]=2;return;}
  if(a.team===1)state.enemyCinema=16;
  cinematic(a,name,power,{...options,noMeter:true,oneshot:type==='oneshot',selfdestruct:type==='selfdestruct'});return;
 }
 if(!t)return;
 if(type==='phase'){a.phase=1.8;a.x=clamp(t.x-a.face*68,55,1225);hit(t);effect('phase',a.x,FLOOR-60,color,1,{life:1.2});return;}
 if(type==='melee'||type==='poison_melee'){
  effect('slash',a.x+a.face*75,FLOOR-65-a.z,color,1,{face:a.face,motif:options.motif,slot:a.attackSlot});
  if(Math.abs(t.x-a.x)<155&&Math.abs(t.z-a.z)<120){hit(t,power,{melee:true});if(type==='poison_melee'){t.poison=8;t.poisonSource=a;t.poisonTick=1;}}return;
 }
 if(type==='rush'){a.x=clamp(t.x-a.face*75,60,1220);effect('trail',a.x,FLOOR-60,color,1,{face:a.face,motif:options.motif});hit(t,power,{melee:true});return;}
 if(type==='lift'||type==='stun'){t.stun=type==='stun'?3:1.8;t.vz=500;hit(t);effect('feathers',t.x,FLOOR-70,color,1,{life:1.3});return;}
 if(type==='blast') {effect('blast',a.x,FLOOR-80,color,1,{life:1,motif:options.motif});living(1-a.team).filter(t=>Math.abs(t.x-a.x)<310).forEach(t=>hit(t));return;}
 if(type==='barrage'){for(let n=0;n<24;n++)schedule(n/24,()=>{if(a.hp>0)fire(a,power,options);});return;}
 if(['projectile','poison_projectile','burning'].includes(type)){fire(a,power,{...options,poison:type==='poison_projectile',burn:type==='burning'});return;}
 throw Error('Unhandled move type '+type);
}
function fire(a,power,options={}) {
 const t=targetFor(a);if(t)a.face=t.x>=a.x?1:-1;
 state.projectiles.push({owner:a,x:a.x+a.face*45,y:FLOOR-65-a.z,vx:a.face*((options.motif||a.def.theme[1])==='bullet'?900:620),power,t:0,options,motif:options.motif||a.def.theme[1],color:a.def.theme[0]});
}
function moveVisual(a,name){
 const n=name.toLowerCase();
 const rules=[[/hat/,'hat'],[/knife|knives/,'knife'],[/cherry/,'cherry'],[/acid|syrup/,'acid'],[/blood/,'blood'],[/pipis/,'pipis'],[/book|lecture/,'book'],[/lead bullet/,'bullet'],[/beam|omega/,'beam'],[/spear/,'spear'],[/dart/,'dart'],[/dora|oraora|muda|white slow|jab|punch|smash|strike|peck/,'fist'],[/mic|music|rap battle/,'music'],[/wing|owl|eagle/,'feather'],[/fire|fuga|burn/,'fire'],[/receipt|contract/,'receipt'],[/noodle/,'noodles']];
 return rules.find(([re])=>re.test(n))?.[1]||a.def.theme[1];
}
function cinematic(a,name,power,options={}) {
 if(!a)return;state.pending=null;
 state.cinematic={actor:a,name,power,options,t:0,duration:options.ultimate?2.4:1.65,hit:false,target:targetFor(a),motif:moveVisual(a,name)};
 banner(name,state.cinematic.duration);record('cinematic',{key:a.key,name,...options});
}

function modal(title,text,buttons){
 $('qte').style.display='flex';$('qteTitle').textContent=title;$('qteText').textContent=text;$('qteStatus').textContent='';$('qteButtons').replaceChildren();
 buttons.forEach(([label,fn])=>{const b=document.createElement('button');b.className='qbtn';b.textContent=label;b.onclick=()=>{music.start();fn();};$('qteButtons').append(b);});
}
function closeModal(){$('qte').style.display='none';state.qte=null;}
function startTrial(){
 state.trial={tries:0,strikes:0,sword:null,guess:null,results:[]};state.qte={type:'courtroom'};trialRound();record('trialStart');
}
function trialRound(){
 const t=state.trial;t.guess=random()<.5?'Silence':'Deny';
 modal('Saul’s courtroom',`Round ${t.tries+1} of 5 · ${t.strikes}/3 strikes. Saul has secretly chosen Silence or Deny. If he guesses your answer, you gain a strike.`,
 [['Silence',()=>trialChoice('Silence')],['Confess',()=>trialChoice('Confess')],['Deny',()=>trialChoice('Deny')]]);
 $('qteStatus').textContent='3 strikes: a lethal Executioner Sword. Confess: a stronger sword, but you gain 50% extra maximum HP. Survive 5 rounds: normal combat.';
 trialBar();
}
function trialBar(){const t=state.trial,bar=document.createElement('div');bar.className='strike-bar';bar.setAttribute('aria-label',t.strikes+' of 3 strikes');for(let i=0;i<3;i++){const cell=document.createElement('span');cell.className=i<t.strikes?'filled':'';cell.textContent=i<t.strikes?'STRIKE':'—';bar.append(cell);}$('qteText').append(bar);}
function trialChoice(choice){
 const t=state.trial;if(!t||state.qte?.type!=='courtroom')return;
 t.tries++;const correct=choice===t.guess;if(correct)t.strikes++;
 t.results.push({choice,guess:t.guess,correct});
 let result=choice==='Confess'?'You confessed. Saul receives a stronger sword. Your maximum HP increases by 50%.':`Saul guessed ${t.guess}. ${correct?'Correct — one strike.':'Wrong — no strike.'}`;
 let done=false;
 if(choice==='Confess'){
  t.sword='confession';const p=player();const bonus=p.maxHp*.5;p.maxHp+=bonus;p.hp=Math.min(p.maxHp,p.hp+bonus);done=true;
 } else if(t.strikes>=3){t.sword='lethal';result+=' Three strikes. His sword can defeat you in one hit. Dodge the visible windup!';done=true;}
 else if(t.tries>=5){t.sword='none';result+=' Five rounds survived. Saul fights without the Executioner Sword.';done=true;}
 record('trialChoice',{choice,guess:t.guess,strikes:t.strikes,sword:t.sword});
 modal(done?'Verdict':'The court responds',result,[['Continue',()=>{if(done){closeModal();state.aiLock=2;banner('Trial complete — '+(t.sword==='none'?'no sword':t.sword==='lethal'?'LETHAL SWORD':'empowered sword'),3);}else trialRound();}]]);
 trialBar();
}
function startQte(type){
 state.pending=null;if(type==='courtroom'){startTrial();return;}
 const labels={barf:['BARF SYMPTOMS','Click all five BARTs before the domain closes.'],lecture:['Stay awake!','Answer Professor Dave: which claim is supported by evidence?'],chimera:['CHIMERA BLUE LINE GARDEN','Stabilize Myles’s domain: press the highlighted symbol.'],clash:['THREE-WAY DOMAIN CLASH','Break the domain from outside: follow the highlighted symbols.'],jak:['JAK DOES SNACKS','Keep the rhythm: press the highlighted note.']};
 const [title,text]=labels[type]||['Domain clash','Follow the highlighted symbols.'];
 state.qte={type,left:type==='barf'?14:18,progress:0,need:type==='barf'?5:type==='lecture'?1:5,sequence:Array.from({length:5},()=>Math.floor(random()*4))};
 if(type==='barf'){
  modal(title,text,Array.from({length:5},(_,i)=>['BART '+(i+1),()=>qteInput(i)]));
  Array.from($('qteButtons').children).forEach((b,i)=>{const im=document.createElement('img');im.src=spritePath('barf_domain');im.alt='BART '+(i+1);im.width=62;im.height=72;im.style.objectFit='contain';b.prepend(im);});
 } else if(type==='lecture')modal(title,text,[['A claim tested with evidence',()=>qteInput(0)],['A guess with no evidence',()=>qteInput(1)],['Whatever is loudest',()=>qteInput(2)]]);
 else {modal(title,text,['◆','●','▲','★'].map((s,i)=>[s,()=>qteInput(i)]));highlightQte();}
 record('qteStart',{type});
}
function highlightQte(){const q=state.qte;if(!q)return;Array.from($('qteButtons').children).forEach((b,i)=>b.classList.toggle('good',i===q.sequence[q.progress]));}
function qteInput(index){
 const q=state.qte;if(!q||q.type==='courtroom')return;
 let good;
 if(q.type==='barf'){const btn=$('qteButtons').children[index];if(!btn||btn.disabled)return;btn.disabled=true;btn.classList.add('good');good=true;}
 else if(q.type==='lecture')good=index===0;
 else good=index===q.sequence[q.progress];
 if(good)q.progress++;else q.left=Math.max(0,q.left-2);
 if(q.progress>=q.need){endQte(true);return;}if(!['barf','lecture'].includes(q.type))highlightQte();
}
function endQte(success){
 const q=state.qte;record('qteEnd',{type:q.type,success});closeModal();state.aiLock=2;
 if(success){living(0).forEach(a=>a.shield+=70);banner('Domain broken!',2);}
 else {living(0).forEach(a=>damage(null,a,a.maxHp*.18,{noMeter:true,force:true}));banner('Domain hit! Keep fighting.',2);}
}

function generateMaze(){
 const cols=31,rows=19,grid=Array.from({length:rows},()=>Array(cols).fill(1)),stack=[[1,1]];grid[1][1]=0;
 while(stack.length){
  const [x,y]=stack.at(-1), options=[[2,0],[-2,0],[0,2],[0,-2]].filter(([dx,dy])=>x+dx>0&&x+dx<cols-1&&y+dy>0&&y+dy<rows-1&&grid[y+dy][x+dx]);
  if(!options.length){stack.pop();continue;}const [dx,dy]=options[Math.floor(random()*options.length)];grid[y+dy/2][x+dx/2]=0;grid[y+dy][x+dx]=0;stack.push([x+dx,y+dy]);
 }
 const distance=new Map([['1,1',0]]),queue=[[1,1]];
 for(let n=0;n<queue.length;n++){const [x,y]=queue[n];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,k=xx+','+yy;if(grid[yy]?.[xx]===0&&!distance.has(k)){distance.set(k,distance.get(x+','+y)+1);queue.push([xx,yy]);}}}
 const far=queue.slice().sort((a,b)=>distance.get(b.join(','))-distance.get(a.join(',')));
 const exit=far[0],ends=far.filter(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>grid[y+dy]?.[x+dx]===0).length===1&&!(x===exit[0]&&y===exit[1])&&(x!==1||y!==1));
 const fragments=[ends[0],ends[Math.floor(ends.length/3)],ends[Math.floor(ends.length*2/3)]].map((p,i)=>({x:p[0],y:p[1],found:false,id:i}));
 state.maze={cols,rows,grid,x:1,y:1,exit,fragments,seen:new Set(),steps:0,clock:0};revealMaze();
 record('mazeGenerated',{cells:queue.length,exitDistance:distance.get(exit.join(',')),fragments:fragments.length});
}
function revealMaze(){const m=state.maze;for(let y=m.y-3;y<=m.y+3;y++)for(let x=m.x-3;x<=m.x+3;x++)if(x>=0&&x<m.cols&&y>=0&&y<m.rows)m.seen.add(x+','+y);}
function mazeMove(dx,dy){
 const m=state.maze;if(!m||state.dialogue||state.paused)return;
 if(m.grid[m.y+dy]?.[m.x+dx]!==0)return;m.x+=dx;m.y+=dy;m.steps++;revealMaze();
 const f=m.fragments.find(f=>!f.found&&f.x===m.x&&f.y===m.y);if(f){f.found=true;banner('Portal fragment '+m.fragments.filter(f=>f.found).length+'/3',1.5);}
 if(m.x===m.exit[0]&&m.y===m.exit[1]){if(m.fragments.every(f=>f.found)){record('mazeWon',{steps:m.steps});finishBattle();}else banner('The exit needs all three portal fragments.',2);}
}

function tickActor(a,dt){
 for(const prop of ['ultLock','protect','invisible','phase','stun','buff','hit','attack'])a[prop]=Math.max(0,a[prop]-dt);
 a.cd=a.cd.map(t=>Math.max(0,t-dt));
 if(a.hp<=0){a.deadTime+=dt;return;}
 if(a.temporary){a.summon-=dt;if(a.summon<=0){a.hp=0;record('summonExpired',{key:a.key});return;}}
 if(a.poison>0){a.poison=Math.max(0,a.poison-dt);a.poisonTick-=dt;if(a.poisonTick<=0){damage(a.poisonSource,a,7,{noMeter:true,dot:true});a.poisonTick+=1;}}
 if(a.burn>0){a.burn=Math.max(0,a.burn-dt);damage(null,a,12*dt,{noMeter:true,dot:true});}
 if(a.z>0||a.vz>0){a.z+=a.vz*dt;a.vz-=1450*dt;if(a.z<0){a.z=0;a.vz=0;}}
}
function updateAI(a,dt,index){
 if(a.hp<=0||a.banished||a.stun>0)return;
 const t=targetFor(a);if(!t)return;
 const dx=t.x-a.x;a.face=dx>=0?1:-1;a.move=0;
 const spacing=a.team===0?190+(index%3)*90:105+(index%3)*70;
 if(Math.abs(dx)>spacing){a.x=clamp(a.x+Math.sign(dx)*Math.min(a.def.speed??200,195)*.65*dt,60,1220);a.move=1;}
 if(a.telegraph){
  a.telegraph.left-=dt;if(a.telegraph.left<=0){const slot=a.telegraph.slot;a.telegraph=null;useAbility(a,slot,{noMeter:a.temporary});a.ai=1.2+random()*.7;}return;
 }
 a.ai-=dt;if(a.ai>0||state.aiLock>0)return;
 const abs=Math.abs(dx),moves=abilities(a);
 let candidates=moves.map((m,i)=>({m,i})).filter(({m,i})=>a.cd[i]<=0&&!['toggle','rombie_toggle','banish','swap','oneshot','selfdestruct'].includes(m[2]));
 if(a.team===0)candidates=candidates.filter(({m})=>!['cinematic','summon','buff','invisible'].includes(m[2]));
 candidates=candidates.filter(({m})=> !['melee','poison_melee'].includes(m[2]) || abs<145);
 if(a.team===1&&state.enemyCinema>0)candidates=candidates.filter(({m})=>m[2]!=='cinematic');
 if(a.key==='saul'&&state.trial?.sword&&state.trial.sword!=='none'&&abs<160&&a.cd[0]<=0)candidates=[{m:moves[0],i:0}];
 if(!candidates.length){a.ai=.5;return;}
 const {m,i}=candidates[Math.floor(random()*candidates.length)];
 if(a.team===1){
  if(state.enemies.some(e=>e!==a&&e.telegraph)){a.ai=.4;return;}
  a.telegraph={slot:i,left:m[2]==='cinematic'||a.key==='saul'?1.15:.65,total:m[2]==='cinematic'||a.key==='saul'?1.15:.65,name:m[1]};
 }else {useAbility(a,i,{noMeter:a.temporary});a.ai=a.temporary ? .55 : 1.3+random();}
}
function update(dt){
 state.visualTime+=dt;
 if(state.paused||document.hidden)return;
 state.bannerTime=Math.max(0,state.bannerTime-dt);
 if(state.event){
  const e=state.event;e.elapsed+=dt;if(e.elapsed>=e.duration){state.event=null;e.commit();e.done();}return;
 }
 if(state.dialogue)return;
 if(state.qte){if(state.qte.type!=='courtroom'){state.qte.left-=dt;$('qteStatus').textContent=`${state.qte.progress}/${state.qte.need} · ${Math.ceil(Math.max(0,state.qte.left))}s`;if(state.qte.left<=0)endQte(false);}return;}
 if(state.cinematic){
  const c=state.cinematic;c.t+=dt;
  if(!c.hit&&c.t>=c.duration*.65){c.hit=true;const foes=living(1-c.actor.team);const targets=c.options.oneshot?(c.target?[c.target]:[]):foes;
   if(!c.options.scripted)targets.forEach(t=>damage(c.actor,t,c.power,{noMeter:true,oneshot:c.options.oneshot,force:c.options.oneshot}));
   if(c.options.selfdestruct){c.actor.hp=Math.max(1,c.actor.hp-c.actor.maxHp*.45);c.actor.phase=2;}
   effect('blast',c.target?.x||W/2,FLOOR-60,c.actor.def.theme[0],2,{life:1.3});
  }
  if(c.t>=c.duration){state.cinematic=null;state.aiLock=1;}return;
 }
 if(state.mode==='maze'){
  const m=state.maze;m.clock-=dt;if(m.clock<=0){let dx=keys.has('left')?-1:keys.has('right')?1:0,dy=keys.has('up')?-1:keys.has('down')?1:0;if(dx||dy){mazeMove(dx,dx?0:dy);m.clock=keys.has('sprint') ? .075 : .13;}}return;
 }
 if(!['battle','scene'].includes(state.mode))return;
 state.time+=dt;state.enemyCinema=Math.max(0,state.enemyCinema-dt);state.aiLock=Math.max(0,state.aiLock-dt);
 state.effects.forEach(e=>e.t+=dt);state.effects=state.effects.filter(e=>e.t<e.life);
 const p=player();
 for(const a of [...state.party,...state.enemies,...state.extras])tickActor(a,dt);
 if(p&&p.hp>0&&p.stun<=0&&!p.banished){
  const dir=(keys.has('right')?1:0)-(keys.has('left')?1:0);p.move=dir;
  if(dir){p.face=dir;p.x=clamp(p.x+dir*(p.def.speed||255)*(keys.has('sprint')?1.65:1)*(p.buff>0?1.55:1)*dt,55,1225);}
 }
 if(state.mode==='scene'){
  state.party.forEach((a,i)=>{if(a!==p&&p){const dest=p.x-85*(i+1)*p.face;a.move=Math.abs(dest-a.x)>20?1:0;a.x+=clamp(dest-a.x,-110*dt,110*dt);a.face=p.face;}});return;
 }
 if(state.pending){state.pending.left-=dt;if(state.pending.left<=0){flushPending();state.fuseArmed=false;}}
 if(state.cinematic)return;
 const due=[];state.tasks.forEach(t=>{t.left-=dt;if(t.left<=0)due.push(t);});state.tasks=state.tasks.filter(t=>t.left>0);due.forEach(t=>t.fn());
 for(const projectile of state.projectiles){
  projectile.x+=projectile.vx*dt;projectile.t+=dt;
  const t=living(1-projectile.owner.team).find(t=>Math.abs(t.x-projectile.x)<44&&Math.abs(FLOOR-65-t.z-projectile.y)<80);
  if(t){damage(projectile.owner,t,projectile.power,projectile.options);if(projectile.options.poison){t.poison=8;t.poisonTick=1;t.poisonSource=projectile.owner;}if(projectile.options.burn)t.burn=5;projectile.t=9;effect('spark',projectile.x,projectile.y,projectile.color);}
 }
 state.projectiles=state.projectiles.filter(p=>p.t<3&&p.x>-100&&p.x<W+100);
 state.party.forEach((a,i)=>{if(a!==player())updateAI(a,dt,i);});state.enemies.forEach((a,i)=>updateAI(a,dt,i));
 if(state.cinematic)return;
 checkStoryTriggers();if(state.dialogue||state.qte||state.event||state.cinematic)return;
 fillEnemies();
 if(!player()){defeat();return;}
 if(state.waveReady&&!state.enemies.some(a=>a.hp>0)&&!state.reserve.length){state.party=state.party.filter(a=>!a.temporary);living(0).forEach(a=>a.hp=Math.min(a.maxHp,a.hp+a.maxHp*.12));beginWave(state.wave+1);}
 if(BATTLES[state.index]?.hazard==='serum'){
  state.hazard-=dt;if(state.hazard<=0){state.hazard=20;const x=player()?.x||640;effect('hazard',x,FLOOR,'#9bdb64',1,{life:2});schedule(1.6,()=>living(0).filter(a=>Math.abs(a.x-x)<80&&a.z<35).forEach(a=>damage(null,a,35,{noMeter:true})));}
 }
}

// Original synthesized score: a different musical phrase follows each story arc.
const music={context:null,gain:null,clock:0,beat:0,next:0,
 start(){
  if(!this.context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;this.context=new Audio();this.gain=this.context.createGain();this.gain.connect(this.context.destination);}
  this.context.resume().catch(()=>{});this.update();
 },
 tone(freq,time,length,volume,type='triangle'){
  const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.001,time);g.gain.exponentialRampToValueAtTime(volume,time+.025);g.gain.exponentialRampToValueAtTime(.001,time+length);o.connect(g);g.connect(this.gain);o.start(time);o.stop(time+length+.02);
 },
 update(){
  if(!this.context)return;const c=this.context,enabled=!state.paused&&!document.hidden;
  this.gain.gain.setTargetAtTime(enabled?Number(save.music):0,c.currentTime,.08);if(!enabled||!save.music)return;
  if(this.next<c.currentTime-.5)this.next=c.currentTime;
  const notes=[0,3,7,10,7,5,3,7,0,3,12,10,7,5,3,2],base=state.mode==='scene'?146.83:110*Math.pow(2,(state.index%4)*2/12);
  while(this.next<c.currentTime+.13){const n=notes[this.beat%notes.length];this.tone(base*2*Math.pow(2,n/12),this.next,.25,.11);if(this.beat%4===0)this.tone(base/2,this.next,.5,.14,'sine');if(this.beat%2===0)this.tone(52,this.next,.12,.2,'sine');this.beat++;this.next+=state.mode==='scene'?.29:.23;}
 }
};

function fittedImage(im,x,y,w,h,anchor='center'){
 if(!im?.complete||!im.naturalWidth)return false;const s=Math.min(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*s,ih=im.naturalHeight*s;
 ctx.drawImage(im,x-iw/2,anchor==='bottom'?y-ih:y-ih/2,iw,ih);return true;
}
function text(value,x,y,size=20,color='#fff',align='center'){
 ctx.font=`800 ${size}px Arial`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#080d19';ctx.strokeText(String(value),x,y);ctx.fillStyle=color;ctx.fillText(String(value),x,y);
}
function circle(x,y,r,color,fill=true){ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,Math.PI*2);if(fill){ctx.fillStyle=color;ctx.fill();}else{ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();}}
function background(){
 const im=images[ASSETS.bgs[state.room]];
 ctx.fillStyle='#182238';ctx.fillRect(0,0,W,H);
 if(im?.complete&&im.naturalWidth){const s=Math.max(W/im.naturalWidth,H/im.naturalHeight);ctx.drawImage(im,(W-im.naturalWidth*s)/2,(H-im.naturalHeight*s)/2,im.naturalWidth*s,im.naturalHeight*s);}
 const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#0004');shade.addColorStop(.55,'#0000');shade.addColorStop(1,'#06101ce8');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#07101a60';ctx.fillRect(0,FLOOR+2,W,H-FLOOR);
 ctx.strokeStyle='#dfeaff45';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,FLOOR+2);ctx.lineTo(W,FLOOR+2);ctx.stroke();
}
function motif(name,x,y,size,color,angle=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,size/8);
 switch(name){
 case 'hat':ctx.fillStyle='#334e74';ctx.fillRect(-size*.65,-size*.3,size*1.3,size*.5);ctx.fillRect(-size,-size*.05,size*2,size*.2);ctx.fillStyle='#edcf55';ctx.fillRect(-size*.6,-size*.12,size*1.2,size*.12);break;
 case 'beam':ctx.fillStyle=color;ctx.fillRect(-size*1.6,-size*.18,size*3.2,size*.36);ctx.fillStyle='#fff';ctx.fillRect(-size*1.5,-size*.06,size*3,size*.12);break;
 case 'cherry':circle(-size*.25,0,size*.38,'#e83768');circle(size*.3,size*.1,size*.4,'#ed315c');ctx.strokeStyle='#9ddc5d';ctx.beginPath();ctx.moveTo(-size*.25,-size*.25);ctx.quadraticCurveTo(0,-size,size*.2,-size*.8);ctx.lineTo(size*.3,-size*.2);ctx.stroke();break;
 case 'knife':case 'blade':case 'spear':case 'pencil':case 'dart':ctx.fillStyle=name==='pencil'?'#f9d046':'#e2f6ff';ctx.beginPath();ctx.moveTo(size,0);ctx.lineTo(-size*.3,-size*.17);ctx.lineTo(-size*.3,size*.17);ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.fillRect(-size*.8,-size*.16,size*.5,size*.32);break;
 case 'bullet':ctx.fillRect(-size*.5,-size*.16,size*.8,size*.32);circle(size*.3,0,size*.16,color);break;
 case 'rocket':case 'bomb':case 'vial':circle(0,0,size*.5,color);ctx.fillStyle='#d9f5ee';ctx.fillRect(-size*.25,-size*.7,size*.5,size*.5);ctx.fillStyle='#ff7653';ctx.beginPath();ctx.moveTo(-size*.4,size*.3);ctx.lineTo(0,size*1.1);ctx.lineTo(size*.4,size*.3);ctx.fill();break;
 case 'acid':case 'blood':case 'water':case 'pipis':ctx.beginPath();ctx.moveTo(0,-size*.9);ctx.bezierCurveTo(-size,size*.4,-size*.4,size,size*.4,size*.5);ctx.bezierCurveTo(size,size*.1,size*.4,-size*.3,0,-size*.9);ctx.fill();circle(-size*.15,-size*.05,size*.12,'#ffffffaa');break;
 case 'music':ctx.font=`bold ${size*1.5}px Arial`;ctx.textAlign='center';ctx.fillText('♫',0,size*.4);break;
 case 'heart':ctx.beginPath();ctx.moveTo(0,size*.7);ctx.bezierCurveTo(-size*1.2,-size*.2,-size*.2,-size,0,-size*.4);ctx.bezierCurveTo(size*.7,-size,size*1.1,0,0,size*.7);ctx.fill();break;
 case 'feather':case 'leaf':ctx.beginPath();ctx.ellipse(0,0,size*.8,size*.25,-.4,0,7);ctx.fill();ctx.strokeStyle='#faffde';ctx.beginPath();ctx.moveTo(-size*.8,size*.35);ctx.lineTo(size*.8,-size*.35);ctx.stroke();break;
 case 'cupcake':ctx.fillStyle='#e9b470';ctx.fillRect(-size*.5,0,size,size*.5);circle(-size*.25,-size*.1,size*.35,color);circle(size*.3,-size*.1,size*.35,color);circle(0,-size*.4,size*.4,color);break;
 case 'fist':case 'bite':case 'claw':ctx.fillRect(-size*.5,-size*.3,size,size*.6);for(let n=0;n<4;n++)circle(-size*.4+n*size*.25,-size*.4,size*.18,color);break;
 case 'web':case 'ice':case 'sky':for(let n=0;n<6;n++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(size,0);ctx.moveTo(size*.45,0);ctx.lineTo(size*.65,size*.3);ctx.stroke();}break;
 case 'book':case 'receipt':ctx.fillStyle='#f6efd5';ctx.fillRect(-size*.55,-size*.7,size*1.1,size*1.4);ctx.strokeStyle=color;for(let n=-2;n<3;n++){ctx.beginPath();ctx.moveTo(-size*.35,n*size*.2);ctx.lineTo(size*.35,n*size*.2);ctx.stroke();}break;
 case 'gavel':ctx.fillRect(-size*.12,0,size*.24,size*.8);ctx.fillRect(-size*.55,-size*.3,size*1.1,size*.4);break;
 case 'bart':fittedImage(pic('barf_domain'),0,0,size*1.8,size*1.8);break;
 case 'fire':ctx.fillStyle='#ff8c32';ctx.beginPath();ctx.moveTo(0,-size);ctx.quadraticCurveTo(size,size*.7,0,size*.7);ctx.quadraticCurveTo(-size,size*.7,0,-size);ctx.fill();circle(0,size*.2,size*.25,'#ffe76e');break;
 case 'bone':ctx.fillRect(-size*.6,-size*.1,size*1.2,size*.2);[-1,1].forEach(i=>{circle(i*size*.6,-size*.15,size*.22,color);circle(i*size*.6,size*.15,size*.22,color);});break;
 case 'noodles':for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-size,-size*.3+i*size*.3);ctx.bezierCurveTo(-size*.4,size*.5,size*.3,-size*.6,size,i*size*.3);ctx.stroke();}break;
 default:circle(0,0,size*.6,color);circle(0,0,size*.3,'#fff');break;
 }
 ctx.restore();
}
function drawActor(a){
 if(a.banished)return;if(a.hp<=0&&a.deadTime>1.5)return;
 const control=a===player(),event=state.event?.actor===a?state.event:null;
 let height=132*a.scale,width=155*a.scale,bob=a.move?(save.wiggle!==false?Math.sin(state.visualTime*13+a.id)*4:0):Math.sin(state.visualTime*2+a.id)*1.5;
 if(a.key.includes('mech')){height*=1.3;width*=1.5;}if(a.key==='rombie_carrier'){height*=1.2;width*=1.4;}
 let x=a.x,y=FLOOR-a.z+bob,rotation=a.attack>0?Math.sin(a.attack*12)*.09*a.face:0,alpha=a.invisible>0?.23:1;
 if(a.phase>0)alpha=.5;
 if(a.hp<=0){alpha=Math.max(0,1-a.deadTime/1.5);rotation=a.deadTime*1.6;}
 if(event){const u=event.elapsed/event.duration;switch(event.action.type){
 case 'death':case 'domain_kill':case 'belly_slap':rotation=u*Math.PI*.48;alpha=1-u*.8;y+=u*24;break;
 case 'kidnap':x+=u*u*850;break;
 case 'turn_rombie':y-=Math.sin(u*Math.PI/2)*260;rotation=u*7;alpha=1-u*.5;break;
 case 'summon_enemy':height*=.3+.7*u;width*=.3+.7*u;break;
 case 'evolve':height*=1+Math.sin(u*Math.PI)*.25;width*=1+Math.sin(u*Math.PI)*.25;break;
 }}
 ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#03061077';ctx.beginPath();ctx.ellipse(x,FLOOR+6,width*.28,9,0,0,7);ctx.fill();
 if(control&&a.hp>0){ctx.strokeStyle='#9bff87';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,FLOOR+6,width*.32,12,0,0,7);ctx.stroke();}
 if(a.buff>0||a.protect>0||event?.action.type==='evolve'){const hue=event?'#ffffff':a.buff>0?'#71ffcc':a.def.theme[0];ctx.strokeStyle=hue;ctx.lineWidth=3;for(let n=0;n<8;n++){const ang=state.visualTime*2+n*Math.PI/4;ctx.beginPath();ctx.moveTo(x+Math.cos(ang)*70,y-60+Math.sin(ang)*100);ctx.lineTo(x+Math.cos(ang)*85,y-60+Math.sin(ang)*125);ctx.stroke();}}
 if(a.stand){ctx.globalAlpha=alpha*.72;fittedImage(pic(a.def.standSprite),x-a.face*65,y-12,130,165,'bottom');ctx.globalAlpha=alpha;}
 ctx.translate(x,y-height*.45);ctx.rotate(rotation);ctx.scale(a.face===-1?-1:1,1);
 if(!fittedImage(pic(a.sprite),0,height*.45,width,height,'bottom')){ctx.fillStyle=a.def.theme[0];ctx.fillRect(-25,-height*.4,50,height*.8);}
 ctx.restore();
 if(a.hp>0){
  const barY=FLOOR-height-28-a.z;ctx.fillStyle='#050811b0';ctx.fillRect(x-43,barY,86,6);ctx.fillStyle=a.team===0?'#89de93':'#ef747b';ctx.fillRect(x-43,barY,86*a.hp/a.maxHp,6);
  text(a.def.name,x,barY-12,12,a.team===0?'#e7ffee':'#fff0dc');
  if(a.telegraph){text('! '+a.telegraph.name,x,barY-38,15,'#ffd55c');circle(x,FLOOR-55,65*(1-a.telegraph.left/a.telegraph.total),'#ff5f6380',false);}
  if(a.shield>0){ctx.strokeStyle='#9fe1ff88';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,FLOOR-65-a.z,width*.55,height*.55,0,0,7);ctx.stroke();}
  if(a.poison>0)motif('acid',x+50,barY-10,10,'#94e244');
  if(a.temporary)text(a.summon.toFixed(1)+'s',x,barY-32,13,'#b3efff');
  if(a.key==='saul'&&state.trial?.sword&&state.trial.sword!=='none')fittedImage(pic('executioner_sword'),x+a.face*66,FLOOR-65,60,125);
 }
}
function drawEffect(e){
 const u=e.t/e.life;ctx.save();ctx.globalAlpha=1-u;
 if(e.kind==='number')text(e.text,e.x,e.y-u*50,19,e.color);
 else if(['slash','trail','spark'].includes(e.kind)){
  const dir=e.face||1;for(let n=0;n<3;n++){ctx.strokeStyle=e.color;ctx.lineWidth=6-n;ctx.beginPath();ctx.moveTo(e.x-dir*(30+n*15),e.y-35+n*20);ctx.lineTo(e.x+dir*(50+u*60),e.y+n*20);ctx.stroke();}
  motif(e.motif||'fist',e.x+dir*u*70,e.y,25,e.color,u);
 }else if(e.kind==='hazard'){
  ctx.globalAlpha=.55;circle(e.x,FLOOR,85,'#df6262',false);text('SERUM — MOVE!',e.x,FLOOR-20,17,'#fbe479');fittedImage(pic('giant_test_tube_ref'),e.x,-80+u*600,95,160);
 }else if(e.kind==='gamble'){
  for(let n=0;n<3;n++){ctx.fillStyle='#102b39';ctx.fillRect(e.x-92+n*65,e.y-75,55,70);text(u>.5?'7':Math.floor(state.visualTime*17+n)%10,e.x-64+n*65,e.y-42,48,'#a0ffb6');}
 }else if(e.kind==='portal'||e.kind==='phase'){
  for(let n=0;n<4;n++){ctx.strokeStyle=e.color;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(e.x,e.y,(20+u*55)*(1-n*.13),90+u*30,n*.22,0,7);ctx.stroke();}
 }else if(e.kind==='music'||e.kind==='feathers'){
  for(let n=0;n<6;n++)motif(e.kind==='music'?'music':'feather',e.x+Math.cos(n)*u*100,e.y-u*130+Math.sin(n)*30,20,e.color,n);
 }else {for(let n=0;n<3;n++)circle(e.x,e.y,(25+u*120+n*18)*e.power,e.color,false);if(e.motif)motif(e.motif,e.x,e.y,35+u*30,e.color);}
 ctx.restore();
}
function drawCinematic(){
 const c=state.cinematic;if(!c)return;const u=c.t/c.duration,a=c.actor,color=a.def.theme[0],hitX=c.target?.x||850;
 ctx.fillStyle='#06101a88';ctx.fillRect(0,0,W,H);ctx.fillStyle='#070c14';ctx.fillRect(0,0,W,78);ctx.fillRect(0,H-92,W,92);
 text(c.options.fusion?'FUSION ATTACK':c.options.ultimate?'ULTIMATE':a.def.name.toUpperCase(),W/2,35,18,color);
 text(c.name,W/2,H-47,Math.min(34,950/c.name.length*1.7),'#fff');
 const radius=45+Math.max(0,u-.6)*650;
 if(c.name.includes('Cherry')){
  const cy=-100+Math.min(1,u/.65)*520;motif('cherry',hitX,cy,135*(.65+u),color);
  if(u>.65){circle(hitX,430,radius,'#ff376ba0');for(let n=0;n<12;n++){const ang=n*Math.PI/6;motif('cherry',hitX+Math.cos(ang)*radius,430+Math.sin(ang)*radius*.5,25,color,n);}}
 }else if(a.key==='nande'||c.name.includes('JAK')){
  fittedImage(pic('jak_does_snacks'),W/2,320,370*(.8+u*.3),320);
  for(let n=0;n<10;n++)motif('music',W/2+Math.cos(n+u*4)*400,340+Math.sin(n+u*4)*150,35,color,n*.1);
 }else if(a.key==='leonard'){
  for(let n=0;n<5;n++)circle(W/2,340,55+u*140+n*20,'#adf3dd',false);
  fittedImage(pic('ironman_polyester'),W/2,340,260*(.5+u*.6),360*(.5+u*.6));
  text('POLYESTER SUMMON · 8 SECONDS',W/2,550,24,'#a8ffcf');
 }else if(a.key==='max'){
  ctx.save();ctx.translate(W/2,400);ctx.rotate(Math.sin(u*27)*.24);fittedImage(pic(a.sprite),0,0,210,260);ctx.restore();
  for(let n=0;n<6;n++){ctx.strokeStyle=n%2?'#f1cb60':'#67dadb';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(n*240,90);ctx.lineTo(640+Math.sin(u*14+n)*350,600);ctx.stroke();}
 }else if(a.key==='mighty_eagle'||a.key==='raleigh'||a.key==='rombie_raleigh'){
  const im=pic(a.key==='mighty_eagle'?a.sprite:'white_owl');fittedImage(im,hitX,120+u*330,330,330);
  for(let n=0;n<14;n++)motif('feather',hitX+Math.cos(n+u)*220,120+u*440+Math.sin(n)*100,40,color,n);
  if(u>.65)circle(hitX,FLOOR,radius,'#ffdf8888',false);
 }else if(a.key==='giant_test_tube'||/SERUM|TEST TUBE/.test(c.name)){
  fittedImage(pic('giant_test_tube_ref'),hitX,-180+u*920,190,360);if(u>.65)for(let n=0;n<9;n++)motif('acid',hitX+Math.cos(n)*radius,FLOOR-60+Math.sin(n)*radius*.3,28,'#9bd663',n);
 }else if(a.key==='aqua_mech'){
  fittedImage(pic('aqua_mech'),W/2,350,350,360);if(u>.5){circle(W/2,350,radius*1.2,'#78deff99');circle(W/2,350,radius*.8,'#e8ffffaa');}
  for(let n=0;n<8;n++)motif('knife',W/2+Math.cos(n)*u*420,350+Math.sin(n)*u*190,42,color,n);
 }else if(a.key==='oliver_hvnly'||a.key==='super_monkey_fan'){
  const art=c.name.includes('FIRE')?'fire_bird':u<.25?'two_dollar_bill':u<.5?'taco_sauce':'waa_waa';fittedImage(pic(art),hitX,330,230,250);
  for(let n=0;n<24;n++)motif('dart',(n*87+u*1700)%W,180+(n%7)*47,24,color);
  fittedImage(pic(a.sprite),245,420,200,280);
 }else if(a.key==='myles'||c.name.includes('CHIMERA')){
  ctx.strokeStyle='#50caff';ctx.lineWidth=9;for(let n=0;n<6;n++){ctx.beginPath();ctx.moveTo(0,260+n*40);ctx.lineTo(W,260+n*40+Math.sin(u*10+n)*50);ctx.stroke();}
  for(let n=0;n<7;n++)motif('cupcake',160+n*160,460-Math.sin(u*5+n)*140,45,color);
  fittedImage(pic('myles'),W/2,360,230,290);
 }else if(a.key==='saul'){
  if(state.trial?.sword&&state.trial.sword!=='none')fittedImage(pic('executioner_sword'),W/2,340,180,400);
  else motif('gavel',W/2,320,160,color,Math.sin(u*5)*.4);
  for(let n=0;n<5;n++)motif('receipt',180+n*220,260+Math.sin(u*10+n)*140,55,'#ffe372',n);
 }else {
  fittedImage(pic(a.sprite),260,360,230,280);
  const count=c.options.fusion?16:10;
  for(let n=0;n<count;n++){
   const x=400+((n*94+u*800)%780),y=200+(n%5)*67+Math.sin(u*8+n)*18;
   motif(c.motif,x,y,27+(n%3)*8,color,c.motif==='knife'?0:u*Math.PI);
  }
  if(u>.6){circle(hitX,400,radius,color+'88',false);circle(hitX,400,radius*.7,'#ffffff99',false);}
 }
 if(c.options.fusion){ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(100,110);ctx.lineTo(W-100,600);ctx.moveTo(W-100,110);ctx.lineTo(100,600);ctx.stroke();}
}
function drawEvent(){
 const e=state.event;if(!e)return;const u=e.elapsed/e.duration;
 if(e.action.type==='source_slide'){ctx.fillStyle='#05060a';ctx.fillRect(0,0,W,H);fittedImage(images[ASSETS.story[e.action.key]],W/2,H/2,W,H);return;}
 if(['portal','breakout','aura','build_mech','summon_enemy'].includes(e.action.type)){
  const x=e.actor?.x||780,color=e.action.type==='breakout'?'#fd845c':'#a69bff';
  for(let n=0;n<6;n++)circle(x,350,30+u*170+n*20,color+'bb',false);
  if(e.action.type==='build_mech')fittedImage(pic('aqua_mech'),x,400,220*u,300*u);
 }
 if(e.action.type==='domain_kill'){
  ctx.fillStyle='#31166088';ctx.fillRect(0,0,W,H);for(let n=0;n<9;n++){ctx.strokeStyle='#c5a2ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(n*160,110);ctx.lineTo(W-n*80,650);ctx.stroke();}fittedImage(pic('star_platinum'),360,360,270,310);text('DOMAIN EXPANSION',W/2,190,44,'#ddbcff');
 }
 if(e.action.type==='belly_slap'){motif('fist',700-u*260,410,80,'#ffa25f');text('BELLY SLAP!',W/2,230,44,'#f9bc72');}
 if(e.action.type==='kidnap'){fittedImage(pic('super_monkey_fan'),(e.actor?.x||430)+u*u*850+80,490,125,180,'bottom');}
}
function drawMaze(){
 const m=state.maze;if(!m)return;const cell=27,ox=(W-m.cols*cell)/2,oy=125;
 ctx.fillStyle='#111011';ctx.fillRect(0,0,W,H);
 for(let y=0;y<m.rows;y++)for(let x=0;x<m.cols;x++){
  if(!m.seen.has(x+','+y)){ctx.fillStyle='#141820';ctx.fillRect(ox+x*cell,oy+y*cell,cell,cell);continue;}
  ctx.fillStyle=m.grid[y][x]?'#b3a466':'#504a32';ctx.fillRect(ox+x*cell,oy+y*cell,cell-1,cell-1);
  if(Math.abs(x-m.x)>3||Math.abs(y-m.y)>3){ctx.fillStyle='#0007';ctx.fillRect(ox+x*cell,oy+y*cell,cell,cell);}
 }
 for(const f of m.fragments)if(!f.found&&m.seen.has(f.x+','+f.y)){motif('ice',ox+(f.x+.5)*cell,oy+(f.y+.5)*cell,10,'#9afafa',state.visualTime);}
 if(m.seen.has(m.exit.join(','))){ctx.strokeStyle='#ae89ff';ctx.lineWidth=4;ctx.strokeRect(ox+m.exit[0]*cell+3,oy+m.exit[1]*cell+3,cell-6,cell-6);}
 const p=player();fittedImage(pic(p?.sprite),ox+(m.x+.5)*cell,oy+(m.y+.5)*cell,cell*1.1,cell*1.2);
 text('BACKROOMS',W/2,102,24,'#f4e6af');text('WASD / arrows · Find 3 fragments, then the purple exit · Tab changes character',W/2,682,16,'#efe0a7');
}
function render(){
 ctx.clearRect(0,0,W,H);
 if(state.mode==='maze')drawMaze();else{
  background();
  if(state.mode==='scene'&&state.scene){
   const x=sceneTargetX();circle(x,FLOOR+2,38+Math.sin(state.visualTime*4)*4,'#8afcdd',false);
   ctx.fillStyle='#98ffe966';ctx.fillRect(x-2,300,4,270);text('E',x,285,25,'#a7ffe1');text(state.scene.data.steps[state.scene.step]?.label||'',x,250,22,'#fff');
  }
  [...state.party,...state.enemies,...state.extras].sort((a,b)=>a.x-b.x).forEach(drawActor);
  state.projectiles.forEach(p=>motif(p.motif,p.x,p.y,23,p.color,p.vx<0?Math.PI:0));state.effects.forEach(drawEffect);
 }
 drawEvent();drawCinematic();
 if(state.bannerTime>0&&!state.cinematic&&!state.dialogue&&!state.event){ctx.fillStyle='#07101bd9';ctx.fillRect(W/2-440,155,880,45);text(state.banner,W/2,178,20,'#e9f6ff');}
 updateHUD();
}
let hudSignature='';
function updateHUD(){
 const presenting=!!(state.cinematic||state.event);
 $('hud').style.visibility=state.event?.action.type==='source_slide'?'hidden':'visible';
 $('touch').style.visibility=presenting||state.dialogue||state.qte?'hidden':'visible';
 const p=player(),boss=getBoss();
 if(p){$('playerName').textContent=p.def.name;$('playerHpText').textContent=Math.ceil(p.hp)+' / '+Math.ceil(p.maxHp);$('playerHp').style.width=(p.hp/p.maxHp*100)+'%';$('ultimateFill').style.width=p.ult+'%';$('ultimateLabel').textContent='ULTIMATE '+Math.floor(p.ult)+'% · SPACE'+(p.ultLock>0?' · '+Math.ceil(p.ultLock)+'s':'');$('standLabel').textContent=p.buff>0?'JACKPOT '+Math.floor(p.buff/60)+':'+String(Math.ceil(p.buff%60)).padStart(2,'0'):p.invisible>0?'Incognito '+p.invisible.toFixed(1)+'s':p.stand?p.def.standName:p.rombie?'ROMBIE MODE':state.party.filter(a=>a.hp>0&&!a.temporary).length+' teammates alive · TAB to switch';}
 $('bossName').textContent=boss?.def.name|| (state.mode==='scene'?'STORY':state.mode==='maze'?'PORTAL FRAGMENTS':'ENCOUNTER');$('bossHpText').textContent=boss?Math.ceil(boss.hp)+' / '+Math.ceil(boss.maxHp):'';$('bossHp').style.width=boss?100*boss.hp/boss.maxHp+'%':'0%';
 if(state.mode==='scene')$('objective').textContent=state.scene.data.title+' · '+(state.scene.step+1)+'/'+state.scene.data.steps.length;
 else if(state.mode==='maze')$('objective').textContent='Fragments '+state.maze.fragments.filter(f=>f.found).length+'/3 · '+state.maze.steps+' steps';
 else $('objective').textContent=(BATTLES[state.index]?.waves?.[state.wave]?.objective||'')+(state.reserve.length?' · '+state.reserve.length+' reinforcements':'');
 const abs=p?abilities(p):[],signature=abs.map(a=>a[1]).join('|');
 if(signature!==hudSignature){hudSignature=signature;$('abilityBar').replaceChildren();abs.forEach((a,i)=>{const el=document.createElement('div');el.className='abil';el.innerHTML='<b><span class="key">'+(i+1)+'</span><span></span></b><small></small>';el.querySelector('b>span:last-child').textContent=a[1];$('abilityBar').append(el);});}
 Array.from($('abilityBar').children).forEach((el,i)=>{const cd=p?.cd[i]||0;el.classList.toggle('cool',cd>0);el.querySelector('small').textContent=cd>0?cd.toFixed(1)+'s':state.pending?.slot===i?'FUSE…':'Ready';});
 $('abilityBar').style.display=state.mode==='battle'&&!state.cinematic&&!state.event?'flex':'none';
 $('objective').style.visibility=state.cinematic||state.event?'hidden':'visible';
 $('settingsBtn').style.visibility=state.cinematic||state.event?'hidden':'visible';
}

function pause(force){
 if(!['battle','scene','maze'].includes(state.mode))return;state.paused=force===undefined?!state.paused:force;keys.clear();$('pause').style.display=state.paused?'flex':'none';music.update();
}
function jump(){const p=player();if(p&&!state.dialogue&&!state.event&&!state.cinematic&&!state.qte&&!state.paused&&p.z===0)p.vz=p.def.jump||680;}
function dodge(){const p=player();if(p&&!state.dialogue&&!state.event&&!state.qte&&!state.cinematic&&!state.paused&&p.phase<=0){p.phase=.65;p.x=clamp(p.x+p.face*100,55,1225);effect('phase',p.x,FLOOR-70,p.def.theme[0]);}}
function input(action){
 if(state.paused)return;
 if(action==='interact')interact();else if(action==='jump')jump();else if(action==='switch'&&!state.dialogue&&!state.event&&!state.cinematic&&!state.qte)switchPlayer();
 else if(action==='ultimate')ultimate();else if(action==='dodge')dodge();else if(action.startsWith('attack'))requestAttack(Number(action.slice(-1))-1);
 else if(action==='fuse'){state.fuseArmed=true;banner('Choose two attacks to fuse.',1.7);}
 else if(action==='mazeUp')mazeMove(0,-1);else if(action==='mazeDown')mazeMove(0,1);
}
const movement={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',ShiftLeft:'sprint',ShiftRight:'sprint'};
addEventListener('keydown',e=>{
 if(window.ROMBIES_EXPANSION_ACTIVE)return;
 if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
 if(movement[e.code]||['Space','Tab','Enter','Escape','Digit1','Digit2','Digit3','Digit4'].includes(e.code))e.preventDefault();
 if(e.code==='Escape'){if(state.dialogue)skipDialogue();else pause();return;}
 if(state.paused)return;
 if(movement[e.code]){keys.add(movement[e.code]);if(!e.repeat&&movement[e.code]==='up'&&state.mode!=='maze')jump();}
 if(e.repeat)return;music.start();
 if(e.code==='Enter'||e.code==='KeyE')interact();else if(e.code==='Space')ultimate();else if(e.code==='Tab')input('switch');else if(e.code==='KeyC')dodge();else if(/^Digit[1-4]$/.test(e.code))requestAttack(Number(e.code.slice(-1))-1);
});
addEventListener('keyup',e=>{if(movement[e.code])keys.delete(movement[e.code]);});
addEventListener('blur',()=>{keys.clear();if(['battle','scene','maze'].includes(state.mode))pause(true);});
document.addEventListener('visibilitychange',()=>{keys.clear();if(document.hidden)pause(true);music.update();});
$('dialogue').onclick=nextDialogue;
document.querySelectorAll('[data-hold]').forEach(b=>{
 const release=()=>keys.delete(b.dataset.hold);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.hold);music.start();});['pointerup','pointercancel','lostpointercapture'].forEach(event=>b.addEventListener(event,release));
});
document.querySelectorAll('[data-tap]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();music.start();input(b.dataset.tap);}));
function renderBattleSelect(){
 $('battleGrid').replaceChildren();BATTLES.forEach((b,i)=>{const el=document.createElement('button');el.className='battleCard';el.innerHTML='<b></b><span></span>';el.querySelector('b').textContent=b.title;el.querySelector('span').textContent=b.sub+(save.completed.includes(b.id)?' · Completed':' · Available');el.onclick=()=>startBattle(i,true);$('battleGrid').append(el);});
}
function newStory(){save.checkpoint={battleId:BATTLES[0].id,phase:'scene',wave:0};persist();startScene(0);}
$('newBtn').onclick=newStory;$('playChapter1').onclick=newStory;$('replayBtn').onclick=newStory;
$('continueBtn').onclick=()=>{const cp=save.checkpoint,index=Math.max(0,BATTLES.findIndex(b=>b.id===cp.battleId));if(cp.phase==='complete'){newStory();return;}if(cp.phase==='battle')startBattle(index,false,cp.wave||0);else startScene(index);};
$('chaptersBtn').onclick=()=>menu('chapters');$('battleSelectBtn').onclick=()=>menu('battleSelect');
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>menu());$('endMenu').onclick=()=>menu();$('endBattles').onclick=()=>menu('battleSelect');
$('resumeBtn').onclick=()=>pause(false);$('restartBtn').onclick=()=>state.mode==='scene'?startScene(state.index,state.independent):startBattle(state.index,state.independent);$('quitBtn').onclick=()=>menu();
$('settingsBtn').onclick=()=>{state.settingsWasPaused=state.paused;if(['battle','scene','maze'].includes(state.mode)){state.paused=true;keys.clear();}$('settingsModal').classList.add('open');music.start();music.update();};
$('closeSettings').onclick=()=>{$('settingsModal').classList.remove('open');state.paused=!!state.settingsWasPaused;music.update();};
if($('movementWiggle')){$('movementWiggle').checked=save.wiggle!==false;$('movementWiggle').onchange=e=>{save.wiggle=e.target.checked;persist();};}
$('difficulty').value=String(save.difficulty);$('difficulty').onchange=e=>{save.difficulty=Number(e.target.value);persist();toast('Difficulty applies when an encounter starts.');};
$('musicVolume').value=String(Math.round(save.music*100));$('musicVolume').oninput=e=>{save.music=Number(e.target.value)/100;persist();music.start();};
$('creditsBtn').onclick=()=>$('credits').style.display=$('credits').style.display==='none'?'block':'none';
$('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(save,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='rombies-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('importFile').onchange=async e=>{
 try{const data=JSON.parse(await e.target.files[0].text());if(data.version!==2||!BATTLES.some(b=>b.id===data.checkpoint?.battleId)||!['scene','battle','complete'].includes(data.checkpoint.phase)||!Array.isArray(data.completed))throw Error('Invalid save');save={...freshSave(),...data,difficulty:clamp(Number(data.difficulty)||1,.8,1.55),music:clamp(Number(data.music)||0,0,.5)};save.checkpoint.wave=clamp(Math.floor(Number(save.checkpoint.wave)||0),0,(BATTLES.find(b=>b.id===save.checkpoint.battleId).waves?.length||1)-1);persist();menu();toast('Save imported. Continue Story resumes your checkpoint.');}catch(_){toast('That is not a valid Rombies save file.');}e.target.value='';
};
$('resetBtn').onclick=()=>{if(confirm('Reset your story progress and completed battle badges?')){save=freshSave();persist();menu();toast('Save reset. All battles remain available.');}};
let last=performance.now(),manual=false;
function frame(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(!window.ROMBIES_EXPANSION_ACTIVE){if(!manual)update(dt);render();}music.update();requestAnimationFrame(frame);}
window.ROMBIES_LEGACY={suspend(){keys.clear();state.paused=true;music.update();},resume(){menu();}};
menu();assetsReady.then(()=>{if(assetErrors.length)toast(assetErrors.length+' art files could not load. Keep the assets folder with the game files.');});requestAnimationFrame(frame);
// Browser regression harness is available only with ?test=1. Normal play exposes no debug controls.
if(testMode)window.ROMBIES_TEST={
 ready:assetsReady,get state(){return state;},get save(){return save;},get history(){return history;},data:GAME_DATA,assetErrors,
 get audio(){return {state:music.context?.state,beat:music.beat,volume:save.music};},
 manual(value=true){manual=value;},step(seconds){for(let t=0;t<seconds;t+=1/60)update(Math.min(1/60,seconds-t));render();},render,
 startBattle,startScene,skipDialogue,nextDialogue,interact,requestAttack,ultimate,useAbility,perform,damage,actor,player,switchPlayer,
 startTrial,trialChoice,trialRound,qteInput,mazeMove,pause,applyAction,animateAction,keys,abilities,newStory,menu,
 seed(value){seed=value;},finishBattle,beginWave,generateMaze,cinematic,releaseBanished,
 drain(){for(let i=0;i<200&&(state.dialogue||state.event||state.cinematic);i++){if(state.event){const e=state.event;state.event=null;e.commit();e.done();}else if(state.dialogue)skipDialogue();else this.step(3);}}
};
})();
