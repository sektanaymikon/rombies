(() => {
 'use strict';
 const S=RombiesSchema;
 const M=(name,kind='projectile',damage=28,cooldown=1.4,extra={})=>S.move({name,kind,damage,cooldown,color:'#a7e8ce',range:700,speed:500,size:20,...extra});
 const kits={
  flower:[M('Spork rush','melee',34,.5,{range:150}),M('Flower beam','beam',40,3),M('Knife throw','projectile',27,1,{size:12}),M('Regenerate','heal',60,7)],
  hammer:[M('Justice hammer','melee',50,.8,{range:210}),M('Hope','projectile',34,1.7,{count:3,color:'#fff4bf'}),M('Gerson’s lesson','burst',42,4,{range:340}),M('Study break','heal',65,8)],
  lightning:[M('Lightning','beam',38,2.4,{color:'#92eaff'}),M('Bro fist','melee',40,.7,{range:140}),M('Static guard','shield',60,7),M('Amber dash','dash',38,3.5,{range:280})],
  stand:[M('Barrage','melee',40,.65,{range:170}),M('Star shot','projectile',28,1.5,{count:3,color:'#c797ff'}),M('Time stop','freeze',22,12,{duration:1.3,range:750}),M('Stand guard','shield',75,8)],
  acid:[M('Acid spit','projectile',26,1.3,{effect:'poison',color:'#c5f856',duration:4}),M('Acid kick','melee',45,.8,{range:160,effect:'poison',color:'#c5f856'}),M('Incognito','dash',20,4,{range:220}),M('Acid pool','burst',32,4.5,{range:300,effect:'poison',duration:5})],
  speed:[M('Lightspeed poisoning','dash',38,2,{range:380,effect:'poison',duration:3}),M('Speed slice','melee',38,.5,{range:160}),M('Sonic rings','projectile',22,1.5,{count:3,color:'#f798b2'}),M('Afterimage','shield',55,6)],
  lead:[M('Tongue strike','beam',40,2,{color:'#ee8cac',range:650,size:12}),M('Lead shards','projectile',25,1.5,{count:3,color:'#c1c4d9'}),M('Don’t move','freeze',20,10,{duration:1.5}),M('Lead snack','heal',55,7)],
  metal:[M('Chaos spear','projectile',32,1.7,{count:3,color:'#ffc069',speed:590}),M('Metal claw','melee',45,.8,{range:190}),M('Chaos control','freeze',25,10,{duration:1.2}),M('Chaos blast','burst',45,6,{range:380,color:'#ffbf61'})],
  void:[M('Soul bolts','projectile',25,1.5,{count:5,spread:.3,color:'#9ddbe9'}),M('Blaster','beam',42,3,{size:28,color:'#fafaff'}),M('Soul lock','projectile',20,4,{effect:'stun',duration:.8}),M('Void ring','burst',38,5,{range:360})],
  poison:[M('Rombie bite','melee',25,.8,{range:145,effect:'poison',duration:3}),M('Serum spit','projectile',18,2,{color:'#c6e87b'}),M('Charge','dash',24,5,{range:220}),M('Howl','shield',28,8)],
  default:[M('Punch','melee',32,.6,{range:140}),M('Energy shot','projectile',27,1.5),M('Power wave','burst',32,4,{range:240}),M('Guard','shield',55,7)]
 };
 function C(id,name,sprite,kit='default',hp=520,extra={}){return {...S.fighter({id,name,sprite,color:extra.color||'#9aefbe',hp,speed:extra.speed||240,size:extra.size||1,ai:extra.ai||'balanced',moves:kits[kit],ultimate:M(extra.ult||'Domain expansion','burst',115,15,{range:950,color:extra.color||'#c3ddfc',size:90})}),note:extra.note||'',...extra};}
 const roster={
  shane:C('shane','Shane','m002','flower',540,{ult:'Flower Type 2 · Jackpot',note:'The blue flower form from the opening culling games.'}),
  gerson:C('gerson','Shane · Gerson','m075','hammer',650,{ult:'Hall of the Hammer',note:'The old study and the hammer of justice.'}),
  hammer:C('hammer','Shane · Hammer form','m079','hammer',720,{ult:'Gerson’s Study Hall'}),
  charlie:C('charlie','Charlie','m003','flower',760,{ult:'Manga prediction',ai:'ranged'}),
  mick:C('mick','Mickshimo','m010','lightning',850,{ult:'Mythical Bro Amber',speed:310}),
  raph:C('raph','Raph','m015','stand',600,{ult:'Star Platinum barrage'}),
  raphOver:C('raphOver','Raph · Over Heaven','m333','stand',800,{ult:'Over Heaven · MUDA'}),
  starPinger:C('starPinger','Star Pinger','m024','stand',480,{ult:'Star Pinger cloud'}),
  nande:C('nande','Nande','m041','stand',620,{ult:'Crazy Diamond'}),
  ada:C('ada','Ada','m330','stand',620,{ult:'Sunder the X'}),
  pucci:C('pucci','Ada · Final evolution','m183','stand',800,{ult:'Sun, come forth',note:'The final evolution shown with the green stand.'}),
  leonard:C('leonard','Leonard','m040','acid',560,{ult:'Acid maple syrup'}),
  leonardEvo:C('leonardEvo','Leonard · Acid evolution','c2_leonard_battle','acid',820,{ult:'Last acid',note:'Pig head and evolved body composited from the supplied image slide.'}),
  raleigh:C('raleigh','Raleigh','m039','speed',530,{ult:'Atomic dash'}),
  raleighEvo:C('raleighEvo','Raleigh · Lightspeed','m092','speed',640,{ult:'Lightspeed poisoning',speed:385,note:'The gray curled character with red shoes from the evolution sheet.'}),
  max:C('max','Max','m042','lead',600,{ult:'Lead extraction'}),
  maxHood:C('maxHood','Max · Hooded','m146','lead',680,{ult:'Lead chariot'}),
  maxTongue:C('maxTongue','Max · True form','m171','lead',780,{ult:'Lead extraction · full power',note:'The white hooded form with the extended tongue.'}),
  oliver:C('oliver','Oliver','m281','stand',560,{ult:'Heavenly light novel'}),
  oliverEvo:C('oliverEvo','Oliver · Heaven’s Door','m043','stand',710,{ult:'Heaven’s Door'}),
  vivi:C('vivi','Vivi','m032','default',510,{ult:'GET OUT ELMYLE'}),
  miwa:C('miwa','Vivi · Miwa','m120','speed',620,{ult:'Simple domain'}),
  myles:C('myles','Myles','sprite:myles','default',500,{ult:'Flower storm'}),
  myguna:C('myguna','Myguna','sprite:evil_myles','metal',1500,{ult:'World cutting slash',color:'#f9afc3'}),
  eagle:C('eagle','Mighty Eagle','m036','stand',800,{ult:'Hollow tuna can'}),
  michael:C('michael','Michael','sprite:michael','default',800,{ult:'Consume everything',size:1.25}),
  michaelMech:C('michaelMech','Michael · Mech','m282','metal',950,{ult:'Mech overload',size:1.5}),
  vaughn:C('vaughn','Vaughn','m044','speed',570,{ult:'Web barrage'}),
  semular:C('semular','Semular Exis','m045','stand',540,{ult:'La Peace'}),
  rapper:C('rapper','Rapper Po','m286','default',650,{ult:'Phonk blast'}),
  piano:C('piano','Piano Man','m051','stand',570,{ult:'Absolute cinema'}),
  jschlatt:C('jschlatt','Jschlatt','m084','default',560,{ult:'Subscriber shield'}),
  john:C('john','John Rod','m088','void',1200,{ult:'Atomic erasure',ai:'ranged'}),
  spamton:C('spamton','Spamton NEO','m068','void',1300,{ult:'Pipis overload',size:1.3}),
  retep:C('retep','Retep','sprite:retep','poison',1200,{ult:'Possession'}),
  retepVessel:C('retepVessel','Retep · Nande’s vessel','m041','stand',1400,{ult:'Get out of my body'}),
  metal:C('metal','Metal Sonic','m267','metal',650,{ult:'Chaos blast',speed:340}),
  neo:C('neo','Neo Metal Sonic','m335','metal',1350,{ult:'Biodata copy',speed:320}),
  superNeo:C('superNeo','Super Neo Metal Sonic','m055','metal',1900,{ult:'Chaos control',size:1.2}),
  overlord:C('overlord','Metal Overlord','c2_overlord','metal',3400,{ult:'World division',size:2.1,ai:'tank',color:'#d5a7ff'}),
  finalMetal:C('finalMetal','Metal Sonic · Final form','c2_finalMetal','metal',4200,{ult:'A-SUN',size:1.4}),
  dio:C('dio','Dio','m125','stand',1150,{ult:'Wheelchair mansion'}),
  doom:C('doom','Dr Doom 2099','m141','metal',1500,{ult:'Aim assist'}),
  dhruv:C('dhruv','Dhruv','m328','poison',1250,{ult:'Leaf compression',ai:'ranged'}),
  jane:C('jane','Jane Juliet','m093','void',1100,{ult:'Final reserve ball'}),
  calories:C('calories','High Calories','m094','default',500,{ult:'Reserve ball'}),
  kyrara:C('kyrara','Kyrara','sprite:kyrara','void',1350,{ult:'Icy stairway'}),
  titan:C('titan','The Titan','m170','void',2000,{ult:'Gaster blaster',size:2,ai:'ranged'}),
  gucci:C('gucci','Gucci Morty','m329','stand',700,{ult:'Stand arrow'}),
  penny:C('penny','Pennywise','m017','default',720,{ult:'Fish domain'}),
  obama:C('obama','Obama','m018','default',650,{ult:'Boxing barrage'}),
  monkey:C('monkey','Super Monkey Fan Club','m062','default',880,{ult:'Chimera time'}),
  saul:C('saul','Saul','m046','stand',700,{ult:'Public execution'}),
  uro:C('uro','Uro Zenin','m114','void',630),
  hazanoki:C('hazanoki','Hazanoki','m115','metal',700),
  zapato:C('zapato','Zapato','m098','default',560),
  mecha:C('mecha','Mecha Sonic','m019','metal',750),
  rombie:C('rombie','Rombie','m026','poison',240,{size:.7}),
  flying:C('flying','Flying Rombie','sprite:flying_rombie','poison',270,{size:.8,ai:'ranged'}),
  rombieMech:C('rombieMech','Rombie Mech','sprite:rombie_mech','metal',1250,{size:1.8}),
  fractured:C('fractured','Fractured Rombie','m138','poison',1400,{size:1.7,ai:'rush'}),
  carrier:C('carrier','Rombie Carrier','sprite:rombie_carrier','metal',1450,{size:1.7,ai:'ranged'})
 };
 // Existing Chapter One characters are also available as builder presets.
 for(const [id,c] of Object.entries(GAME_DATA.CHAR))if(!roster['ch1_'+id]){
  const kinds={poison_melee:'melee',cinematic:'burst',buff:'shield',invisible:'dash',toggle:'shield',banish:'freeze',oneshot:'beam',selfdestruct:'burst',rombie_toggle:'shield',swap:'dash'};
  roster['ch1_'+id]=S.fighter({id:'ch1_'+id,name:c.name+' · Ch1',sprite:'sprite:'+c.sprite,hp:Math.min(c.hp||500,2500),speed:c.speed||240,color:c.theme?.[0],moves:c.abilities?.slice(0,4).map(m=>M(m[1],kinds[m[2]]||m[2],Math.min(Number(m[3])||28,100),Math.max(Number(m[4])||2,.5))),ultimate:M(c.ultimate?.name||'Ultimate','burst',110,15,{range:900})});
 }
 const rows=[
  ['charlie','Future in a manga','Culling games',1,4,['shane'],[['charlie']], 'Read Charlie’s tells, then punish the opening.','F parries the predicted strike. Save Space for the mech finish.','prediction'],
  ['mick','Besto bro','Culling games',15,23,['shane'],[['mick']],'Mickshimo has lightning. Shane has a very unreasonable jackpot.','Hold out for 666. A jackpot restores health and grants a shield.','jackpot'],
  ['beatbox','The beatbox battle','Raph’s detour',83,88,['raph','rapper'],[['penny','obama']],'Keep the rhythm while the challengers turn a beatbox battle into a fight.','Complete the rhythm sequence when it appears.','rhythm'],
  ['arrow','A very Gucci stand arrow','Raph’s detour',105,112,['raph','starPinger'],[['gucci'],['flying','flying']],'Try Star Pinger, then knock the flying Rombies out of the sky.','Tab switches between Raph and Star Pinger.'],
  ['eagle','Hollow tuna can','Myguna',151,165,['eagle'],[['myguna']],'Survive the domain clash long enough to land Hollow Tuna Can.','This is a survival objective. The next scenes keep the original duel outcome.','clash'],
  ['amber','Mythical Bro Amber','Myguna',214,222,['mick'],[['superNeo']],'One last lightning exchange before Myguna takes a new vessel.','Parry the spears and keep moving through the world cutting slash.','survive'],
  ['monkey','Heavenly manga punch','The split team',243,250,['oliver'],[['monkey','saul']],'Oliver has a heavenly technique and two very unhelpful allies.','Charge your ultimate by landing hits, then finish the domain clash.','clash'],
  ['spamton','The old study','Gerson',266,279,['gerson'],[['spamton']],'Spamton NEO has pipis. Gerson has a lesson plan.','Jump the projectile spread and answer with the hammer.'],
  ['pyramid','John Rod’s pyramid','The pyramid',297,310,['raleigh','piano','jschlatt'],[['john']],'The riddle is over. Survive the falling ceiling and atomic attacks.','Red columns show where the ceiling will fall. Jump or dodge away.','ceiling'],
  ['lightspeed','Lightspeed poisoning','The pyramid',338,342,['raleighEvo'],[['john']],'Raleigh’s new form finally has the speed to fight back.','Use dash attacks to cross the arena and poison John Rod.'],
  ['jane','Last reserve ball','Jupiter road',351,359,['leonard','vaughn','semular'],[['jane','calories']],'The Jupiter road fight pushes Leonard toward a new form.','Swap injured teammates and use acid to wear down the reserve.'],
  ['retep','Max locks in','Retep',387,393,['max'],[['retep']],'Turn Retep’s pressure around with a tongue strike and a little lead.','Stay near the left supply zone to slowly recover lead energy.','lead'],
  ['betrayal','Three challengers, one Metal','Metal Sonic',402,406,['superNeo'],[['saul','uro','hazanoki']],'Use Metal Sonic’s stolen techniques against three attackers.','Chaos Control freezes the opposing team.'],
  ['dio','Wheelchair mansion','The mansion',411,431,['leonardEvo','ada','miwa'],[['dio']],'Get through Dio’s time stop and break the mansion domain.','F can parry an incoming hit. Use acid during recovery windows.','clash'],
  ['jupiter','Aim assist on Jupiter','Jupiter',449,465,['raleighEvo','ada','leonardEvo'],[['doom','dhruv']],'The ship has crashed. Doom 2099 and Dhruv block the return route.','Destroy cover to open firing lanes, then use speed to isolate Doom.'],
  ['hunger','Michael eats the scenery','The reunion',478,489,['michael'],[['rombie','rombie','rombie']],'Michael is hungry enough to consume the background.','Collect the green supply zones and keep the Rombies away.','hunger'],
  ['neo','Biodata copied','The army',510,521,['raph','ada','leonardEvo'],[['superNeo']],'Metal Sonic now carries stolen stands and knows your moves.','Use different teammates to break up his pressure.'],
  ['army','The Rombie army','The army',530,539,['gerson','ada','leonardEvo','raph'],[['rombie','rombie','flying','flying'],['rombieMech','rombie','flying'],['fractured','carrier']],'Break through normal, flying, mechanical and fractured Rombies.','Three waves. Every cleared wave restores some team health.','ceiling'],
  ['vessel','Who started the virus?','Retep revealed',562,568,['leonardEvo'],[['retepVessel']],'The mech opens. Retep is using Nande’s vessel.','Use Incognito to reposition, then land the acid kick.'],
  ['kyrara','Hell spicing','The split battlefield',570,578,['hammer'],[['kyrara']],'The stairs are ice. The floor is fire. Shane brought a hammer.','Use the raised platforms. Staying in fire drains health.','ice'],
  ['dhruv','One trillion pounds','The split battlefield',601,609,['raleighEvo'],[['dhruv']],'Dhruv compresses the arena with his leaf domain.','A domain clash can restore your ultimate.','clash'],
  ['chaos','Chaos Control','The split battlefield',621,627,['raph','raleighEvo','starPinger'],[['superNeo']],'Copied biodata, stolen stands and a frozen battlefield.','Keep a dodge ready for the Chaos Blast.','survive'],
  ['titan','Lead extraction','Max’s domain',634,646,['maxTongue'],[['titan']],'Fight through the blasters, fill the lead supply, then strike the core.','Stand in the left supply zone to recharge. The finish asks for → and Space.','lead'],
  ['overlord','Metal Overlord','World division',659,670,['raphOver','pucci','raleighEvo','maxTongue'],[['overlord']],'The final evolutions arrive as Metal Overlord divides the battlefield.','Survive the pressure and complete the transformation sequence.','survive'],
  ['lastAcid','Leonard’s last acid','World division',701,711,['leonardEvo','pucci'],[['overlord']],'Leonard and Ada face Overlord in the ruined church.','Hold out through the attack pattern. The following scene contains Leonard’s original outcome.','survive'],
  ['heavensDoor','Heaven’s Door','World division',728,735,['hammer','maxTongue','oliverEvo'],[['overlord']],'On a ship beyond the stars, the team tries one final command.','Complete the sequence to open Heaven’s Door.','clash'],
  ['house','Johnny Johnny…','World division',747,752,['raphOver','starPinger','miwa'],[['overlord']],'The house looked safe for approximately one second.','Reach the glowing escape points while dodging Overlord.','escape'],
  ['water','Walking on water','World division',770,778,['raleighEvo','zapato','mecha'],[['overlord']],'A distraction, an escape, and one very fast counterattack.','Reach six escape points. Speed is your best defense.','escape'],
  ['asun','A-SUN','The final form',788,798,['raphOver','pucci','raleighEvo','oliverEvo'],[['finalMetal']],'Four survivors face Metal Sonic’s final transformation.','Survive the final pattern. The story continues into the universe reset.','survive'],
  ['rewind','The universe resets','Requiem',823,829,['nande','starPinger'],[['finalMetal']],'Retep reaches for control. The stand refuses, and time starts to unwind.','Complete the reverse sequence before the universe folds.','rewind'],
  ['reckoning','Metal D. Sonic Hernandez…','A second chance',843,847,['shane','raph','leonard','raleigh'],[['metal']],'Everyone remembers. Metal Sonic has one very long name and nowhere to hide.','Finish the fight to see the death loop and all the epilogues.']
 ];
 const encounters=rows.map((r,i)=>({id:r[0],title:r[1],arc:r[2],start:r[3],after:r[4],party:r[5],waves:r[6],brief:r[7],hint:r[8],mechanic:r[9]||'',index:i+1,hazard:r[9]==='ceiling',qte:['clash','rhythm','prediction','rewind','lead','survive'].includes(r[9])?{at:12,title:r[9]==='lead'?'LEAD EXTRACTION · STRIKE!':r[9]==='rhythm'?'KEEP THE BEAT':r[9]==='rewind'?'REVERSE THE UNIVERSE':'DOMAIN CLASH',sequence:r[9]==='lead'?['ArrowRight','Space']:r[9]==='rewind'?['ArrowLeft','KeyF','ArrowLeft','Space']:['KeyF','ArrowRight','KeyF','Space'],seconds:9}:null}));
 function bgAt(n){const s=ROMBIES_SCENES[n-1];return s?.items.find(o=>o.t==='image'&&o.w>850&&o.h>390)?.asset||'bg:desert';}
 const backgrounds=[['Culling games',1],['Pyramid',300],['Jupiter road',351],['Living room',376],['Mansion',411],['Jupiter',450],['Gmod village',465],['Gerson’s study',277],['Battlefield',690],['Ruined church',705],['Star sea',730],['House interior',750],['Water',775],['The end',900]].map(([name,n])=>({name,key:bgAt(n)}));
 // Battle scenery is selected from the fight itself, including its authored masks.
 const stages={charlie:[3,566],mick:[17,594],beatbox:[85,560],arrow:[107,620],eagle:[151,600],amber:[151,600],monkey:[245,562],spamton:[289,610],pyramid:[310,625],lightspeed:[342,625],jane:[359,600],retep:[391,585],betrayal:[402,595],dio:[431,600],jupiter:[459,600],hunger:[480,645],neo:[512,650],army:[532,600],vessel:[564,590],kyrara:[575,590],dhruv:[603,600],chaos:[633,600],titan:[637,485],overlord:[661,645],lastAcid:[705,635],heavensDoor:[730,582],house:[749,600],water:[772,560],asun:[790,640],rewind:[825,640],reckoning:[845,620]};
 const speakerAliases={m009:'Shane',m067:'Shane',m081:'Shane',m078:'Shane',m096:'Leonard',m156:'Leonard',m150:'Ada',m118:'Ada',m097:'Vivi',m182:'Raph',m185:'Raph',m162:'Raph',m184:'Oliver',m158:'Retep',m103:'Retep',m085:'John Rod',m009:'Shane',m094:'Kyrara',m031:'Myguna'};
 function linesAt(slide,cue=100){
  const source=typeof slide==='number'?ROMBIES_SCENES[slide-1]:slide;if(!source)return [];
  const images=source.items.filter(o=>o.asset&&o.id!=='background'&&o.w<800&&o.h>40&&o.asset!=='m000');
  return source.items.filter(o=>o.text&&(cue===100||!(source.cues||[]).some((g,i)=>g.some(e=>e.targets.some(id=>[o.id,...(o.groups||[])].includes(id))&&((e.kind==='entr'&&cue<i+1)||(e.kind==='exit'&&cue>=i+1)))))).map(o=>{
   const text=o.text.map(p=>p.text).join(' ').trim();const explicit=text.match(/(?:^|[-–]\s*)(Shane|Max|Raph|Raleigh|Leonard|Ada|Oliver|Nande|Saul|Vivi)\s*[:–-]/i)||text.match(/[-–]\s*(Shane|Max|Raph|Raleigh|Leonard|Ada|Oliver|Nande|Vivi)\s*$/i);
   const nearest=[...images].sort((a,b)=>{const dist=v=>Math.hypot((v.x+v.w/2)-(o.x+o.w/2),v.y-(o.y+o.h));return dist(a)-dist(b);})[0];
   const f=Object.values(roster).find(f=>f.sprite===nearest?.asset);let speaker=explicit?.[1]||speakerAliases[nearest?.asset]||f?.name||'Narrator';
   if(source.n>=635&&source.n<=648&&text&&!/Where am I|What the|NOOO/i.test(text))speaker='Max';
   return {speaker,text,portrait:source.n>=637&&source.n<=648?'m171':nearest?.asset||f?.sprite||'',slide:source.n};
  }).filter(l=>l.text&&l.text!=='•ᴗ•'&&!/^Editor |^The night of the living rombies$/i.test(l.text));
 }
 function encounterLines(e,phase='before'){
  const nums=phase==='after'?[e.after+1,e.after+2]:e.id==='titan'?[637,641]:Array.from({length:e.after-e.start+1},(_,i)=>e.start+i);
  const seen=new Set(),lines=nums.flatMap(n=>linesAt(n)).filter(l=>{if(seen.has(l.text))return false;seen.add(l.text);return !/^To |^Back to |^Later at |Domain clash|Mighty Eagle vs Myguna/i.test(l.text);});
  return phase==='combat'?lines.slice(-2):phase==='before'?lines.slice(0,2):lines.slice(0,2);
 }
 function scenery(e,d){
  const [n,y]=stages[e.id],s=ROMBIES_SCENES[n-1];d.background=s.items.find(o=>o.id==='background')?.asset||bgAt(n);d.floor={x:0,y,w:1280,h:720-y,color:'#29313e',visible:false};
  let layers=s.items.filter(o=>o.t==='shape'&&!o.text&&o.w>120&&o.fill==='#000000');
  if(e.id==='titan'){
   layers=s.items.filter(o=>o.asset==='m166'||o.asset==='m167'||o.asset==='m165'||['8592','8594','8596','8606'].includes(o.id));
   d.floor={...d.floor,visible:true,asset:'m166',color:'#24233e'};
  }
  if(e.id==='heavensDoor'){d.floor={x:0,y:582,w:1280,h:138,color:'#483c34',visible:true};}
  if(e.id==='retep'||e.id==='betrayal'){d.floor={...d.floor,visible:true,color:'#383243'};}
  d.scene={slide:n,ids:layers.map(o=>o.id),masks:e.id==='titan'?[{x:487.98,y:0,w:640,h:493.33,color:'#000000'}]:[]};
  d.party.forEach((f,i)=>{f.x=150+i*105;});d.waves.forEach(w=>w.enemies.forEach((f,i)=>{f.x=850+i*100;}));
  for(const o of d.obstacles)if(o.type==='heal'){o.y=y-30;}
  return d;
 }
 function makeFight(e){
  const d={version:1,title:e.title,description:e.brief,background:bgAt(stages[e.id][0]),color:'#a8ebc5',mode:['survive','clash','escape','rewind'].includes(e.mechanic)?'survive':'defeat',duration:e.mechanic==='escape'?55:e.mechanic==='rewind'?25:42,gravity:1300,friendlyFire:false,playerDamage:1,enemyDamage:.75,music:e.arc==='World division'?'finale':'chaos',party:e.party.map(id=>structuredClone(roster[id])),waves:e.waves.map((ids,i)=>({name:e.title+(e.waves.length>1?' · Wave '+(i+1):''),delay:2,enemies:ids.map(id=>structuredClone(roster[id]))})),obstacles:[]};
  if(e.mechanic==='lead'||e.mechanic==='hunger')d.obstacles.push({name:e.mechanic==='lead'?'LEAD SUPPLY':'SNACK ZONE',type:'heal',x:65,y:570,w:170,h:30,color:'#8fc8b0',hp:100,damage:8});
  if(e.mechanic==='ice')d.obstacles=[{name:'FIRE',type:'hazard',x:390,y:565,w:350,h:35,color:'#fe7464',hp:100,damage:22},{name:'Ice step',type:'platform',x:380,y:455,w:160,h:24,color:'#aeeafe',hp:100,damage:1},{name:'Ice step',type:'platform',x:670,y:390,w:170,h:24,color:'#aeeafe',hp:100,damage:1}];
  if(e.id==='jupiter')d.obstacles=[{name:'Ship debris',type:'cover',x:540,y:460,w:110,h:140,color:'#728ba6',hp:220,damage:1}];
  return S.fight(scenery(e,d));
 }
 function template(){return S.fight({title:'My first ridiculous fight',description:'A little acid. A little chaos. A lot of Rombies.',party:[roster.shane,roster.leonard],waves:[{name:'Incoming Rombies',delay:2,enemies:[roster.rombie,roster.flying]},{name:'Boss time',delay:3,enemies:[roster.neo]}],background:'bg:desert',color:'#b8edc8',mode:'defeat',duration:90,gravity:1300,playerDamage:1,enemyDamage:1,music:'chaos',obstacles:[{name:'Cover',type:'cover',x:580,y:490,w:85,h:110,color:'#96afa9',hp:180,damage:10}]});}
 function featured(){return [makeFight(encounters[17]),makeFight(encounters[22]),makeFight(encounters[19]),S.fight({...template(),title:'Oops! All Metal',description:'Four evolutions, three waves, one very crowded arena.',party:[roster.metal,roster.neo],waves:[{name:'Neo',enemies:[roster.neo]},{name:'Super Neo',enemies:[roster.superNeo]},{name:'Overlord',enemies:[roster.overlord]}]})];}
 window.ROMBIES_CHAPTER2={roster,encounters,backgrounds,makeFight,template,featured,linesAt,encounterLines,stages};
})();
