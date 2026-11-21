/* Shared bottom navigation: same on map, yard, dictionary. Hidden only inside a lesson. */
(function(){
  const css=`
.navbar{position:absolute;left:2.5%;right:2.5%;bottom:1.6%;z-index:45;display:flex;gap:1.6cqw;padding:1.6cqw;
  background:linear-gradient(#fff6e2,#f0d9a8);border:0.9cqw solid #8a5a2e;border-radius:5cqw;box-shadow:0 1.2cqw 0 #5a3417,0 2cqw 3cqw rgba(0,0,0,.25)}
.navbar button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.4cqw;min-height:13cqw;border:none;cursor:pointer;
  border-radius:3.4cqw;background:transparent;font-family:inherit;color:#8a5a2e;font-weight:900;font-size:2.8cqw;-webkit-tap-highlight-color:transparent;transition:transform .1s}
.navbar button i{font-style:normal;font-size:6.4cqw;line-height:1;filter:grayscale(.35)}
.navbar button.on{background:linear-gradient(#ffe066,#ffb92e);color:#5a3010;box-shadow:inset 0 -0.8cqw 0 rgba(140,80,0,.35)}
.navbar button.on i{filter:none;transform:scale(1.12)}
.navbar button:active{transform:scale(.93)}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  window.mountNav=function(container,active,base){
    base=base||'';
    const items=[['map','🗺','Карта','index.html'],['yard','🏡','Двор','yard/index.html'],['dict','📖','Словарь','dict.html'],['prof','👤','Профиль',null]];
    const bar=document.createElement('div'); bar.className='navbar';
    items.forEach(([id,ic,lab,href])=>{ const b=document.createElement('button'); if(id===active) b.classList.add('on');
      b.innerHTML='<i>'+ic+'</i>'+lab;
      b.onclick=()=>{ if(id===active) return; if(!href){ (window.toast||alert)('Профиль появится скоро 👤'); return; } location.href=base+href; };
      bar.appendChild(b); });
    container.appendChild(bar);
  };
})();
