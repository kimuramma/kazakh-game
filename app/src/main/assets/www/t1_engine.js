/* ===== Topic 1 «Магазин у дома» — lessons 1..10 ===== */
const CAT={
  bread:{src:'img/bread.png',s:.75}, milk:{src:'img/p/milk.png',s:1}, ayran:{src:'img/p/ayran.png',s:1},
  smet:{src:'img/p/smetana.png',s:.8}, butter:{src:'img/p/butter.png',s:.68}, cheese:{src:'img/p/cheese.png',s:.72},
  kurt:{src:'img/p/kurt.png',s:.62}, eggs:{src:'img/p/eggs.png',s:.62}, ice:{src:'img/p/icecream.png',s:1},
  water:{src:'img/p/water.png',s:1}, juice:{src:'img/p/juice.png',s:.95}, tea:{src:'img/p/tea.png',s:.9},
  sugar:{src:'img/p/sugar.png',s:.9}, pear:{src:'img/p/pear.png',s:.85}, grapes:{src:'img/p/grapes.png',s:.9},
  orange:{src:'img/p/orange.png',s:.72}
};
const KK={bread:'нан',milk:'сүт',ayran:'айран',smet:'қаймақ',butter:'сары май',cheese:'ірімшік',kurt:'құрт',eggs:'жұмыртқа',ice:'балмұздақ',water:'су',juice:'шырын',tea:'шай',sugar:'қант',pear:'алмұрт',grapes:'жүзім',orange:'апельсин'};
const RU={bread:'хлеб',milk:'молоко',ayran:'айран',smet:'сметана',butter:'сливочное масло',cheese:'сыр',kurt:'курт',eggs:'яйца',ice:'мороженое',water:'вода',juice:'сок',tea:'чай',sugar:'сахар',pear:'груша',grapes:'виноград',orange:'апельсин'};
const FSLOT=[[28,32],[28,68],[45,32],[45,68],[62,32],[62,68],[77.5,32],[77.5,68]];
let FR=[], CO=[];
/* ---- fridge (right side, products visible through the glass from the start) ---- */
function showFridge(ids){ FR=ids; const box=$('prods'); box.innerHTML='';
  ids.forEach((id,i)=>{ if(!id) return; const [row,x]=FSLOT[i]; const d=document.createElement('div'); d.className='prod'; d.id='p_'+id;
    d.style.left=x+'%'; d.style.bottom=(100-row+0.5)+'%'; d.style.height=(15*CAT[id].s)+'%'; d.innerHTML=`<img src="${CAT[id].src}" alt="">`; box.appendChild(d); });
  $('door').classList.remove('open'); $('fz').classList.add('on'); }
function hideFridge(){ $('fz').classList.remove('on'); }
async function openDoor(){ if($('door').classList.contains('open')) return; $('q').innerHTML='Открой дверцу холодильника 👆'; clearPanel(); panel(true); await doorOpen(); }
/* ---- counter: items stand on the counter top (visible-area %) ---- */
function showCounter(ids){ CO=ids; const box=$('counter'); box.innerHTML=''; calcVL();
  const n=ids.length, x0=44, x1=93; ids.forEach((id,i)=>{ const d=document.createElement('div'); d.className='ci'; d.id='c_'+id;
    d.style.left=(n===1?(x0+x1)/2:x0+(x1-x0)*i/(n-1))+'%'; d.style.height=(19*CAT[id].s)+'%'; d.innerHTML=`<img src="${CAT[id].src}" alt="">`; box.appendChild(d); }); }
function hideCounter(){ $('counter').innerHTML=''; CO=[]; }
function el(id){ return $('p_'+id)||$('c_'+id); }
/* ---- learn by tapping the glowing product ---- */
function learn(id,pairs,note){ const e=el(id); e.classList.add('glow');
  return new Promise(res=>{ $('q').innerHTML=`Новое слово! Нажми на ${RU[id]==='яйца'?'яйца':RU[id]} 👆`; clearPanel(); panel(true);
    e.onclick=async()=>{ ac(); sfx.ok(); e.classList.remove('glow'); sparks(e); e.onclick=null; await card(pairs||[[cap(KK[id]),RU[id]]],note); res(); }; }); }
function cap(t){ return t.charAt(0).toUpperCase()+t.slice(1); }
/* ---- find the right product among all shown ---- */
function pick(qHtml,ok,jokes){ return new Promise(res=>{ $('q').innerHTML=qHtml; clearPanel(); panel(true);
  const ids=[...FR,...CO].filter(Boolean);
  ids.forEach(id=>{ const e=el(id); if(!e) return; e.classList.remove('bad','ok','glow');
    e.onclick=async()=>{ ac();
      if(id===ok){ sfx.ok(); e.classList.add('ok'); sparks(e); alma('happy'); ids.forEach(q=>{ if(el(q)) el(q).onclick=null; }); await sleep(900); e.classList.remove('ok'); res(e); }
      else{ miss(); sfx.bad(); e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); alma('oops');
        hint((jokes&&jokes[id])||`Это ${KK[id]} — ${RU[id]}. Не то! 😉`); } }; });
}); }
/* ---- held item: fits the hands whatever the shape ---- */
function holdItem(src){ const im=$('alma').querySelector('.itm'); im.onload=()=>{ const tall=im.naturalHeight>im.naturalWidth*1.15;
    im.style.width=tall?'auto':'48%'; im.style.height=tall?'40%':'auto'; im.style.top=tall?'34%':'44%'; }; im.src=src; RIG.hold(true); }
