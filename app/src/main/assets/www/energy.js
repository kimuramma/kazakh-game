/* Energy: 25 max, each task costs 2 (~2 lessons), full refill in 24h, ad +12. Shown only as a number. */
(function(){
  const MAX=25, COST=2, AD=12, REFILL_MS=24*3600*1000, PER=REFILL_MS/MAX;
  const st=document.createElement('style'); st.textContent=`
.en{display:flex;align-items:center;gap:1cqw;background:linear-gradient(#fff6e2,#f3dfb6);border:0.6cqw solid #8a5a2e;border-radius:3cqw;padding:0.8cqw 2.4cqw 0.8cqw 1.4cqw;
  font-weight:900;font-size:3.8cqw;color:#1667b8;box-shadow:0 0.8cqw 0 #5a3417;font-family:inherit;cursor:pointer}
.en svg{width:5.4cqw;height:5.4cqw;flex:0 0 auto}
.en.tick{animation:entick .5s}
@keyframes entick{30%{transform:scale(1.18)}}
.enBox{position:absolute;inset:0;z-index:90;background:rgba(40,20,5,.55);display:none;align-items:center;justify-content:center}
.enBox.on{display:flex}
.enBox .card{width:80%;background:linear-gradient(#fff6e2,#f3dfb6);border:1cqw solid #8a5a2e;border-radius:5cqw;padding:5cqw 4.5cqw;text-align:center;box-shadow:0 1.6cqw 0 #5a3417;animation:enpop .3s cubic-bezier(.3,1.6,.5,1)}
@keyframes enpop{from{transform:scale(.6);opacity:0}}
.enBox h3{margin:0 0 1.6cqw;font-size:5.6cqw;color:#1667b8}
.enBox p{margin:0 0 3cqw;font-size:3.7cqw;font-weight:800;color:#8a5a2e}
.enBox .b{display:block;width:100%;min-height:11cqw;margin-top:2.4cqw;border-radius:3cqw;font-family:inherit;font-size:4.2cqw;font-weight:900;color:#3d220d;cursor:pointer;
  background:linear-gradient(#ffe066,#ffb92e);border:0.6cqw solid #b97a12;box-shadow:0 1cqw 0 #8a5a0c}
.enBox .b.alt{background:linear-gradient(#e9f7ff,#bfe6ff);border-color:#3a8fd0;box-shadow:0 1cqw 0 #1d5f96}
.enBox .x{margin-top:3cqw;font-size:3.4cqw;font-weight:800;color:#8a5a2e;text-decoration:underline;cursor:pointer}
.enAd{position:absolute;inset:0;z-index:95;background:#111;color:#fff;display:none;flex-direction:column;align-items:center;justify-content:center;gap:3cqw;font-weight:900}
.enAd.on{display:flex} .enAd b{font-size:6cqw} .enAd span{font-size:4cqw;color:#aaa}`;
  document.head.appendChild(st);
  const DROP='<svg viewBox="0 0 24 24"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fdcff"/><stop offset="1" stop-color="#1478dc"/></linearGradient></defs><path d="M12 2C9 7 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-4-8-7-13z" fill="url(#dg)" stroke="#0d4f94" stroke-width="1.3"/><ellipse cx="9.3" cy="14" rx="1.6" ry="2.8" fill="#fff" opacity=".75"/></svg>';
  function load(){ let v=MAX,t=Date.now(),sub=false; try{ const e=JSON.parse(localStorage.getItem('almaEnergy')||'null'); if(e){v=e.v;t=e.t;} sub=localStorage.getItem('almaSub')==='1'; }catch(e){}
    if(v<MAX){ const g=Math.floor((Date.now()-t)/PER); if(g>0){ v=Math.min(MAX,v+g); t+=g*PER; } } else t=Date.now(); return {v,t,sub}; }
  function save(s){ try{ localStorage.setItem('almaEnergy',JSON.stringify({v:s.v,t:s.t})); }catch(e){} }
  const E={ MAX, COST, els:[] };
  E.get=()=>{ const s=load(); save(s); return s; };
  E.draw=()=>{ const s=E.get(); E.els.forEach(el=>{ el.querySelector('b').textContent=s.sub?'∞':s.v; }); };
  E.mount=(parent,cls)=>{ const b=document.createElement('button'); b.className='en '+(cls||''); b.innerHTML=DROP+'<b></b>';
    b.onclick=()=>{ const s=E.get(); const msg= s.sub?'Подписка: энергия без ограничений': s.v>=MAX?'Энергия полная 💧': 'Энергия восполняется сама: +1 примерно каждый час'; (window.toast||alert)(msg); };
    parent.appendChild(b); E.els.push(b); E.draw(); setInterval(E.draw,60000); return b; };
  E.has=()=>{ const s=E.get(); return s.sub||s.v>=COST; };
  E.spend=()=>{ const s=E.get(); if(s.sub) return true; if(s.v<COST) return false; if(s.v>=MAX) s.t=Date.now(); s.v-=COST; save(s); E.draw(); E.els.forEach(el=>{el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}); return true; };
  E.add=n=>{ const s=E.get(); s.v=Math.min(MAX,s.v+n); save(s); E.draw(); };
  E.reset=()=>{ save({v:MAX,t:Date.now()}); E.draw(); };
  // out-of-energy dialog; resolves true if refilled (ad), false if user leaves
  E.ask=(parent,leaveText)=>new Promise(res=>{
    let box=parent.querySelector('.enBox'); if(!box){ box=document.createElement('div'); box.className='enBox'; parent.appendChild(box);
      const ad=document.createElement('div'); ad.className='enAd'; ad.innerHTML='<b>Здесь будет реклама</b><span></span>'; parent.appendChild(ad); }
    const ad=parent.querySelector('.enAd');
    box.innerHTML=`<div class="card"><h3>💧 Алма хочет пить!</h3><p>Энергия закончилась. Она восполнится сама, а можно продолжить прямо сейчас.</p>
      <button class="b" data-a="ad">📺 Посмотреть рекламу</button><button class="b alt" data-a="sub">⭐ Подписка — без ограничений</button><div class="x" data-a="no">${leaveText||'Подожду'}</div></div>`;
    box.classList.add('on');
    box.onclick=async e=>{ const a=e.target.dataset.a; if(!a) return;
      if(a==='sub'){ (window.toast||alert)('Подписка появится в настоящей игре ⭐'); return; }
      box.classList.remove('on');
      if(a==='no'){ res(false); return; }
      ad.classList.add('on'); for(let i=5;i>0;i--){ ad.querySelector('span').textContent='Осталось '+i+' сек'; await new Promise(r=>setTimeout(r,1000)); }
      ad.classList.remove('on'); E.add(AD); res(true); };
  });
  window.Energy=E;
})();
