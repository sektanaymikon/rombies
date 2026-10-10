(() => {
 'use strict';
 let loading,app,auth,db,A,F,profile;
 const config={apiKey:'AIzaSyCItSFqklQq5r1Eetdvfp3xzJUaWXMVXnI',authDomain:'rombies-86aa3.firebaseapp.com',projectId:'rombies-86aa3',storageBucket:'rombies-86aa3.firebasestorage.app',messagingSenderId:'638981730913',appId:'1:638981730913:web:05a1f0b37e098af1a5b020'};
 async function init(){
  if(!loading)loading=(async()=>{
   const base='https://www.gstatic.com/firebasejs/12.19.0/';
   const [core,a,f]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   A=a;F=f;app=core.initializeApp(config,'rombies-sandbox');auth=A.getAuth(app);db=F.getFirestore(app);await auth.authStateReady();
  })().catch(e=>{loading=null;throw e;});
  return loading;
 }
 async function identity(){await init();if(!auth.currentUser)await A.signInAnonymously(auth);return auth.currentUser;}
 async function getProfile(){await identity();const snap=await F.getDoc(F.doc(db,'users',auth.currentUser.uid));profile=snap.exists()?snap.data():null;return profile;}
 async function claim(handle,displayName){
  handle=handle.trim().toLowerCase();displayName=displayName.trim();
  if(!/^[a-z0-9_]{3,20}$/.test(handle))throw Error('Use 3–20 letters, numbers or underscores for your username.');
  if(!displayName||displayName.length>32)throw Error('Use a display name between 1 and 32 characters.');
  await identity();const uid=auth.currentUser.uid;
  const existing=await F.getDoc(F.doc(db,'usernames',handle));if(existing.exists())throw Error('That username is already taken. Try another.');
  const batch=F.writeBatch(db);batch.set(F.doc(db,'usernames',handle),{uid,createdAt:F.serverTimestamp()});
  batch.set(F.doc(db,'users',uid),{uid,handle,displayName,createdAt:F.serverTimestamp(),updatedAt:F.serverTimestamp()});await batch.commit();
  return getProfile();
 }
 async function list(type='public',cursor=null){
  await init();const mine=type==='mine';if(mine)await identity();
  const constraints=[F.where(mine?'ownerId':'public','==',mine?auth.currentUser.uid:true),F.orderBy('updatedAt','desc'),F.limit(24)];
  if(cursor)constraints.push(F.startAfter(cursor));
  const snap=await F.getDocs(F.query(F.collection(db,'fights'),...constraints));
  return {items:snap.docs.map(d=>({id:d.id,...d.data()})),cursor:snap.docs.at(-1)||null,more:snap.size===24};
 }
 async function read(id){if(!/^[A-Za-z0-9_-]{1,100}$/.test(id))throw Error('Invalid fight link.');await init();const d=await F.getDoc(F.doc(db,'fights',id));if(!d.exists())throw Error('That fight is no longer available.');return {id:d.id,...d.data()};}
 async function publish(raw,id=null,isPublic=true){
  const safe=RombiesSchema.fight(raw,{public:true});await identity();profile=profile||await getProfile();if(!profile)throw Error('Create your username first.');
  const ref=id?F.doc(db,'fights',id):F.doc(F.collection(db,'fights'));
  if(isPublic===null){if(!id)throw Error('Publish this fight first.');const existing=await F.getDoc(ref);if(!existing.exists())throw Error('This online fight no longer exists. Publish it again.');if(existing.data().ownerId!==auth.currentUser.uid)throw Error('Only the creator can update this fight.');isPublic=existing.data().public===true;}
  const data={ownerId:auth.currentUser.uid,ownerHandle:profile.handle,title:safe.title,description:safe.description,public:isPublic,config:JSON.stringify(safe),schemaVersion:1,updatedAt:F.serverTimestamp()};
  if(id)await F.updateDoc(ref,data);else await F.setDoc(ref,{...data,createdAt:F.serverTimestamp()});return ref.id;
 }
 async function remove(id){if(!/^[A-Za-z0-9_-]{1,100}$/.test(id))throw Error('Invalid fight ID.');await identity();const ref=F.doc(db,'fights',id),snap=await F.getDoc(ref);if(!snap.exists())return;const fight=snap.data();if(fight.ownerId!==auth.currentUser.uid)throw Error('Only the creator can delete this fight.');if(fight.public!==false)throw Error('Unpublish this fight before deleting it.');await F.deleteDoc(ref);}
 async function bookmark(id,remove=false){await identity();const ref=F.doc(db,'users',auth.currentUser.uid,'bookmarks',id);if(remove)await F.deleteDoc(ref);else if(!(await F.getDoc(ref)).exists())await F.setDoc(ref,{createdAt:F.serverTimestamp()});}
 async function bookmarks(){await identity();const snap=await F.getDocs(F.query(F.collection(db,'users',auth.currentUser.uid,'bookmarks'),F.limit(24)));const results=await Promise.allSettled(snap.docs.map(d=>read(d.id)));return results.filter(r=>r.status==='fulfilled').map(r=>r.value);}
 async function upload(blob,kind){
  if(blob.size>(kind==='music'?8388608:2097152))throw Error(kind==='music'?'Music must be under 8 MiB.':'Image must be under 2 MB after compression.');await identity();
  const token=await auth.currentUser.getIdToken();const res=await fetch(RombiesSchema.UPLOAD_ORIGIN+'/upload?kind='+encodeURIComponent(kind),{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':blob.type},body:blob,signal:AbortSignal.timeout(kind==='music'?60000:30000)});
  const data=await res.json();if(!res.ok)throw Error(data.error||'Upload failed. Try again.');if(!(kind==='music'?RombiesSchema.validMusic(data.url):RombiesSchema.validAsset(data.url)))throw Error('The upload service returned an invalid file URL.');return data.url;
 }
 async function protect(email,password){await identity();await A.linkWithCredential(auth.currentUser,A.EmailAuthProvider.credential(email,password));}
 async function signIn(email,password){await init();await A.signInWithEmailAndPassword(auth,email,password);profile=null;return getProfile();}
 async function resetPassword(email){await init();await A.sendPasswordResetEmail(auth,email);}
 const uidOK=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,128}$/.test(v);
 const text=(v,max)=>{v=String(v||'').trim();if(!v||v.length>max)throw Error('Use 1–'+max+' characters.');return v;};
 async function session(){const p=await getProfile(),uid=auth.currentUser.uid;const [admin,ban]=await Promise.all([F.getDoc(F.doc(db,'adminSessions',uid)),F.getDoc(F.doc(db,'bans',uid))]);return {uid,profile:p,admin:admin.exists()&&(admin.data().expiresAt?.toMillis?.()||0)>Date.now(),ban:ban.exists()?ban.data():null};}
 async function unlockAdmin(password,handle='',display='Admin'){if(password!=='0219')throw Error('Incorrect password.');await identity();if(!await getProfile()){const fallback='admin_'+auth.currentUser.uid.toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,12);try{await claim(/^[a-z0-9_]{3,20}$/i.test(handle)?handle:fallback,String(display||'Admin').slice(0,32));}catch(e){if(e.message==='That username is already taken. Try another.')await claim(fallback,String(display||'Admin').slice(0,32));else throw e;}}await F.setDoc(F.doc(db,'adminSessions',auth.currentUser.uid),{password,createdAt:F.serverTimestamp(),expiresAt:F.Timestamp.fromMillis(Date.now()+3600000)});return session();}
 async function lockAdmin(){await identity();await F.deleteDoc(F.doc(db,'adminSessions',auth.currentUser.uid));}
 async function lookup(handle){handle=String(handle||'').trim().toLowerCase().replace(/^@/,'');if(!/^[a-z0-9_]{3,20}$/.test(handle))throw Error('Enter a username with 3–20 letters, numbers or underscores.');await identity();const d=await F.getDoc(F.doc(db,'usernames',handle));if(!d.exists())throw Error('Username not found.');const p=await F.getDoc(F.doc(db,'users',d.data().uid));if(!p.exists())throw Error('This username has no profile.');return p.data();}
 async function directory(cursor=null){await identity();const q=[F.orderBy('handle'),F.limit(100)];if(cursor)q.push(F.startAfter(cursor));const s=await F.getDocs(F.query(F.collection(db,'users'),...q));return{items:s.docs.map(d=>d.data()),cursor:s.docs.at(-1),more:s.size===100};}
 async function watchPublic(kind,cb,error){await init();return F.onSnapshot(F.doc(db,'social',kind),s=>cb(s.exists()?s.data():null),error);}
 async function watchSelf(kind,cb,error){await identity();return F.onSnapshot(F.doc(db,kind,auth.currentUser.uid),s=>cb(s.exists()?s.data():null),error);}
 async function watchThreads(cb,error){await identity();return F.onSnapshot(F.query(F.collection(db,'threads'),F.where('members','array-contains',auth.currentUser.uid),F.limit(30)),s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))),error);}
 async function person(uid){await identity();if(!uidOK(uid))throw Error('Invalid account.');const p=await F.getDoc(F.doc(db,'users',uid));if(!p.exists())throw Error('Username no longer exists.');return p.data();}
 async function threadFor(other){await identity();if(!uidOK(other)||other===auth.currentUser.uid)throw Error('Choose another username.');const members=[auth.currentUser.uid,other].sort(),id=members.join('~'),ref=F.doc(db,'threads',id);await F.runTransaction(db,async t=>{const s=await t.get(ref);if(!s.exists())t.set(ref,{members,createdAt:F.serverTimestamp()});});return {id,members};}
 async function watchMessages(room,cb,error){await identity();const col=room==='global'?F.collection(db,'globalMessages'):F.collection(db,'threads',room,'messages');return F.onSnapshot(F.query(col,F.orderBy('createdAt','desc'),F.limit(50)),s=>cb(s.docs.map(d=>({id:d.id,...d.data()})).reverse()),error);}
 async function sendMessage(room,body,members){body=text(body,1000);await identity();const p=await getProfile();if(!p)throw Error('Connect an online username first.');const uid=auth.currentUser.uid,rate=F.doc(db,'chatRates',uid),msg=F.doc(room==='global'?F.collection(db,'globalMessages'):F.collection(db,'threads',room,'messages')),thread=room==='global'?null:F.doc(db,'threads',room);
  if(thread&&(!Array.isArray(members)||members.length!==2||!members.includes(uid)||!members.every(uidOK)||[...members].sort().join('~')!==room))throw Error('Invalid conversation.');
  await F.runTransaction(db,async t=>{const r=await t.get(rate),existing=thread?await t.get(thread):null;if(r.exists()&&Date.now()-(r.data().sentAt?.toMillis?.()||0)<2000)throw Error('Wait two seconds between messages.');t.set(rate,{sentAt:F.serverTimestamp(),messagePath:msg.path});if(thread&&!existing.exists())t.set(thread,{members,createdAt:F.serverTimestamp()});t.set(msg,{senderId:uid,handle:p.handle,body,createdAt:F.serverTimestamp()});});return msg.id;
 }
 async function setChat(enabled){await identity();await F.setDoc(F.doc(db,'social','config'),{chatEnabled:!!enabled,by:auth.currentUser.uid,updatedAt:F.serverTimestamp()});}
 async function announce(body,seconds=30,recipient=null){await identity();const p=await getProfile();if(!p)throw Error('Connect your username first.');seconds=Math.max(5,Math.min(3600,Number(seconds)||30));const data={body:text(body,500),by:auth.currentUser.uid,handle:p.handle,createdAt:F.serverTimestamp(),expiresAt:F.Timestamp.fromMillis(Date.now()+seconds*1000)};if(recipient&&!uidOK(recipient))throw Error('Invalid recipient.');await F.setDoc(recipient?F.doc(db,'notices',recipient):F.doc(db,'social','announcement'),data);}
 async function clearAnnouncement(){await identity();await F.deleteDoc(F.doc(db,'social','announcement'));}
 async function setBan(uid,handle,active,reason=''){await identity();if(!uidOK(uid)||uid===auth.currentUser.uid)throw Error('Choose another account.');await F.setDoc(F.doc(db,'bans',uid),{active:!!active,handle:text(handle,20),reason:String(reason||'').trim().slice(0,300),by:auth.currentUser.uid,updatedAt:F.serverTimestamp()});}
 async function banState(uid){await identity();if(!uidOK(uid))throw Error('Invalid account.');const s=await F.getDoc(F.doc(db,'bans',uid));return s.exists()?s.data():null;}
 async function banList(){await identity();const s=await F.getDocs(F.query(F.collection(db,'bans'),F.orderBy('updatedAt','desc'),F.limit(100)));return s.docs.map(d=>({uid:d.id,...d.data()}));}
 function explain(e){const c=e.code||'';if(c.includes('failed-precondition'))return 'The online database needs an index. See the setup guide.';if(c.includes('permission-denied'))return 'Online access was denied. Your account may be banned, chat may be disabled, or the new Firebase rules need deployment.';if(c.includes('network')||e instanceof TypeError)return 'The online service could not be reached. Local drafts and built-in fights still work.';if(c.includes('email-already'))return 'That email already belongs to an account. Use Sign in to recover it.';if(c.includes('invalid-credential'))return 'Email or password was not accepted.';return e.message||String(e);}
 async function forceRefresh(){await identity();const p=await getProfile();if(!p)throw Error('Connect your username first.');await F.setDoc(F.doc(db,'social','refresh'),{id:crypto.randomUUID(),by:auth.currentUser.uid,handle:p.handle,createdAt:F.serverTimestamp(),expiresAt:F.Timestamp.fromMillis(Date.now()+300000)});}
 async function requestGameScreen(uid){if(!uidOK(uid))throw Error('Invalid username.');await identity();const p=await getProfile();const id=crypto.randomUUID();await F.setDoc(F.doc(db,'screenRequests',uid),{id,by:auth.currentUser.uid,handle:p.handle,state:'accepted',createdAt:F.serverTimestamp(),expiresAt:F.Timestamp.fromMillis(Date.now()+600000)});return id;}
 async function watchGameRequest(uid,cb,error){await identity();return F.onSnapshot(F.doc(db,'screenRequests',uid),s=>cb(s.exists()?s.data():null),error);}
 async function watchGameFrame(uid,cb,error){await identity();return F.onSnapshot(F.doc(db,'screenFrames',uid),s=>cb(s.exists()?s.data():null),error);}
 async function respondGameScreen(id,state){await identity();if(state==='accepted')await F.deleteDoc(F.doc(db,'screenFrames',auth.currentUser.uid));const ref=F.doc(db,'screenRequests',auth.currentUser.uid);await F.runTransaction(db,async t=>{const s=await t.get(ref);if(!s.exists()||s.data().id!==id)throw Error('This viewing request has ended.');t.update(ref,{state});});if(state!=='accepted')await F.deleteDoc(F.doc(db,'screenFrames',auth.currentUser.uid));}
 async function stopGameView(uid,id){await identity();const ref=F.doc(db,'screenRequests',uid);await F.runTransaction(db,async t=>{const s=await t.get(ref);if(s.exists()&&s.data().id===id)t.update(ref,{state:'stopped'});});}
 async function sendGameFrame(id,image,activity){await identity();await F.setDoc(F.doc(db,'screenFrames',auth.currentUser.uid),{requestId:id,image,activity:String(activity).slice(0,100),updatedAt:F.serverTimestamp()});}
 window.RombiesCloud={forceRefresh,requestGameScreen,watchGameRequest,watchGameFrame,respondGameScreen,stopGameView,sendGameFrame,init,identity,getProfile,claim,list,read,publish,remove,bookmark,bookmarks,upload,protect,signIn,resetPassword,session,unlockAdmin,lockAdmin,lookup,person,directory,watchPublic,watchSelf,watchThreads,threadFor,watchMessages,sendMessage,setChat,announce,clearAnnouncement,setBan,banState,banList,explain,get user(){return auth?.currentUser;},get profile(){return profile;}};
})();