/* ---- basket ---- */
let BN=0; function basketOn(){ BN=0; $('bcount').textContent='0'; $('basket').classList.add('on'); }
function toBasket(e){ const r=e.getBoundingClientRect(), g=$('outer').getBoundingClientRect(), b=$('basket').getBoundingClientRect();
  const f=e.cloneNode(true); f.className=''; f.style.cssText=`position:absolute;z-index:45;left:${r.left-g.left}px;top:${r.top-g.top}px;height:${r.height}px;transition:all .8s cubic-bezier(.5,-0.3,.4,1.2)`;
  $('outer').appendChild(f); void f.offsetWidth; f.style.left=(b.left-g.left+b.width*.3)+'px'; f.style.top=(b.top-g.top)+'px'; f.style.height=(r.height*.4)+'px'; f.style.opacity='.3';
  setTimeout(()=>{ f.remove(); BN++; $('bcount').textContent=BN; sfx.coin(); },820); e.classList.add('gone'); }
/* ---- price: Apa says it, the hint is always the whole number ---- */
async function price(spk,toks,qText,opts,coins,tag,hintTxt){
  await line('alma',K([['Қанша','сколько'],['тұрады?','стоит?']]),'Қанша тұрады?');
  say('apa',K(toks)); speak(spk); $('tagBox').style.opacity=1; $('tagTxt').textContent='?';
  await ask(`Апа сказала: <b style="color:#2f6f18">«${spk}»</b>. ${qText}<small>${hintTxt}</small>`,opts);
  hush(); $('tagTxt').textContent=tag; sparks($('tagBox'),10); progress(); panel(false); await sleep(400);
  for(let i=0;i<coins.n;i++){ const c=document.createElement('div'); c.className='coin abs'; c.textContent=coins.v;
    c.style.left=(VL+20)+'%'; c.style.top='52%'; G.appendChild(c); await sleep(30); c.style.left=(VL+40+i*4)+'%'; c.style.top='42%'; sfx.coin(); await sleep(360); setTimeout(()=>c.remove(),900); }
  await sleep(300); $('tagBox').style.opacity=0; }
async function step(){ panel(false); hush(); progress(); await sleep(250); }

/* ===== lessons ===== */
const L={};
L[1]={title:'Хлеб',steps:8, words:[['Сәлем!','Привет!'],['Сәлеметсіз бе!','Здравствуйте! (старшему)'],['Нан','Хлеб'],['Бар','Есть (имеется)'],['Нан бар ма?','Хлеб есть?'],['Қанша тұрады?','Сколько стоит?'],['Екі жүз теңге','Двести тенге'],['Рақмет!','Спасибо!']],
 async run(){ showCounter(['bread','orange','tea']);
  await line('alma','Ура, лавка Апы! Мама просила купить хлеб 🍞');
  await line('apa',K([['Сәлем,','привет,'],['Алма!','Алма!']])+' 😊','Сәлем, Алма!');
  await card([['Сәлем!','Привет! (другу, младшему)'],['Сәлеметсіз бе!','Здравствуйте! (старшему)']],'Апа старше — ей говорим «Сәлеметсіз бе!»');
  await ask('Поздоровайся с Апой вежливо:',[{t:'Сәлем!',react:'Так здороваются с друзьями. Апа старше 🙏'},{t:'Сәлеметсіз бе!',ok:true},{t:'Рақмет!',react:'Это «спасибо» 😉'}]);
  say('alma',K('Сәлеметсіз бе','Здравствуйте')+', '+K('апай','тётя (вежливо)')+'! 👋'); speak('Сәлеметсіз бе'); RIG.wave(1400); await sleep(1500); await step();
  await learn('bread',[['Нан','хлеб']]); await step();
  await card([['Бар','есть (имеется)'],['… ма?','частица вопроса']],'Нан бар ма? — Хлеб есть? Частица меняется по слову: ма / ме / ба / бе / па / пе');
  await build('Спроси у Апы: «Хлеб есть?»',['ма?','бар','Нан','сүт'],['Нан','бар','ма?'],'Сначала «Нан», потом «бар», в конце «ма?»');
  say('alma',K([['Нан','хлеб'],['бар','есть'],['ма?','?']])); speak('Нан бар ма?'); await sleep(1300); await step();
  await line('apa',K([['Бар!','Есть!']])+' Свежий, тёплый 🍞','Бар!');
  await type('Напиши по-казахски: <b>хлеб</b>',['нан']); await step();
  await card([['Екі','два'],['Жүз','сто'],['Екі жүз','двести (2 × 100)'],['Теңге','тенге']],'Сначала считаем, сколько сотен: екі жүз = 200');
  await price('Екі жүз теңге',[['Екі','два'],['жүз','сто'],['теңге','тенге']],'Сколько это?',[{t:'2 ₸',react:'«Жүз» — это сто 😉'},{t:'200 ₸',ok:true},{t:'2 000 ₸',react:'Это «екі мың» — дорого для хлеба!'}],{n:2,v:'100'},'200 ₸','екі = 2, жүз = 100 → 200');
  await card([['Рақмет!','Спасибо!']]);
  await ask('Апа дала хлеб. Что скажешь?',[{t:'Рақмет!',ok:true},{t:'Сәлем!',react:'Мы уже поздоровались 🙂'},{t:'Нан',react:'Хлеб уже у тебя 😄'}]);
  holdItem(CAT.bread.src); el('bread').classList.add('gone'); say('alma',K('Рақмет','Спасибо')+', '+K('апай','тётя (вежливо)')+'! 💛'); speak('Рақмет!'); await sleep(1500); await step();
 }};
