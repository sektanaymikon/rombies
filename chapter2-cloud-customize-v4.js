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
  const data={ownerId:auth.currentUser.uid,ownerHandle:profile.handle,title:safe.title,description:safe.description,public:isPublic,config:JSON.stringify(safe),schemaVersion:1,updatedAt:F.serverTimestamp()};
  if(id)await F.updateDoc(ref,data);else await F.setDoc(ref,{...data,createdAt:F.serverTimestamp()});return ref.id;
 }
 async function remove(id){await identity();await F.deleteDoc(F.doc(db,'fights',id));}
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
 function explain(e){const c=e.code||'';if(c.includes('failed-precondition'))return 'Discover needs its database index. The setup guide includes the two required indexes.';if(c.includes('permission-denied'))return 'Firebase rejected this action. Check the deployed database rules and your username.';if(c.includes('network')||e instanceof TypeError)return 'The online service could not be reached. Local drafts and built-in fights still work.';if(c.includes('email-already'))return 'That email already belongs to an account. Use Sign in to recover it.';if(c.includes('invalid-credential'))return 'Email or password was not accepted.';return e.message||String(e);}
 window.RombiesCloud={init,identity,getProfile,claim,list,read,publish,remove,bookmark,bookmarks,upload,protect,signIn,resetPassword,explain,get user(){return auth?.currentUser;},get profile(){return profile;}};
})();
