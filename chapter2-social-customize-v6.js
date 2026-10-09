/* Live community chat, private conversations and console-granted admin tools. */
(() => {
 'use strict';
 const C=RombiesCloud,A=RombiesApp,$=A.$,btn=A.button;
 const layer=$('div',{id:'rombies-social'}),alerts=$('div',{class:'rs-alerts','aria-live':'polite'}),toggle=btn('Chat',open,'rs-toggle'),dock=$('section',{class:'rs-dock',hidden:true,'aria-label':'Rombies chat'});
 layer.append(alerts,toggle,dock);document.body.append(layer);
 let me=null,config={chatEnabled:false},announcement=null,notice=null,mode='global',room='global',members=null,currentHandle='',closed=true,rows=[],people=[],peopleCursor=null,morePeople=false,threads=[],pending=false,viewVersion=0,adminUnlocked=false;
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
  await listen('ban',C.watchSelf('bans',b=>{me.ban=b;if(b?.active){stop('messages');stop('threads');rows=[];}if(!closed)render();},error));
  await listen('notice',C.watchSelf('notices',d=>{notice=d;banners();},error));
  if(me.profile&&!me.ban?.active)await listen('threads',C.watchThreads(d=>{threads=d;const list=dock.querySelector('.rs-people');if(!closed&&mode==='people'&&list)fillPeople(list);},error));
  toggle.textContent=me.admin?'Chat / Admin':'Chat';return me;
 }
 async function open(){closed=false;dock.hidden=false;dock.replaceChildren($('p',{text:'Connecting…'}));try{await refresh();render();if(me.profile&&!me.ban?.active&&config.chatEnabled)await messages();}catch(e){render();error(e);}}
 function close(){closed=true;dock.hidden=true;if(adminUnlocked)C.lockAdmin().catch(()=>{});adminUnlocked=false;if(me)me.admin=false;mode='global';toggle.textContent='Chat';stop('messages');viewVersion++;}
 function openAdmin(){closed=false;dock.hidden=false;mode='admin';adminUnlocked=false;stop('messages');viewVersion++;render();}
 function passwordPanel(){const input=$('input',{type:'password',inputmode:'numeric',maxlength:4,'aria-label':'Admin password',autocomplete:'off'}),note=$('p',{class:'rs-status',role:'status'}),unlock=$('button',{type:'submit',text:'Unlock admin panel'}),form=$('form',{},[$('h3',{text:'Admin panel'}),$('label',{},['Password',input]),note,unlock]);form.addEventListener('submit',async e=>{e.preventDefault();if(input.value!=='0219'){note.textContent='Incorrect password.';return;}unlock.disabled=true;note.textContent='Unlocking…';try{await C.unlockAdmin(input.value,A.profile?.handle,A.profile?.displayName);adminUnlocked=true;await refresh();A.connectProfile?.(me.profile);render();if(me.admin)await adminPeople();}catch(e){note.textContent=C.explain(e);unlock.disabled=false;}});dock.append(form);input.focus();}
 function heading(){const nav=$('div',{class:'rs-head'},[$('strong',{text:'ROMBIES COMMUNITY'}),btn('Refresh',async()=>{try{await refresh();render();await messages();}catch(e){error(e);}}),btn('Close',close)]),tabs=$('nav',{class:'rs-tabs'});for(const [id,label]of [['global','# global'],['people','People / DMs'],...(me?.admin?[['admin','Admin']]:[])])tabs.append(btn(label,()=>selectMode(id),mode===id?'primary':''));return[nav,tabs];}
 async function selectMode(id){if(id==='admin'&&!adminUnlocked){openAdmin();return;}mode=id;viewVersion++;stop('messages');rows=[];if(id==='global'){room='global';members=null;}render();try{if(id==='people')await loadPeople(false);if(id==='global')await messages();if(id==='admin'&&me?.admin)await adminPeople();}catch(e){error(e);}}
 function render(){
  dock.replaceChildren(...heading());
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
  dock.append($('h3',{text:'Admin panel'}),$('p',{class:'rs-muted',text:'Signed in as @'+me.profile.handle}),btn(config.chatEnabled?'Disable chat and DMs':'Enable chat and DMs',async()=>{try{await C.setChat(!config.chatEnabled);}catch(e){error(e);}}));
  const body=$('textarea',{maxlength:500,placeholder:'Top-center announcement','aria-label':'Announcement',rows:3}),duration=$('input',{type:'number',min:5,max:3600,value:30,'aria-label':'Announcement duration seconds'});dock.append($('label',{},['Announcement duration (seconds)',duration]),body,$('div',{class:'rs-actions'},[btn('Send globally',()=>C.announce(body.value,Number(duration.value)).then(()=>error({message:'Announcement sent.'})).catch(error),'primary'),btn('Clear announcement',()=>C.clearAnnouncement().catch(error))]));
  dock.append($('h3',{text:'Find a player'}),finder(p=>showPerson(p)), $('div',{class:'rs-admin-person'}),$('h3',{text:'All registered usernames'}));const names=$('div',{class:'rs-people'});for(const p of people)names.append(btn('@'+p.handle,()=>showPerson(p)));if(morePeople)names.append(btn('Load more usernames',async()=>{try{await loadPeople(true);render();}catch(e){error(e);}}));dock.append(names,btn('View recent bans',async()=>{try{const list=await C.banList(),target=dock.querySelector('.rs-admin-person');target.replaceChildren($('strong',{text:'Last 100 ban records'}));for(const b of list)target.append(btn('@'+b.handle+' · '+(b.active?'Banned':'Unbanned'),()=>showPerson({uid:b.uid,handle:b.handle})));}catch(e){error(e);}}));
 }
 function fillAdminNames(names){names.replaceChildren();for(const p of people)names.append(btn('@'+p.handle,()=>showPerson(p)));if(morePeople)names.append(btn('Load more usernames',()=>loadPeople(true).catch(error)));}
 async function adminPeople(){await loadPeople(false);}
 async function showPerson(p){try{const ban=await C.banState(p.uid),target=dock.querySelector('.rs-admin-person');if(!target)return;target.replaceChildren($('strong',{text:'@'+p.handle}),$('small',{text:p.uid}),$('p',{text:ban?.active?'Banned · '+(ban.reason||'No reason provided'):'Not banned'}));const message=$('textarea',{maxlength:500,rows:2,'aria-label':'Message to username',placeholder:'Admin notice for @'+p.handle}),reason=$('input',{maxlength:300,'aria-label':'Ban reason',placeholder:'Ban reason (optional)'});target.append(message,btn('Send notice to @'+p.handle,()=>C.announce(message.value,60,p.uid).then(()=>error({message:'Private admin notice sent.'})).catch(error)),btn('Open DM',()=>openDM(p)),reason);
   if(p.uid!==me.uid)target.append(btn(ban?.active?'Unban player':'Ban player',()=>{const box=$('div',{class:'rs-confirm'},[$('p',{text:(ban?.active?'Unban':'Ban')+' @'+p.handle+'?'}),btn('Cancel',()=>box.remove()),btn('Confirm',async()=>{try{await C.setBan(p.uid,p.handle,!ban?.active,reason.value);await showPerson(p);error({message:ban?.active?'Player unbanned.':'Player banned.'});}catch(e){error(e);box.remove();}},'danger')]);target.append(box);},ban?.active?'':'danger'));
  }catch(e){error(e);}}
 dock.addEventListener('keydown',e=>e.stopPropagation());dock.addEventListener('keyup',e=>e.stopPropagation());
 // Public announcements work for players without a creator account.
 listen('config',C.watchPublic('config',d=>{config=d||{chatEnabled:false};if(!config.chatEnabled){stop('messages');rows=[];}if(!closed){render();messages().catch(error);}},()=>{}));
 listen('announcement',C.watchPublic('announcement',d=>{announcement=d;banners();},()=>{}));
 try{if(JSON.parse(localStorage.getItem('rombies_sandbox_profile'))?.online)refresh().catch(()=>{});}catch(_){}
 window.RombiesSocial={open,openAdmin,refresh,attach};
})();