L[2]={title:'Молоко и айран',steps:8, words:[['Тоңазытқыш','Холодильник'],['Сүт','Молоко'],['Айран','Айран'],['Сүт бар ма?','Молоко есть?'],['Жеті жүз теңге','Семьсот тенге'],['Сау бол!','Пока! (младшему)'],['Сау болыңыз!','До свидания! (старшему)']],
 async run(){ showCounter(['bread','orange']);
  await line('alma','Сегодня мама просит молоко 🥛 Где же оно?');
  await line('apa',K([['Тоңазытқышта!','в холодильнике!']])+' ❄️','Тоңазытқышта!');
  await card([['Тоңазытқыш','холодильник'],['Тоңазытқышта','в холодильнике']],'-та / -да / -те / -де = «в, на»'); hideCounter();
  showFridge(['milk','ayran','smet','butter','cheese','eggs','water','juice']); await openDoor(); await step();
  await learn('milk',[['Сүт','молоко']]); await learn('ayran',[['Айран','айран (кисломолочный напиток)']]); await step();
  await pick('Найди: <b style="color:#2f6f18">Сүт</b>','milk',{water:'Су — вода. «Су» и «сүт» похожи, но не путай! 💧',ayran:'Айран — кислый, а нужно молоко 😉'}); await step();
  await listen('Послушай и выбери перевод:','sut_bar_ma','Сүт бар ма?',[{t:'Молоко есть?',ok:true},{t:'Хлеб есть?',react:'Хлеб — «нан» 🍞'},{t:'Вода есть?',react:'Вода — «су» 💧'}]); await step();
  await type('Напиши по-казахски: <b>молоко</b>',['сүт'],'Подсказка: буква «ү» — на панели внизу'); await step();
  hideFridge(); showCounter(['milk']);
  await card([['Жеті','семь'],['Жеті жүз','семьсот (7 × 100)']]);
  await price('Жеті жүз теңге',[['Жеті','семь'],['жүз','сто'],['теңге','тенге']],'Сколько стоит молоко?',[{t:'70 ₸',react:'«Жүз» — сто, значит сотни 😉'},{t:'700 ₸',ok:true},{t:'7 000 ₸',react:'Это «жеті мың» — молоко от золотой коровы? 🐄✨'}],{n:7,v:'100'},'700 ₸','жеті = 7, жүз = 100 → 700');
  holdItem(CAT.milk.src); el('milk').classList.add('gone');
  await line('apa',K([['Сау','будь здорова'],['бол,','(пока),'],['Алма!','Алма!']])+' 👋','Сау бол, Алма!');
  await card([['Сау бол!','Пока! (другу, младшему)'],['Сау болыңыз!','До свидания! (старшему)']]);
  await ask('Ответь Апе вежливо:',[{t:'Сау бол!',react:'Так говорят младшим и друзьям. Апа старше 🙏'},{t:'Сау болыңыз!',ok:true}]);
  say('alma',K('Сау болыңыз','До свидания')+'! 👋'); speak('Сау болыңыз!'); await sleep(1400); await step();
 }};
