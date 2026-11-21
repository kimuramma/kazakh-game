/* Shared fruit puppet. createRig(container, base) -> {mood(name), walk(on), hold(on), talk(ms), wave(ms)} */
(function(){
  const css=`
.rig{position:relative;width:100%;aspect-ratio:600/760}
.rig .p{position:absolute;display:block;pointer-events:none}
.rig .r{position:absolute;inset:0;transform-origin:50% 92%}
.rig .bd{left:13%;top:6%;width:74.5%;z-index:3;transform-origin:50% 100%}
.rig .aL{left:5%;top:37%;width:18.8%;z-index:2;transform-origin:62% 6%;transition:transform .35s cubic-bezier(.3,1.4,.5,1)}
.rig .aR{left:76%;top:37%;width:18.5%;z-index:2;transform-origin:38% 6%;transition:transform .35s cubic-bezier(.3,1.4,.5,1)}
.rig .lL{left:31%;top:58%;width:23.7%;z-index:1;transform-origin:50% 4%}
.rig .lR{left:46%;top:58%;width:24.2%;z-index:1;transform-origin:50% 4%}
.rig .fc{position:absolute;left:13%;top:6%;width:74.5%;aspect-ratio:447/457;z-index:4;transform-origin:50% 60%}
.rig .eye{top:34%;width:30%} .rig .eL{left:15%} .rig .eR{left:55%}
.rig .brw{top:24%;width:26%} .rig .bL{left:18%} .rig .bR{left:56%}
.rig .mo{left:50%;top:60%;translate:-50% 0;width:34%}
.rig .itm{left:50%;top:50%;width:40%;translate:-50% 0;z-index:5;display:none}
.rig.holding .itm{display:block}
.rig.holding .aL,.rig.holding .aR{z-index:6}
.rig .r.idle .bd,.rig .r.idle .fc{animation:rgBreathe 2.6s ease-in-out infinite}
.rig .r.idle{animation:rgSway 4s ease-in-out infinite}
@keyframes rgBreathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.015,.985)}}
@keyframes rgSway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
.rig .r.hop{animation:rgHop .55s cubic-bezier(.3,.8,.4,1) 2}
@keyframes rgHop{0%{transform:none}15%{transform:scale(1.08,.9)}50%{transform:translateY(-16%) scale(.96,1.05)}85%{transform:scale(1.06,.93)}100%{transform:none}}
.rig .r.walk{animation:rgBob .4s ease-in-out infinite}
@keyframes rgBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-2.5%) rotate(2deg)}}
.rig .r.walk .lL{animation:rgStepL .4s ease-in-out infinite} .rig .r.walk .lR{animation:rgStepR .4s ease-in-out infinite}
@keyframes rgStepL{0%,100%{transform:rotate(16deg)}50%{transform:rotate(-16deg)}}
@keyframes rgStepR{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}}
.rig .r.walk .aL{animation:rgSwL .4s ease-in-out infinite} .rig .r.walk .aR{animation:rgSwR .4s ease-in-out infinite}
@keyframes rgSwL{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(14deg)}}
@keyframes rgSwR{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-18deg)}}
.rig .r.sad{transform:translateY(2%) scale(1,.96)}
.rig .r.shake{animation:rgShake .12s linear 7}
@keyframes rgShake{0%,100%{transform:translateX(0)}50%{transform:translateX(2%) rotate(1.5deg)}}
.rig .aR.wave{animation:rgWave .5s ease-in-out infinite;transition:none}
@keyframes rgWave{0%,100%{transform:rotate(-150deg)}50%{transform:rotate(-115deg)}}
.rig .fc.look{animation:rgLook 1.6s ease-in-out}
@keyframes rgLook{0%,100%{transform:none}30%{transform:translateX(-4%)}70%{transform:translateX(4%)}}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  window.createRig=function(el,P,itemSrc){
    el.classList.add('rig');
    el.innerHTML=`<div class="r idle"><img class="p lL" src="${P}legL.png"><img class="p lR" src="${P}legR.png"><img class="p aL" src="${P}armL.png"><img class="p aR" src="${P}armR.png">
      <img class="p bd" src="${P}body.png"><div class="fc"><img class="p eye eL"><img class="p eye eR"><img class="p brw bL"><img class="p brw bR"><img class="p mo"></div>
      <img class="p itm" src="${itemSrc||''}"></div>`;
    const q=s=>el.querySelector(s), r=q('.r');
    const f={eyes:'open',brows:'',mouth:'m_smile'};
    function face(e,b,m){ if(e!=null)f.eyes=e; if(b!=null)f.brows=b; if(m!=null)f.mouth=m;
      q('.eL').src=P+'eyeL_'+f.eyes+'.png'; q('.eR').src=P+'eyeR_'+f.eyes+'.png';
      q('.bL').src=P+'browL'+(f.brows?'_'+f.brows:'')+'.png'; q('.bR').src=P+'browR'+(f.brows?'_'+f.brows:'')+'.png';
      q('.mo').src=P+f.mouth+'.png';
      const h={open:34,wide:33.5,closed:39,happy:38}; el.querySelectorAll('.eye').forEach(x=>x.style.top=h[f.eyes]+'%');
      q('.mo').style.width={m_smile:'34%',m_laugh:'34%',m_o:'13%',m_sad:'28%',m_talk:'23%'}[f.mouth]; }
    function arms(l,r2){ q('.aL').style.transform='rotate('+l+'deg)'; q('.aR').style.transform='rotate('+r2+'deg)'; }
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    let tok=0, talkT=null, holding=false;
    (async()=>{ for(;;){ await wait(2500+Math.random()*2500); if(f.eyes==='open'||f.eyes==='wide'){ const k=f.eyes; face('closed'); await wait(130); if(f.eyes==='closed') face(k); } } })();
    function base(){ clearInterval(talkT); r.className='r idle'; q('.aR').classList.remove('wave'); q('.fc').classList.remove('look');
      el.classList.toggle('holding',holding); arms(holding?-44:0,holding?44:0); face('open','',holding?'m_laugh':'m_smile'); if(holding) face('happy'); }
    face('open','','m_smile');
    const api={
      async mood(name){ const t=++tok; base();
        if(name==='happy'){ face('happy','','m_laugh'); if(!holding) arms(150,-150); r.className='r hop'; await wait(1150); if(t!==tok) return; r.className='r idle'; if(!holding) arms(20,-20); await wait(500); }
        else if(name==='oops'){ face('wide','sad','m_o'); if(!holding) arms(60,-60); r.className='r hop'; await wait(560); if(t!==tok) return; r.className='r idle'; await wait(900); }
        else if(name==='sad'){ face('open','sad','m_sad'); arms(-8,8); r.className='r sad'; return; }
        else if(name==='hungry'){ face('closed','sad','m_o'); el.classList.add('holding'); q('.itm').style.display='none'; arms(-30,30); r.className='r shake'; await wait(900); if(t!==tok) return;
          r.className='r sad'; face('open','sad','m_sad'); return; }
        if(t===tok){ q('.itm').style.display=''; base(); } },
      async talk(ms){ const t=++tok; base(); let i=0; q('.fc').classList.add('look');
        talkT=setInterval(()=>{ i++; face(null,null,['m_talk','m_smile','m_o','m_talk','m_laugh'][i%5]); },140); await wait(ms||1500); if(t===tok){ q('.itm').style.display=''; base(); } },
      async wave(ms){ const t=++tok; base(); face('happy'); q('.aR').classList.add('wave'); await wait(ms||1800); if(t===tok) base(); },
      walk(on){ ++tok; q('.itm').style.display=''; base(); if(on) r.className='r walk'; },
      hold(on){ holding=on; ++tok; q('.itm').style.display=''; base(); },
      reset(){ ++tok; holding=false; q('.itm').style.display=''; base(); }
    };
    return api;
  };
})();
