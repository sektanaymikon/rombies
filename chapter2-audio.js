/* Small original procedural soundtrack: no downloaded music files. */
(() => {
 'use strict';
 let ctx,bus,timer,mode='quiet',step=0,paused=false,volume=.13;
 try{const n=localStorage.getItem('rombies_c2_volume');if(n!==null)volume=Math.max(0,Math.min(.4,Number(n)||0));}catch(_){}
 const tracks={quiet:{bpm:88,root:45,notes:[0,7,10,14,7,3,10,7]},culling:{bpm:132,root:38,notes:[0,0,7,10,0,3,12,7]},pyramid:{bpm:106,root:41,notes:[0,1,7,8,0,5,8,7]},chaos:{bpm:144,root:40,notes:[0,7,3,10,0,12,7,3]},finale:{bpm:126,root:43,notes:[0,7,12,10,3,7,14,12]}};
 function ensure(){if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;ctx=new Audio();bus=ctx.createGain();bus.gain.value=volume;bus.connect(ctx.destination);}ctx.resume().catch(()=>{});}
 function note(midi,duration,gain,type='triangle'){if(!ctx||paused||document.hidden||!window.ROMBIES_EXPANSION_ACTIVE||volume<=0)return;const at=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(gain,at+.012);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(bus);o.start(at);o.stop(at+duration+.03);o.onended=()=>{o.disconnect();g.disconnect();};}
 function tick(){const t=tracks[mode]||tracks.chaos;note(t.root+t.notes[step%8]+12,.25,.2);if(step%2===0)note(t.root+(step%16>=8?3:0),.4,.28,'sine');if(mode!=='quiet'&&step%4===0)note(28,.11,.45,'sine');step++;}
 const api=window.RombiesAudio={get volume(){return volume;},setVolume(v){volume=Math.max(0,Math.min(.4,Number(v)||0));try{localStorage.setItem('rombies_c2_volume',String(volume));}catch(_){}ensure();if(bus)bus.gain.setTargetAtTime(paused?0:volume,ctx.currentTime,.05);},play(value){ensure();const next=tracks[value]?value:'chaos';if(next===mode&&timer)return;clearInterval(timer);mode=next;step=0;timer=setInterval(tick,60000/tracks[mode].bpm/2);},pause(v){paused=v;if(bus)bus.gain.setTargetAtTime(v?0:volume,ctx.currentTime,.05);},stop(){clearInterval(timer);timer=null;api.pause(true);}};
})();