L[3]={title:'Масло и сметана',steps:8, words:[['Не керек?','Что нужно?'],['Керек','Нужно'],['Май','Масло'],['Сары май','Сливочное масло'],['Қаймақ','Сметана'],['Маған … керек','Мне нужно …'],['Мың','Тысяча'],['Екі мың теңге','Две тысячи тенге']],
 async run(){ showFridge(['milk','ayran','smet','butter','cheese','eggs','water','juice']);
  await line('alma','Мама печёт блины 🥞 Нужны масло и сметана!');
  await line('apa',K([['Не','что'],['керек?','нужно?']])+' 😊','Не керек?');
  await card([['Не?','что?'],['Керек','нужно'],['Не керек?','Что нужно?']]); await openDoor(); await step();
  await learn('butter',[['Май','масло'],['Сары','жёлтый'],['Сары май','сливочное масло']],'«Жёлтое масло» — так по-казахски называют сливочное масло');
  await learn('smet',[['Қаймақ','сметана']]); await step();
  await pick('Найди: <b style="color:#2f6f18">Қаймақ</b>','smet',{milk:'Сүт — молоко 🥛',cheese:'Ірімшік — сыр 🧀',butter:'Это сары май — сливочное масло'});
  await pick('Найди: <b style="color:#2f6f18">Сары май</b>','butter',{cheese:'Это сыр! Тоже жёлтый, но с дырками 🧀',eggs:'Жұмыртқа — яйца 🥚'}); await step();
  await card([['Маған','мне (мен = я)'],['Маған … керек','мне нужно …']]);
  await build('Скажи: «Мне нужно сливочное масло»',['керек','Маған','май','сары','нан'],['Маған','сары','май','керек'],'«Маған» — в начале, «керек» — в конце');
  say('alma',K([['Маған','мне'],['сары май','сливочное масло'],['керек','нужно']])); speak('Маған сары май керек'); await sleep(1500); await step();
  await type('Напиши по-казахски: <b>сметана</b>',['қаймақ'],'Подсказка: буква «қ» — на панели'); await step();
  hideFridge(); showCounter(['butter','smet']);
  await card([['Мың','тысяча'],['Екі мың','две тысячи (2 × 1000)']]);
  await price('Екі мың теңге',[['Екі','две'],['мың','тысячи'],['теңге','тенге']],'Сколько стоят масло и сметана?',[{t:'200 ₸',react:'Это «екі жүз». А тут «мың» — тысяча 😉'},{t:'2 000 ₸',ok:true},{t:'20 000 ₸',react:'Двадцать тысяч?! Блины из золота? 💰'}],{n:2,v:'1000'},'2 000 ₸','екі = 2, мың = 1000 → 2 000');
  holdItem(CAT.butter.src); ['butter','smet'].forEach(i=>el(i).classList.add('gone'));
  say('alma',K('Рақмет','Спасибо')+'! Будут самые вкусные блины 🥞'); speak('Рақмет!'); await sleep(1600); await step();
 }};
L[4]={title:'Яйца',steps:8, words:[['Жұмыртқа','Яйца, яйцо'],['Қанша … керек?','Сколько … нужно?'],['Бір','Один'],['Бес','Пять'],['Он','Десять'],['… беріңізші','Дайте, пожалуйста …'],['Абайла!','Осторожно!'],['Алты жүз теңге','Шестьсот тенге']],
 async run(){ showFridge(['milk','ayran','smet','butter','cheese','eggs','water','ice']);
  await line('alma','Будем печь торт 🎂 Нужны яйца!');
  await openDoor(); await learn('eggs',[['Жұмыртқа','яйца, яйцо']]); await step();
  await line('apa',K([['Қанша','сколько'],['жұмыртқа','яиц'],['керек?','нужно?']]),'Қанша жұмыртқа керек?');
  await card([['Бір','один'],['Бес','пять'],['Он','десять']]);
  await ask('Тебе нужно десять яиц. Что ответишь?',[{t:'Бір',react:'Одно яйцо? Торт будет размером с монетку 😄'},{t:'Он',ok:true},{t:'Бес',react:'Бес — пять. Нужно больше!'}]);
  say('alma',K([['Он','десять'],['жұмыртқа','яиц']])); speak('Он жұмыртқа'); await sleep(1300); await step();
  await card([['Бер','дай'],['… беріңізші','дайте, пожалуйста …']],'бер + іңіз (вежливо) + ші (пожалуйста)');
  await build('Попроси: «Дайте, пожалуйста, десять яиц»',['беріңізші','жұмыртқа','сүт','Он'],['Он','жұмыртқа','беріңізші'],'Сначала число «Он», в конце «беріңізші»');
  say('alma',K([['Он','десять'],['жұмыртқа','яиц'],['беріңізші','дайте, пожалуйста']])); speak('Он жұмыртқа беріңізші'); await sleep(1600); await step();
  hideFridge(); showCounter(['eggs']); el('eggs').classList.add('bad');
  await line('apa',K('Абайла!','Осторожно!')+' 🥚💥','Абайла!');
  await ask('Что значит «Абайла!»?',[{t:'Спасибо',react:'Спасибо — «Рақмет» 😉'},{t:'Осторожно!',ok:true},{t:'Привет',react:'Привет — «Сәлем» 👋'}]); await step();
  await type('Напиши по-казахски: <b>десять</b>',['он']);
  await card([['Алты','шесть'],['Алты жүз','шестьсот (6 × 100)']]);
  await price('Алты жүз теңге',[['Алты','шесть'],['жүз','сто'],['теңге','тенге']],'Сколько стоят яйца?',[{t:'60 ₸',react:'«Жүз» — сотни 😉'},{t:'600 ₸',ok:true},{t:'6 000 ₸',react:'Это «алты мың» — слишком дорого!'}],{n:6,v:'100'},'600 ₸','алты = 6, жүз = 100 → 600');
  holdItem(CAT.eggs.src); el('eggs').classList.add('gone');
  say('alma','Несу аккуратно… очень аккуратно… 🥚😬'); await sleep(1700); await step();
 }};
