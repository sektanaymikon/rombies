/* Live community chat, private conversations and console-granted admin tools. */
(() => {
 'use strict';
 const C=RombiesCloud,A=RombiesApp,$=A.$,btn=A.button;
 const layer=$('div',{id:'rombies-social'}),alerts=$('div',{class:'rs-alerts','aria-live':'polite'}),toggle=btn('Chat',open,'rs-toggle'),dock=$('section',{class:'rs-dock',hidden:true,'aria-label':'Rombies chat'});
 layer.append(alerts,toggle,dock);document.body.append(layer);
 let me=null,config={chatEnabled:false},announcement=null,notice=null,mode='global',room='global',members=null,currentHandle='',closed=true,rows=[],people=[],peopleCursor=null,morePeople=false,threads=[],pending=false,viewVersion=0,adminUnlocked=false;
 let sharing=null,shareTimer=null,shareBusy=false,viewing=null;const sharingBox=$('div',{class:'rs-sharing',hidden:true});layer.append(sharingBox);
 const subs=new Map(),versions=new Map();
 function attach(){const parent=document.fullscreenElement||document.body;if(layer.parentElement!==parent)parent.append(layer);}
 document.addEventListener('fullscreenchange',attach);new MutationObserver(()=>{if(!layer.isConnected)attach();}).observe(document.body,{childList:true,subtree:true});
 async function listen(key,promise){const n=(versions.get(key)||0)+1;versions.set(key,n);subs.get(key)?.();subs.delete(key);try{const off=await promise;if(versions.get(key)===n)subs.set(key,off);else off();}catch(e){if(!closed)error(e);}}
 function stop(key){versions.set(key,(versions.get(key)||0)+1);subs.get(key)?.();subs.delete(key);}
 function error(e){const n=dock.querySelector('.rs-status');if(n)n.textContent=C.explain(e);}
 const milliseconds=t=>t?.toMillis?.()||((t?.seconds||0)*1000);
 let bannerKey='';
 function banners(){const active=[['global',announcement],['private',notice]].filter(([,d])=>d&&milliseconds(d.expiresAt)>Date.now()),key=JSON.stringify(active);if(key===bannerKey)return;bannerKey=key;alerts.replaceChildren();for(const [kind,d]of active){const n=$('div',{class:'rs-banner '+kind},[$('strong',{text:kind==='global'?'ADMIN ANNOUNCEMENT':'MESSAGE FOR YOU'}),$('span',{text:d.body}),$('small',{text:'@'+d.handle})]);if(kind==='private')n.append(btn('Dismiss',()=>{notice=null;banners();}));alerts.append(n);}layer.style.setProperty('--rs-alert-height',alerts.getBoundingClientRect().height+'px');}
 addEventListener('resize',()=>layer.style.setProperty('--rs-alert-height',alerts.getBoundingClientRect().height+'px'));
 setInterval(banners,1000);
 async function refresh(){
  const old=me?.uid;me=await C.session();if(old&&old!==me.uid){for(const key of ['ban','notice','threads','messages'])stop(key);notice=null;rows=[];threads=[];mode='global';room='global';}
  await listen('screen-request',C.watchSelf('screenRequests',screenRequest,viewingError));
  await listen('ban',C.watchSelf('bans',b=>{me.ban=b;if(b?.active){stop('messages');stop('threads');rows=[];}if(!closed)render();},error));
  await listen('notice',C.watchSelf('notices',d=>{notice=d;banners();},error));
  if(me.profile&&!me.ban?.active)await listen('threads',C.watchThreads(d=>{threads=d;const list=dock.querySelector('.rs-people');if(!closed&&mode==='people'&&list)fillPeople(list);},error));
  toggle.textContent=me.admin?'Chat / Admin':'Chat';return me;
 }
 async function open(){closed=false;dock.hidden=false;dock.replaceChildren($('p',{text:'Connecting…'}));try{await refresh();render();if(me.profile&&!me.ban?.active&&config.chatEnabled)await messages();}catch(e){render();error(e);}}
 async function close(){await endView();closed=true;dock.hidden=true;if(adminUnlocked)C.lockAdmin().catch(()=>{});adminUnlocked=false;if(me)me.admin=false;mode='global';toggle.textContent='Chat';stop('messages');viewVersion++;}
 function openAdmin(){closed=false;dock.hidden=false;mode='admin';adminUnlocked=false;stop('messages');viewVersion++;render();}
 function passwordPanel(){const input=$('input',{type:'password',inputmode:'numeric',maxlength:4,'aria-label':'Admin password',autocomplete:'off'}),note=$('p',{class:'rs-status',role:'status'}),unlock=$('button',{type:'submit',text:'Unlock admin panel'}),form=$('form',{},[$('h3',{text:'Admin panel'}),$('label',{},['Password',input]),note,unlock]);form.addEventListener('submit',async e=>{e.preventDefault();if(input.value!=='0219'){note.textContent='Incorrect password.';return;}unlock.disabled=true;note.textContent='Unlocking…';try{await C.unlockAdmin(input.value,A.profile?.handle,A.profile?.displayName);adminUnlocked=true;await refresh();A.connectProfile?.(me.profile);render();if(me.admin)await adminPeople();}catch(e){note.textContent=C.explain(e);unlock.disabled=false;}});dock.append(form);input.focus();}
 function heading(){const nav=$('div',{class:'rs-head'},[$('strong',{text:'ROMBIES COMMUNITY'}),btn('Refresh',async()=>{try{await refresh();render();await messages();}catch(e){error(e);}}),btn('Close',close)]),tabs=$('nav',{class:'rs-tabs'});for(const [id,label]of [['global','# global'],['people','People / DMs'],...(me?.admin?[['admin','Admin']]:[])])tabs.append(btn(label,()=>selectMode(id),mode===id?'primary':''));return[nav,tabs];}
 async function selectMode(id){if(id==='admin'&&!adminUnlocked){openAdmin();return;}mode=id;viewVersion++;stop('messages');rows=[];if(id==='global'){room='global';members=null;}render();try{if(id==='people')await loadPeople(false);if(id==='global')await messages();if(id==='admin'&&me?.admin)await adminPeople();}catch(e){error(e);}}
 function render(){
  if(viewing)endView();dock.replaceChildren(...heading());
  dock.scrollTop=0;
  if(mode==='admin'&&!adminUnlocked){passwordPanel();return;}
  if(mode==='admin'&&!me?.admin){dock.append($('h3',{text:'Admin session ended'}),$('p',{text:'Enter the password again to unlock the controls.'}),btn('Unlock again',openAdmin));return;}
  if(!me?.profile){dock.append($('p',{text:'Connect your online username to use chat and DMs.'}),btn('Creator account',()=>{close();A.account();}),$('p',{class:'rs-muted',text:'After connecting, open Chat again. Your email is never shown here.'}));return;}
  if(me.ban?.active){dock.append($('h3',{text:'Online account banned'}),$('p',{text:me.ban.reason||'Contact the game creator about this account.'}),$('p',{text:'Online posting, chat and uploads are blocked. Local play remains available.'}));return;}
  dock.append($('p',{class:'rs-status',role:'status'}));
  if(mode==='admin'&&me.admin){adminPanel();return;}
  if(!config.chatEnabled){dock.append($('p',{text:'Chat and DMs are currently disabled by an admin.'}));return;}
  if(mode==='people'){peoplePanel();return;}
  chatPanel();
 }
 function chatPanel(){
  dock.append($('h3',{text:room==='global'?'# global':'DM · @'+currentHandle}));const list=$('div',{class:'rs-messages','aria-live':'polite'});dock.append(list);paintMessages(list);
  const input=$('textarea',{maxlength:1000,placeholder:'Message '+(room==='global'?'# global':'@'+currentHandle),'aria-label':'Message',rows:2}),send=$('button',{type:'submit',class:'primary',text:'Send'}),form=$('form',{class:'rs-compose'},[input,send]);form.addEventListener('submit',e=>{e.preventDefault();submit();});
  async function submit(){if(pending||!input.value.trim())return;pending=true;send.disabled=true;const body=input.value;try{await C.sendMessage(room,body,members);if(input.value===body)input.value='';error({message:'Message sent.'});}catch(e){error(e);}finally{pending=false;send.disabled=false;}}
  input.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();submit();}});dock.append(form,$('small',{class:'rs-muted',text:'Latest 50 messages · 2-second posting limit · Ctrl+Enter to send'}));
 }
 function paintMessages(list){list.replaceChildren();if(!rows.length)list.append($('p',{class:'rs-muted',text:'No messages yet.'}));for(const m of rows){const n=$('article',{class:'rs-message'},[$('strong',{text:'@'+m.handle}),$('time',{text:new Date(milliseconds(m.createdAt)||Date.now()).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}),$('p',{text:m.body})]);list.append(n);}list.scrollTop=list.scrollHeight;}
 async function messages(){stop('messages');if(closed||!me?.profile||me.ban?.active||!config.chatEnabled||!['global','dm'].includes(mode))return;const version=viewVersion,id=room;await listen('messages',C.watchMessages(id,data=>{if(version!==viewVersion||room!==id)return;rows=data;const l=dock.querySelector('.rs-messages');if(l)paintMessages(l);},error));}
 async function loadPeople(next){const page=await C.directory(next?peopleCursor:null);people=next?[...people,...page.items]:page.items;peopleCursor=page.cursor;morePeople=page.more;const list=dock.querySelector('.rs-people');if(mode==='people'&&list)fillPeople(list);if(mode==='admin'&&list)fillAdminNames(list);return people;}
 function finder(callback){const input=$('input',{placeholder:'Find exact username','aria-label':'Find username',maxlength:21}),find=btn('Find',async()=>{const handle=input.value;try{await callback(await C.lookup(handle));}catch(e){error(e);}});return $('div',{class:'rs-find'},[input,find]);}
 function peoplePanel(){dock.append(finder(p=>openDM(p)));const list=$('div',{class:'rs-people'});dock.append(list);fillPeople(list);}
 function fillPeople(list){list.replaceChildren();const existing=$('div');if(threads.length){existing.append($('strong',{text:'Your conversations'}));for(const t of threads){const uid=t.members.find(x=>x!==me.uid);if(uid)existing.append(btn('@'+(people.find(p=>p.uid===uid)?.handle||'Load username'),async()=>{try{const p=await C.person(uid);await openDM(p);}catch(e){error(e);}}));}list.append(existing);}
  list.append($('strong',{text:'Registered usernames'}));for(const p of people)list.append(btn('@'+p.handle+(p.uid===me.uid?' · you':''),()=>openDM(p)));if(morePeople)list.append(btn('Load more usernames',()=>loadPeople(true).catch(error)));if(!people.length)list.append($('p',{text:'Loading usernames…'}));
 }
 async function openDM(p){try{if(p.uid===me.uid)return;const t=await C.threadFor(p.uid);room=t.id;members=t.members;currentHandle=p.handle;mode='dm';viewVersion++;rows=[];render();await messages();}catch(e){error(e);}}
 function adminPanel(){
  dock.append($('h3',{text:'Admin panel'}),$('p',{class:'rs-muted',text:'Signed in as @'+me.profile.handle}),btn('Force refresh everyone',()=>{const box=$('div',{class:'rs-confirm'},[$('p',{text:'Reload all connected players in five seconds? Upload your update first. Current battles will restart.'}),btn('Cancel',()=>box.remove()),btn('Refresh everyone',async()=>{try{await C.forceRefresh();box.remove();error({message:'Refresh sent.'});}catch(e){error(e);}})]);dock.append(box);}),btn(config.chatEnabled?'Disable chat and DMs':'Enable chat and DMs',async()=>{try{await C.setChat(!config.chatEnabled);}catch(e){error(e);}}));
  const body=$('textarea',{maxlength:500,placeholder:'Top-center announcement','aria-label':'Announcement',rows:3}),duration=$('input',{type:'number',min:5,max:3600,value:30,'aria-label':'Announcement duration seconds'});dock.append($('label',{},['Announcement duration (seconds)',duration]),body,$('div',{class:'rs-actions'},[btn('Send globally',()=>C.announce(body.value,Number(duration.value)).then(()=>error({message:'Announcement sent.'})).catch(error),'primary'),btn('Clear announcement',()=>C.clearAnnouncement().catch(error))]));
  dock.append($('h3',{text:'Find a player'}),finder(p=>showPerson(p)), $('div',{class:'rs-admin-person'}),$('h3',{text:'All registered usernames'}));const names=$('div',{class:'rs-people'});for(const p of people)names.append(btn('@'+p.handle,()=>showPerson(p)));if(morePeople)names.append(btn('Load more usernames',async()=>{try{await loadPeople(true);render();}catch(e){error(e);}}));dock.append(names,btn('View recent bans',async()=>{try{const list=await C.banList(),target=dock.querySelector('.rs-admin-person');target.replaceChildren($('strong',{text:'Last 100 ban records'}));for(const b of list)target.append(btn('@'+b.handle+' · '+(b.active?'Banned':'Unbanned'),()=>showPerson({uid:b.uid,handle:b.handle})));}catch(e){error(e);}}));
 }
 function fillAdminNames(names){names.replaceChildren();for(const p of people)names.append(btn('@'+p.handle,()=>showPerson(p)));if(morePeople)names.append(btn('Load more usernames',()=>loadPeople(true).catch(error)));}
 async function adminPeople(){await loadPeople(false);}
 async function showPerson(p){try{await endView();const ban=await C.banState(p.uid),target=dock.querySelector('.rs-admin-person');if(!target)return;target.replaceChildren($('strong',{text:'@'+p.handle}),$('small',{text:p.uid}),$('p',{text:ban?.active?'Banned · '+(ban.reason||'No reason provided'):'Not banned'}));const message=$('textarea',{maxlength:500,rows:2,'aria-label':'Message to username',placeholder:'Admin notice for @'+p.handle}),reason=$('input',{maxlength:300,'aria-label':'Ban reason',placeholder:'Ban reason (optional)'});target.append(message,btn('Send notice to @'+p.handle,()=>C.announce(message.value,60,p.uid).then(()=>error({message:'Private admin notice sent.'})).catch(error)),btn('Open DM',()=>openDM(p)),btn('View game',()=>viewPlayer(p)),reason);
   if(p.uid!==me.uid)target.append(btn(ban?.active?'Unban player':'Ban player',()=>{const box=$('div',{class:'rs-confirm'},[$('p',{text:(ban?.active?'Unban':'Ban')+' @'+p.handle+'?'}),btn('Cancel',()=>box.remove()),btn('Confirm',async()=>{try{await C.setBan(p.uid,p.handle,!ban?.active,reason.value);await showPerson(p);error({message:ban?.active?'Player unbanned.':'Player banned.'});}catch(e){error(e);box.remove();}},'danger')]);target.append(box);},ban?.active?'':'danger'));
  }catch(e){error(e);}}
 function viewingError(e){
  sharingBox.hidden=false;sharingBox.replaceChildren($('strong',{text:'Game viewing connection failed'}),$('p',{text:C.explain(e)}),btn('Retry connection',()=>refresh().catch(viewingError)),btn('Dismiss',()=>sharingBox.hidden=true));
 }
 function screenRequest(d){
  if(sharing&&(!d||d.id!==sharing.id||d.state!=='accepted'||milliseconds(d.expiresAt)<=Date.now()))stopSharing(false);
  if(!d||d.state!=='accepted'||milliseconds(d.expiresAt)<=Date.now()||sharing?.id===d.id)return;
  sharing=d;sharingBox.hidden=false;sharingBox.replaceChildren($('strong',{text:'@'+d.handle+' is currently viewing your Rombies game'}),$('p',{text:'Game preview updates every 5 seconds for up to 10 minutes.'}),btn('Stop sharing',()=>stopSharing(true)));
  // Display the viewing notice before the first frame is captured.
  setTimeout(captureGame,100);shareTimer=setInterval(captureGame,5000);
 }
 function stopSharing(remote){clearInterval(shareTimer);shareTimer=null;const old=sharing;sharing=null;sharingBox.hidden=true;if(remote&&old)C.respondGameScreen(old.id,'stopped').catch(()=>{});}
 async function captureGame(){
  if(!sharing||shareBusy||document.hidden)return;if(milliseconds(sharing.expiresAt)<=Date.now()){stopSharing(true);return;}shareBusy=true;const id=sharing.id;
  try{const expanded=A.root.classList.contains('active'),area=expanded?A.root:document.querySelector('#app'),canvas=expanded?(area.querySelector('.ex-cutscene-canvas')||area.querySelector('.ex-stage canvas')||area.querySelector('.ex-preview')):document.querySelector('#game');
   const out=document.createElement('canvas');out.width=640;out.height=360;const g=out.getContext('2d');g.fillStyle='#080c15';g.fillRect(0,0,640,360);let activity=expanded?(area.querySelector('.ex-playbar strong')?.textContent||area.querySelector('h1,h2')?.textContent||'Rombies sandbox'):'Chapter One';
   if(canvas&&canvas.getBoundingClientRect().width){const scale=Math.min(640/canvas.width,360/canvas.height);g.drawImage(canvas,(640-canvas.width*scale)/2,(360-canvas.height*scale)/2,canvas.width*scale,canvas.height*scale);}else{g.fillStyle='#fff';g.font='20px Arial';g.fillText(activity.slice(0,50),20,170);}
   const dialogue=area.querySelector('.ex-dialogue:not([hidden])');if(dialogue){g.fillStyle='#060b13';g.fillRect(0,260,640,100);g.fillStyle='#fff';g.font='16px Arial';const t=dialogue.querySelector('.ex-dialogue-body')?.textContent||'';for(let i=0;i<3;i++)g.fillText(t.slice(i*65,(i+1)*65),12,285+i*22);}
   let image=out.toDataURL('image/jpeg',.5);if(image.length>95000)image=out.toDataURL('image/jpeg',.25);if(image.length>100000)throw Error('Preview is too large.');if(sharing?.id===id)await C.sendGameFrame(id,image,activity);
  }catch(e){if(sharing?.id===id){stopSharing(true);sharingBox.hidden=false;sharingBox.replaceChildren($('p',{text:'Game sharing stopped: '+C.explain(e)}),btn('Dismiss',()=>sharingBox.hidden=true));}}finally{shareBusy=false;}
 }
 async function endView(){stop('game-view-request');stop('game-view-frame');const old=viewing;viewing=null;if(old)await C.stopGameView(old.uid,old.id).catch(()=>{});}
 async function viewPlayer(p){const viewError=e=>{const status=dock.querySelector('.rs-view-status');if(status)status.textContent='Viewing failed: '+C.explain(e);else error(e);};try{await endView();const id=await C.requestGameScreen(p.uid);viewing={uid:p.uid,id};const panel=dock.querySelector('.rs-admin-person');panel.replaceChildren($('h3',{text:'Game view · @'+p.handle}),$('p',{class:'rs-view-status',text:'Connecting to player’s game…'}),$('img',{class:'rs-game-view',hidden:true,alt:'Shared Rombies game view'}),btn('Stop viewing',async()=>{await endView();panel.replaceChildren($('p',{text:'Viewing ended.'}));}));
   await listen('game-view-request',C.watchGameRequest(p.uid,async d=>{if(viewing?.id!==id)return;const status=panel.querySelector('.rs-view-status');if(!d||d.id!==id||milliseconds(d.expiresAt)<=Date.now()||['declined','stopped'].includes(d.state)){status.textContent='Viewing ended.';panel.querySelector('img').hidden=true;await endView();return;}viewing.expiresAt=milliseconds(d.expiresAt);if(d.state==='accepted'){status.textContent='Viewing started · waiting for player’s game preview. They must have this update open.';await listen('game-view-frame',C.watchGameFrame(p.uid,f=>{if(viewing?.id!==id||f?.requestId!==id)return;const img=panel.querySelector('img');img.src=f.image;img.hidden=false;status.textContent=f.activity+' · '+new Date(milliseconds(f.updatedAt)).toLocaleTimeString();},viewError));}},viewError));
  }catch(e){viewError(e);}}
 setInterval(()=>{if(sharing&&milliseconds(sharing.expiresAt)<=Date.now())stopSharing(true);if(viewing?.expiresAt&&viewing.expiresAt<=Date.now()){endView();dock.querySelector('.rs-game-view')?.setAttribute('hidden','');}},1000);
 function welcome(){
  if(A.profile)return;const name=$('input',{maxlength:20,autocomplete:'username','aria-label':'Your username',required:true}),display=$('input',{maxlength:32,'aria-label':'Display name'}),note=$('p',{role:'status'}),submit=$('button',{type:'submit',text:'Enter Rombies'}),form=$('form',{class:'rs-welcome'},[$('h2',{text:'Choose your Rombies username'}),$('p',{text:'You only need to do this once on this browser. No email required. Admins can view your game with a visible notice and a Stop sharing button.'}),$('label',{},['Username (3–20 letters, numbers or underscores)',name]),$('label',{},['Display name (optional)',display]),note,submit]);layer.append(form);form.addEventListener('keydown',e=>e.stopPropagation());form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;note.textContent='Connecting your username…';try{const p=await C.getProfile()||await C.claim(name.value,display.value||name.value);A.connectProfile(p);form.remove();await refresh();}catch(err){note.textContent=C.explain(err);submit.disabled=false;}});name.focus();
 }
 let refreshScheduled=false;listen('refresh-command',C.watchPublic('refresh',d=>{if(!d||!milliseconds(d.createdAt)||milliseconds(d.expiresAt)<=Date.now()||refreshScheduled)return;try{if(sessionStorage.getItem('rombies_refresh_id')===d.id)return;sessionStorage.setItem('rombies_refresh_id',d.id);}catch(_){return;}refreshScheduled=true;try{if(A.draft)A.saveDraft(A.draft,{quiet:true});}catch(_){}const n=$('div',{class:'rs-banner',text:'An admin is refreshing Rombies in 5 seconds. Your local draft has been saved.'});alerts.append(n);setTimeout(()=>{const url=new URL(location.href);url.searchParams.set('rombiesUpdate',d.id);location.replace(url.href);},5000);},()=>{}));
 welcome();if(A.profile&&!A.profile.online){C.getProfile().then(p=>p||C.claim(A.profile.handle,A.profile.displayName)).then(p=>{A.connectProfile(p);refresh().catch(viewingError);}).catch(viewingError);}
 dock.addEventListener('keydown',e=>e.stopPropagation());dock.addEventListener('keyup',e=>e.stopPropagation());
 // Public announcements work for players without a creator account.
 listen('config',C.watchPublic('config',d=>{config=d||{chatEnabled:false};if(!config.chatEnabled){stop('messages');rows=[];}if(!closed){render();messages().catch(error);}},()=>{}));
 listen('announcement',C.watchPublic('announcement',d=>{announcement=d;banners();},()=>{}));
 if(A.profile?.online)refresh().catch(viewingError);
 window.RombiesSocial={open,openAdmin,refresh,attach};
})();