L[5]={title:'Сыр и курт',steps:8, words:[['Ірімшік','Сыр'],['Құрт','Курт'],['Татып көр!','Попробуй!'],['Тұзды','Солёный'],['Тәтті','Сладкий'],['Өте дәмді','Очень вкусно'],['Екі мың бес жүз теңге','Две тысячи пятьсот тенге']],
 async run(){ showCounter(['cheese','kurt','bread','sugar']);
  await line('alma','Апа, говорят, у вас самый вкусный курт! 🤩');
  await learn('kurt',[['Құрт','курт (сушёные сырные шарики)']]); await learn('cheese',[['Ірімшік','сыр']]); await step();
  await line('apa',K([['Татып','попробуй'],['көр!','(на вкус)!']])+' 😊','Татып көр!');
  RIG.mood('oops'); say('alma','Ммм… Ой! 😝 '+K([['Тұзды!','солёный!']])); speak('Тұзды!');
  await card([['Тұзды','солёный'],['Тәтті','сладкий']]);
  say('alma','Ммм… Ой! 😝 '+K([['Тұзды!','солёный!']]));
  await ask('Курт какой? <small>Алма сказала: «Тұзды!»</small>',[{t:'Тәтті — сладкий',react:'Курт точно не сладкий 😝'},{t:'Тұзды — солёный',ok:true}]); RIG.reset(); await step();
  await pick('Апа угощает и сыром. Найди: <b style="color:#2f6f18">Ірімшік</b>','cheese',{kurt:'Это құрт, его уже пробовали 😝',bread:'Нан — хлеб 🍞',sugar:'Қант — сахар'}); await step();
  await card([['Өте дәмді','очень вкусно']]);
  await build('Скажи Апе: «Курт очень вкусный!»',['дәмді','тұзды','Құрт','өте'],['Құрт','өте','дәмді'],'«Құрт» в начале, потом «өте дәмді»');
  say('alma',K([['Құрт','курт'],['өте дәмді!','очень вкусный!']])); speak('Құрт өте дәмді!'); await sleep(1500); await step();
  await type('Напиши по-казахски: <b>сладкий</b>',['тәтті'],'Подсказка: буква «ә» — на панели'); await step();
  await card([['Бес жүз','пятьсот'],['Екі мың бес жүз','две тысячи пятьсот (2 000 + 500)']]);
  await price('Екі мың бес жүз теңге',[['Екі','две'],['мың','тысячи'],['бес','пять'],['жүз','сто'],['теңге','тенге']],'Сколько стоят сыр и курт?',[{t:'2 500 ₸',ok:true},{t:'250 ₸',react:'Тут есть «мың» — тысяча 😉'},{t:'25 000 ₸',react:'Слишком много!'}],{n:5,v:'500'},'2 500 ₸','екі мың = 2 000, бес жүз = 500 → 2 500');
  holdItem(CAT.cheese.src); ['cheese','kurt'].forEach(i=>el(i).classList.add('gone'));
  say('alma','Курт — в карман, сыр — домой! 🧀'); await sleep(1600); await step();
 }};
L[6]={title:'Фрукты',steps:8, words:[['Жеміс','Фрукт'],['Алмұрт','Груша'],['Жүзім','Виноград'],['Апельсин','Апельсин'],['Өте тәтті','Очень сладкий'],['Келі','Килограмм'],['Мың теңге','Тысяча тенге']],
 async run(){ showCounter(['pear','grapes','orange','bread']);
  await line('alma','Хочу фруктов! Только не яблоко… это же я 🍎😅');
  await card([['Жеміс','фрукт']]);
  await learn('pear',[['Алмұрт','груша']]); await learn('grapes',[['Жүзім','виноград']]); await learn('orange',[['Апельсин','апельсин']]); await step();
  await ask('Как по-казахски «груша»?',[{t:'Алма',react:'Алма — это Я!! 😤🍎'},{t:'Алмұрт',ok:true},{t:'Жүзім',react:'Жүзім — виноград 🍇'}]); await step();
  say('apa',K([['Жүзім','виноград'],['өте тәтті!','очень сладкий!']])); speak('Жүзім өте тәтті!');
  await ask('Что сказала Апа? <small>«Жүзім өте тәтті!»</small>',[{t:'Виноград очень сладкий',ok:true},{t:'Виноград очень солёный',react:'Солёный — «тұзды». Это про курт 😝'},{t:'Винограда нет',react:'Нет-нет, его полно 🍇'}]); hush(); await step();
  await card([['Келі','килограмм'],['Бір келі','один килограмм']]);
  await build('Попроси: «Дайте, пожалуйста, килограмм винограда»',['жүзім','беріңізші','Бір','келі','алма'],['Бір','келі','жүзім','беріңізші'],'«Бір келі жүзім…», в конце «беріңізші»');
  say('alma',K([['Бір келі','один килограмм'],['жүзім','винограда'],['беріңізші','дайте, пожалуйста']])); speak('Бір келі жүзім беріңізші'); await sleep(1700); await step();
  await pick('Положи в пакет: <b style="color:#2f6f18">Жүзім</b>','grapes',{pear:'Это алмұрт — груша 🍐',orange:'Это апельсин 🍊',bread:'Нан — хлеб 🍞'}); await step();
  await type('Напиши по-казахски: <b>груша</b>',['алмұрт'],'Подсказка: буква «ұ» — на панели'); await step();
  await price('Мың теңге',[['Мың','тысяча'],['теңге','тенге']],'Сколько стоит килограмм винограда?',[{t:'100 ₸',react:'Сто — «жүз» 😉'},{t:'1 000 ₸',ok:true},{t:'10 ₸',react:'Так дёшево не бывает 😄'}],{n:1,v:'1000'},'1 000 ₸','мың = 1 000');
  holdItem(CAT.grapes.src); el('grapes').classList.add('gone');
  say('alma','Витамины! 💪🍇'); await sleep(1400); await step();
 }};
L[7]={title:'Секрет языка',grammar:true,steps:8, words:[['Иә','Да'],['Жоқ','Нет (не имеется)'],['… ма? / … ме?','Частица вопроса после гласных и л, р, й, у'],['… ба? / … бе?','Частица вопроса после м, н, ң, ж, з'],['… па? / … пе?','Частица вопроса после к, қ, п, т, с, ш'],['Сүт керек пе?','Молоко нужно?'],['Балмұздақ жоқ','Мороженого нет']],
 async run(){ showCounter(['bread','cheese','kurt','pear']);
  await line('alma','Апа, у меня вопрос 🤔 Почему «Нан бар <b>ма</b>?», но «Сүт керек <b>пе</b>?»');
  await line('apa','Хороший вопрос! Частица вопроса <b>подстраивается</b> под конец слова 😊');
  await card([['Нан бар ма?','Хлеб есть?'],['Құрт тұзды ма?','Курт солёный?'],['Ірімшік дәмді ме?','Сыр вкусный?']],'Твёрдое слово (а, о, ұ, ы) → <b>ма</b>. Мягкое слово (ә, е, і, ө, ү) → <b>ме</b>.','Понятно 👍','Секрет 1: ма или ме?');
  await ask('Выбери частицу: <b>Нан тәтті …?</b> <small>«тәтті» — мягкое слово (ә, і)</small>',[{t:'ма',react:'«Тәтті» мягкое — нужна мягкая частица 😉'},{t:'ме',ok:true}]);
  await ask('Выбери частицу: <b>Айран бар …?</b> <small>«бар» — твёрдое слово (а)</small>',[{t:'ма',ok:true},{t:'ме',react:'«Бар» твёрдое (а) — значит «ма» 😉'}]); await step();
  await card([['Нан бар ма?','Хлеб есть?'],['Айран ба?','Айран?'],['Сүт керек пе?','Молоко нужно?']],'Буква зависит от последнего звука: после гласных и л, р, й, у → <b>ма/ме</b>; после м, н, ң, ж, з → <b>ба/бе</b> (как в «Сәлеметсіз <b>бе</b>!»); после к, қ, п, т, с, ш → <b>па/пе</b>.','Понятно 👍','Секрет 2: ма, ба или па?');
  await ask('Выбери частицу: <b>Айран …?</b> <small>«айран» кончается на «н»</small>',[{t:'ма',react:'После «н» → ба/бе 😉'},{t:'ба',ok:true},{t:'па',react:'«па» — после к, қ, п, т, с, ш'}]);
  await ask('Выбери: <b>Нан керек …?</b> <small>«керек» мягкое и кончается на «к»</small>',[{t:'ма'},{t:'ме',react:'Почти! Слово кончается на «к» → па/пе 😉'},{t:'пе',ok:true}]); await step();
  await card([['Иә','да'],['Жоқ','нет (не имеется)'],['Бар','есть']],'Бар ↔ Жоқ — пара: «есть» и «нет»');
  await line('alma',K([['Балмұздақ','мороженое'],['бар','есть'],['ма?','?']])+' 🍦','Балмұздақ бар ма?');
  await line('apa',K([['Жоқ,','нет,'],['балмұздақ','мороженого'],['жоқ','нет']])+'. Зима же! ❄️','Жоқ, балмұздақ жоқ.');
  await ask('Что ответила Апа?',[{t:'Мороженое есть',react:'«Жоқ» — это «нет» 😉'},{t:'Мороженого нет',ok:true},{t:'Мороженое вкусное',react:'Вкусное — «дәмді» 😋'}]); await step();
  await build('Спроси: «Молоко нужно?»',['пе?','керек','Сүт','ма?'],['Сүт','керек','пе?'],'«керек» кончается на «к» → «пе?»'); await step();
  await type('Напиши по-казахски: <b>нет</b>',['жоқ'],'Подсказка: буква «қ» — на панели'); await step();
  await ask('Апа спрашивает: <b>«Нан керек пе?»</b> Ты хочешь хлеб. Ответь:',[{t:'Иә, керек!',ok:true},{t:'Жоқ, керек емес',react:'Это «нет, не нужно» 🙂 А ты хочешь хлеб!'}]);
  say('alma',K([['Иә,','да,'],['керек!','нужно!']])+' 🍞'); await sleep(1300); await step();
 }};
L[8]={title:'Повторение',steps:8, words:[],
 async run(){ showCounter(['bread','cheese','pear','kurt']); showFridge(['milk','ayran','smet','butter','eggs','water']); $('door').classList.add('open');
  await line('alma','Повторим всё, что знаем! Без новых слов 💪 Слова, где были ошибки, попадутся чаще.');
  await pick('Найди: <b>Сүт</b>','milk'); await step();
  await pick('Найди: <b>Жұмыртқа</b>','eggs'); await step();
  await listen('Послушай и выбери перевод:','nan_bar_ma','Нан бар ма?',[{t:'Хлеб есть?',ok:true},{t:'Молоко есть?'},{t:'Сколько стоит?'}]); await step();
  await type('Напиши по-казахски: <b>сметана</b>',['қаймақ']); await step();
  await build('Собери: «Дайте, пожалуйста, десять яиц»',['жұмыртқа','Он','беріңізші','бар'],['Он','жұмыртқа','беріңізші']); await step();
  await listen('Послушай: сколько это?','zheti_juz','Жеті жүз теңге',[{t:'70 ₸'},{t:'700 ₸',ok:true},{t:'7 000 ₸'}]); await step();
  await ask('Выбери частицу: <b>Ірімшік бар …?</b>',[{t:'ма',ok:true},{t:'пе'}]); await step();
  await type('Напиши по-казахски: <b>груша</b>',['алмұрт']); await step();
 }};
L[9]={title:'SMS от мамы',steps:8, words:[['Дүкен','Магазин'],['Ал','Купи, возьми'],['Анаң','Твоя мама'],['Барлығы қанша?','Сколько всего?'],['Мың бес жүз теңге','Тысяча пятьсот тенге']],
 async run(){ showCounter(['bread','pear','cheese']); showFridge(['milk','ayran','eggs','water']); $('door').classList.add('open');
  await line('alma','Ой, мама прислала SMS! 📱 Прочитаем вместе.');
  await cont(`<div style="background:#eaf6ff;border:0.6cqw solid #69b8f2;border-radius:3cqw;padding:3cqw;font-size:5.4cqw;line-height:1.35">📱 ${K([['Алма,','Алма,'],['дүкеннен','из магазина'],['нан,','хлеб,'],['сүт,','молоко,'],['жұмыртқа','яйца'],['ал.','купи.'],['Рақмет!','Спасибо!'],['Анаң','твоя мама']])}</div><small>Нажми на слово, чтобы увидеть перевод</small>`,'Прочитала 👍');
  await card([['Дүкен','магазин'],['Ал','купи, возьми'],['Анаң','твоя мама']]);
  await ask('Что мама просит купить?',[{t:'Хлеб, молоко, яйца',ok:true},{t:'Хлеб, сыр, грушу',react:'Перечитай SMS: нан, сүт, жұмыртқа 😉'},{t:'Молоко и айран',react:'Айрана в списке нет 😉'}]); await step();
  basketOn();
  for(const id of ['bread','milk','eggs']){ const e=await pick(`Положи в корзину: <b style="color:#2f6f18">${cap(KK[id])}</b>`,id,{cheese:'Сыр мама не просила 😉',pear:'Груш нет в SMS',ayran:'Айран не просили',water:'Воду не просили'}); toBasket(e); await sleep(400); }
  await step(); hideFridge();
  await card([['Барлығы','всё, всего'],['Барлығы қанша?','Сколько всего?']]);
  await line('alma',K([['Барлығы','всего'],['қанша?','сколько?']]),'Барлығы қанша?');
  await card([['Мың','тысяча'],['Бес жүз','пятьсот'],['Мың бес жүз','тысяча пятьсот']],'нан 200 + сүт 700 + жұмыртқа 600 = 1 500');
  say('apa',K([['Мың','тысяча'],['бес жүз','пятьсот'],['теңге','тенге']])); speak('Мың бес жүз теңге'); $('tagBox').style.opacity=1; $('tagTxt').textContent='?';
  await ask('Апа сказала: <b style="color:#2f6f18">«Мың бес жүз теңге»</b>. Сколько это?<small>мың = 1 000, бес жүз = 500</small>',[{t:'150 ₸',react:'Тут есть «мың» — тысяча 😉'},{t:'1 500 ₸',ok:true},{t:'15 000 ₸',react:'Слишком много 😄'}]);
  hush(); $('tagTxt').textContent='1 500 ₸'; sparks($('tagBox'),10); await step();
  await type('Ответь маме SMS одним словом: «Купила!» — напиши по-казахски <b>«Алдым!»</b>',['алдым'],'Просто перепиши: Алдым');
  say('alma','Мама, '+K([['алдым!','купила!']])+' 🧺💛'); await sleep(1500); $('tagBox').style.opacity=0; await step();
 }};
L[10]={title:'Тест',test:true,steps:10, words:[],
 async run(){ showCounter(['bread','cheese','pear','kurt']);
  await line('alma','Тест как в КАЗТЕСТ: слушаем, читаем, пишем и выбираем 💪 Ошибаться можно — это тренировка.');
  const Q=[
   ()=>listen('1/10 · 🎧 Слушание. Послушай и выбери:','salemetsiz_be','Сәлеметсіз бе!',[{t:'Здравствуйте!',ok:true},{t:'Спасибо!'},{t:'До свидания!'}]),
   ()=>listen('2/10 · 🎧 Слушание. Сколько стоит?','eki_juz','Екі жүз теңге',[{t:'20 ₸'},{t:'200 ₸',ok:true},{t:'2 000 ₸'}]),
   ()=>ask(`3/10 · 📖 Чтение. SMS: <b>«Алма, нан мен сүт ал.»</b> Что купить?`,[{t:'Хлеб и молоко',ok:true},{t:'Хлеб и сыр'},{t:'Молоко и яйца'}]),
   ()=>ask('4/10 · 📖 Чтение. Табличка: <b>«Балмұздақ жоқ»</b>. Что это значит?',[{t:'Мороженое есть'},{t:'Мороженого нет',ok:true},{t:'Мороженое вкусное'}]),
   ()=>pick('5/10 · Найди: <b>Ірімшік</b>','cheese'),
   ()=>ask('6/10 · Выбери частицу: <b>Сүт керек …?</b>',[{t:'ма'},{t:'ме'},{t:'пе',ok:true}]),
   ()=>build('7/10 · Собери: «Хлеб есть?»',['ма?','бар','Нан','керек'],['Нан','бар','ма?']),
   ()=>ask('8/10 · «Алты жүз теңге» — это…',[{t:'60 ₸'},{t:'600 ₸',ok:true},{t:'6 000 ₸'}]),
   ()=>type('9/10 · ✍️ Письмо. Напиши по-казахски: <b>молоко</b>',['сүт']),
   ()=>type('10/10 · ✍️ Письмо. Напиши по-казахски: <b>спасибо</b>',['рақмет','рахмет'])
  ];
  for(const q of Q){ await q(); await step(); }
 }};

/* ===== run ===== */
const LN=+(new URLSearchParams(location.search).get('l')||1); const CFG=L[LN]||L[1];
LESSON=(CFG.test?'Тест. Магазин у дома':'Урок '+LN+'. '+CFG.title); WORDS=CFG.words; TOTAL=CFG.steps;
document.title=(CFG.test?'Тест':'Урок '+LN)+' — '+CFG.title;
let EARN=0;
async function lesson(){
  stepN=0; MISTAKES=0; $('barfill').style.width='0'; $('result').classList.remove('on'); hush(); if(RIG) RIG.reset();
  await toScene('shop');
  await CFG.run();
  $('barfill').style.width='100%'; hush(); panel(false);
  addWords(); sfx.win();
  EARN=CFG.test?50:(10+(MISTAKES===0?5:0));
  $('resTitle').textContent=CFG.test?'Тест пройден! 🏆':'Урок '+LN+' пройден! 🎉';
  $('resSub').textContent=CFG.test?('Ошибок: '+MISTAKES+(MISTAKES===0?' — идеально! 🌟':' — это нормально, ты учишься 💪')):(MISTAKES===0?'Без ошибок! +5 ⭐ бонус':'Новые слова — в словаре 📖');
  $('newWords').innerHTML=WORDS.map(([k])=>`<span>${k}</span>`).join('');
  $('rewName').textContent='+'+EARN+' ⭐';
  $('nextL').style.display=LN<10?'':'none';
  $('result').classList.add('on');
}
let FIN=false;
function finish(){ if(FIN) return; FIN=true; try{ const d=+localStorage.getItem('almaMapDone')||0; if(d<LN) localStorage.setItem('almaMapDone',String(LN)); localStorage.setItem('almaJustDone','1');
  const key='almaT1L'+LN+'stars'; if(!localStorage.getItem(key)){ localStorage.setItem('almaPts',String((+localStorage.getItem('almaPts')||0)+EARN)); localStorage.setItem(key,'1'); } }catch(e){} }
$('nextL').onclick=()=>{ sfx.tap(); finish(); setTimeout(()=>location.href='t1.html?l='+(LN+1),150); };
/* audio map: phrase → file (filled when ElevenLabs files are added) */
window.AMAP={'сәлем алма':'salem_alma.mp3','сәлеметсіз бе':'salemetsiz_be.mp3','нан':'nan.mp3','нан бар ма':'nan_bar_ma.mp3','бар':'bar.mp3',
 'қанша тұрады':'qansha_turady.mp3','екі жүз теңге':'eki_juz.mp3','рақмет':'rakhmet.mp3','тоңазытқышта':'tonazytqyshta.mp3','сүт':'sut.mp3',
 'айран':'ayran.mp3','сүт бар ма':'sut_bar_ma.mp3','жеті жүз теңге':'zheti_juz.mp3','сау бол алма':'sau_bol_alma.mp3','сау болыңыз':'sau_bolynyz.mp3'};
let WHO='apa'; const _say=say; say=function(w,h,ms){ WHO=w; _say(w,h,ms); };
const _speak=speak; let CUR_A=null;
speak=function(t){ const k=norm(t); if(AMAP[k]){ try{ if(CUR_A) CUR_A.pause(); const a=new Audio('audio/'+AMAP[k]); if(WHO==='alma'){ a.preservesPitch=false; a.mozPreservesPitch=false; a.webkitPreservesPitch=false; a.playbackRate=1.18; } CUR_A=a; a.play().catch(()=>{}); }catch(e){} return; } _speak(t); };
