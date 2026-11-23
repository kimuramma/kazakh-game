/* ===== Shop lesson engine: lessons 3..10 of topic 1 ===== */
const CAT={
  milk:{src:'img/p/milk.png',kk:'Сүт',ru:'молоко',s:1},
  ayran:{src:'img/p/ayran.png',kk:'Айран',ru:'айран',s:1},
  smet:{src:'img/p/smetana.png',kk:'Қаймақ',ru:'сметана',s:.8},
  butter:{src:'img/p/butter.png',kk:'Сары май',ru:'сливочное масло',s:.68},
  cheese:{src:'img/p/cheese.png',kk:'Ірімшік',ru:'сыр',s:.7},
  kurt:{src:'img/p/kurt.png',kk:'Құрт',ru:'курт',s:.62},
  eggs:{src:'img/p/eggs.png',kk:'Жұмыртқа',ru:'яйца',s:.6},
  ice:{src:'img/p/icecream.png',kk:'Балмұздақ',ru:'мороженое',s:1},
  water:{src:'img/p/water.png',kk:'Су',ru:'вода',s:1},
  juice:{src:'img/p/juice.png',kk:'Шырын',ru:'сок',s:.95},
  tea:{src:'img/p/tea.png',kk:'Шай',ru:'чай',s:.85},
  sugar:{src:'img/p/sugar.png',kk:'Қант',ru:'сахар',s:.85},
  pear:{src:'img/p/pear.png',kk:'Алмұрт',ru:'груша',s:.9},
  grapes:{src:'img/p/grapes.png',kk:'Жүзім',ru:'виноград',s:.9},
  orange:{src:'img/p/orange.png',kk:'Апельсин',ru:'апельсин',s:.75},
  bread:{src:'img/bread.png',kk:'Нан',ru:'хлеб',s:.62}
};
const SLOTS={
  fridge:[[28,32],[28,68],[45,32],[45,68],[62,32],[62,68],[77.5,32],[77.5,68]],
  shelf:[[46,15],[46,38.5],[46,61.5],[46,85],[91,15],[91,38.5],[91,61.5],[91,85]]
};
let MODE='fridge', CUR=[], MISTAKES=0;
function setItems(mode,ids){ MODE=mode; CUR=ids; const big=$('bigF'); big.className=mode;
  const box=$('prods'); box.innerHTML='';
  ids.forEach((id,i)=>{ if(!id) return; const c=CAT[id], [row,x]=SLOTS[mode][i]; const d=document.createElement('div'); d.className='prod'; d.id='p_'+id;
    d.style.left=x+'%'; d.style.bottom=(100-row+0.5)+'%'; d.style.height=((mode==='fridge'?15:30)*c.s)+'%';
    d.innerHTML=`<img src="${c.src}" alt="${c.kk}">`; box.appendChild(d); });
  $('door').classList.toggle('open',mode!=='fridge'); }
function jokeFor(id){ const c=CAT[id]; return `Это ${c.kk} — ${c.ru}. Не то! 😉`; }
function pick(qHtml,ok,jokes){ return new Promise(res=>{
  $('q').innerHTML=qHtml; $('slot').style.display='none'; $('opts').innerHTML=''; panel(true);
  CUR.filter(Boolean).forEach(id=>{ const el=$('p_'+id); el.classList.remove('bad','ok','glow');
    el.onclick=async()=>{ ac();
      if(id===ok){ sfx.ok(); el.classList.add('ok'); sparks(el); alma('happy'); CUR.filter(Boolean).forEach(q=>$('p_'+q).onclick=null); await sleep(900); el.classList.remove('ok'); res(el); }
      else{ MISTAKES++; sfx.bad(); el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); alma('oops');
        $('opts').innerHTML=`<div id="learn" style="padding:1.6cqw 3cqw"><span style="font-size:4cqw">${(jokes&&jokes[id])||jokeFor(id)}</span></div>`; }
    }; });
}); }
function learn(id,extra){ const c=CAT[id], el=$('p_'+id); el.classList.add('glow');
  return new Promise(res=>{ $('q').innerHTML=`Новое слово! Нажми на ${extra||c.ru} 👆`; $('slot').style.display='none';
    $('opts').innerHTML=`<div id="learn" style="opacity:.35"><b>?</b><span>нажми на ${c.ru}</span></div>`; panel(true);
    el.onclick=()=>{ ac(); sfx.ok(); el.classList.remove('glow'); sparks(el); el.onclick=null;
      $('opts').innerHTML=`<div id="learn"><b>${c.kk}</b><span>= ${c.ru}</span></div>`; speak(c.kk); setTimeout(res,1900); }; }); }
function card(kk,ru,btn){ return new Promise(res=>{ $('q').innerHTML='Новое слово!'; $('slot').style.display='none';
  $('opts').innerHTML=`<div id="learn" style="width:100%"><b>${kk}</b><span>= ${ru}</span></div>`; speak(kk.replace(/[.…!?]/g,''));
  const b=document.createElement('button'); b.className='opt big'; b.textContent=btn||'Понятно 👍'; b.onclick=()=>{ac();sfx.tap();res()}; $('opts').appendChild(b); panel(true); }); }
async function openFridge(){ if(MODE!=='fridge'){ fridgeOpen(); await sleep(400); return; }
  $('fr').classList.add('glow');
  await new Promise(res=>{ $('q').innerHTML='Нажми на холодильник 👆'; $('slot').style.display='none'; $('opts').innerHTML=''; panel(true);
    $('fr').onclick=()=>{ ac(); sfx.tap(); $('fr').classList.remove('glow'); $('fr').onclick=null; hush(); fridgeOpen(); res(); }; });
  if(!$('door').classList.contains('open')){ $('q').innerHTML='Открой дверцу! 👆'; await doorOpen(); } }
async function greet(apa,spk,wrong){ say('apa',K(apa)+' 😊'); speak(spk);
  await ask('Апа здоровается. Что ответишь?<small>Нажми на слово Апы, чтобы увидеть перевод</small>',[{t:'Сәлеметсіз бе!',ok:true},...wrong]);
  RIG.wave(1500); say('alma',K('Сәлеметсіз бе','Здравствуйте')+', апа! 👋',1800); speak('Сәлеметсіз бе'); progress(); panel(false); await sleep(1700); hush(); }
async function almaSays(html,ms=2300){ RIG.talk(Math.min(ms,1800)); say('alma',html,ms); await sleep(ms+100); }
async function apaSays(html,spk,ms=2200){ say('apa',html); if(spk) speak(spk); await sleep(ms); }
async function price(apaTok,spk,q,opts,coins,tag){
  hush(); RIG.talk(1500); say('alma',K([['Қанша','сколько'],['тұрады?','стоит?']])); speak('Қанша тұрады'); await sleep(1800);
  say('apa',K(apaTok)); speak(spk); $('tagBox').style.opacity=1; $('tagBox').classList.add('pop'); $('tagTxt').textContent='?'; sfx.tap();
  await ask(q,opts); $('tagTxt').textContent=tag; sparks($('tagBox'),10); $('tagBox').classList.remove('pop'); progress(); panel(false); await sleep(600);
  hush(); for(let i=0;i<coins.n;i++){ const c=document.createElement('div'); c.className='coin abs'; c.textContent=coins.v;
    c.style.left=(VL+20)+'%'; c.style.top='50%'; G.appendChild(c); await sleep(30); c.style.left=(VL+34+i*4)+'%'; c.style.top='44%'; sfx.coin(); await sleep(380); setTimeout(()=>c.remove(),900); }
  await sleep(300); $('tagBox').style.opacity=0; }
async function bye(item,line){
  say('apa',K([['Мә,','вот,'],['ұста!','держи!']]));
  await ask('Скажи спасибо и попрощайся!',[
    {t:'Рақмет! Сау болыңыз!',ok:true},
    {t:'Сәлеметсіз бе!',react:'Это «здравствуйте» 🙃 А мы уходим!'},
    {t:'Нан бар ма?',react:'Хлеб? Мы за другим пришли 😄'}]);
  RIG.talk(1200); say('alma',K('Рақмет','Спасибо')+'! '+K('Сау болыңыз','До свидания')+'! 👋',2000); speak('Рақмет! Сау болыңыз'); panel(false); progress();
  await sleep(400); if(item){ $('alma').querySelector('.itm').src=CAT[item].src; RIG.hold(true); } alma('happy'); sparks($('almaBox'),20); await sleep(1500);
  if(line){ say('alma',line); await sleep(2100); } hush(); }

/* ===== lessons ===== */
const L={};
L[3]={title:'Масло и сметана',steps:7,reward:['lamp','Фонарь'],item:'butter',
 words:[['Сары май','Сливочное масло'],['Қаймақ','Сметана'],['Керек','Нужно'],['Маған … керек','Мне нужно …'],['Не керек?','Что нужно?'],['Төрт жүз','Четыреста']],
 fridge:['milk','ayran','smet','butter','cheese','eggs','juice','water'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!'],['Не','что'],['керек?','нужно?']],'Сәлем, Алма! Не керек?',[{t:'Құрт',react:'Курт? Мы за другим 😄'},{t:'Рақмет!',react:'Спасибо? Мы ещё ничего не купили!'}]);
  await almaSays('Мама печёт блины 🥞 Нужны масло и сметана!');
  await openFridge(); progress();
  await learn('butter','жёлтую пачку масла'); await learn('smet','стаканчик сметаны'); progress();
  await pick('Найди: <b style="color:#2f6f18">Қаймақ</b>','smet',{milk:'Сүт — молоко. Блины на молоке, но нужна сметана! 😉',cheese:'Ірімшік — сыр. Сыр на блины? Хм… 🤔'});
  await pick('А теперь: <b style="color:#2f6f18">Сары май</b>','butter',{cheese:'Это сыр! Тоже жёлтый, но с дырками 🧀',eggs:'Жұмыртқа — яйца. Почти, но нет! 🥚'});
  fridgeClose(); progress();
  await ask('Как по-казахски «сметана»?',[{t:'Құрт',react:'Құрт — курт, сухие солёные шарики!'},{t:'Қаймақ',ok:true},{t:'Сүт',react:'Сүт — молоко, ты его уже знаешь!'}]);
  await card('Керек','нужно · Маған … керек = мне нужно …');
  await build('Скажи: «Мне нужно масло»<small>Собери фразу</small>',['керек','Маған','май','сары','нан'],['Маған','сары','май','керек'],'Почти! Начни с «Маған» 😉');
  RIG.talk(1500); say('alma',K([['Маған','мне'],['сары май','масло'],['керек','нужно']]),1700); speak('Маған сары май керек'); panel(false); await sleep(1700); progress();
  await price([['Төрт','четыре'],['жүз','сто'],['теңге','тенге']],'Төрт жүз теңге','Сколько стоят масло и сметана?<small>Төрт = четыре</small>',
   [{t:'40 ₸',react:'Сорок? Так дёшево не бывает 😄'},{t:'400 ₸',ok:true},{t:'4000 ₸',react:'Четыре тысячи?! Это масло из золота? 💰'}],{n:4,v:'100'},'400 ₸');
  await bye('butter','Будут самые вкусные блины! 🥞💛');
 }};
L[4]={title:'Яйца',steps:7,reward:['bush','Куст'],item:'eggs',
 words:[['Жұмыртқа','Яйца'],['Қанша?','Сколько?'],['Бір','Один'],['Он','Десять'],['… беріңізші','Дайте, пожалуйста …'],['Абайла!','Осторожно!'],['Бес жүз','Пятьсот']],
 fridge:['milk','smet','butter','eggs','cheese','ice','water','ayran'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Жұмыртқа',react:'Сначала поздоровайся 🙈'},{t:'Сау болыңыз!',react:'Это «до свидания»! Мы только пришли!'}]);
  await almaSays('Хочу испечь торт 🎂 Нужны яйца!');
  await openFridge(); await learn('eggs','лоток с яйцами'); progress();
  fridgeClose();
  await apaSays(K([['Қанша','сколько'],['жұмыртқа?','яиц?']]),'Қанша жұмыртқа');
  await ask('Апа спрашивает: сколько яиц? Тебе нужно десять.<small>Бір = 1, Он = 10, Жүз = 100</small>',[
   {t:'Бір',react:'Одно яйцо? Торт будет размером с монетку 😄'},{t:'Он',ok:true},{t:'Жүз',react:'Сто яиц?! Мы же не птицеферма 🐔'}]);
  RIG.talk(1200); say('alma',K([['Он','десять'],['жұмыртқа!','яиц!']]),1500); speak('Он жұмыртқа'); panel(false); await sleep(1600); progress();
  await card('… беріңізші','дайте, пожалуйста … (вежливо)');
  await build('Попроси вежливо: «Дайте, пожалуйста, десять яиц»<small>Собери фразу</small>',['беріңізші','жұмыртқа','Сүт','Он'],['Он','жұмыртқа','беріңізші'],'Почти! Сначала число «Он» 😉');
  RIG.talk(1500); say('alma',K([['Он','десять'],['жұмыртқа','яиц'],['беріңізші','дайте, пожалуйста']]),1800); speak('Он жұмыртқа беріңізші'); panel(false); await sleep(1800); progress();
  await apaSays(K('Абайла!','Осторожно!')+' 🥚💥','Абайла',1600);
  RIG.mood('oops'); await sleep(500);
  await ask('Апа крикнула «Абайла!». Что это значит?',[{t:'Спасибо',react:'Спасибо — это «Рақмет» 😉'},{t:'Осторожно!',ok:true},{t:'Привет',react:'Привет — «Сәлем» 👋'}]);
  RIG.reset(); say('alma','Фух, ни одно не разбилось 😅',1800); panel(false); await sleep(1900); progress();
  await price([['Бес','пять'],['жүз','сто'],['теңге','тенге']],'Бес жүз теңге','Сколько стоят яйца?<small>Бес = пять</small>',
   [{t:'500 ₸',ok:true},{t:'50 ₸',react:'Пятьдесят — это «елу». А тут «бес жүз»! 😉'},{t:'5 ₸',react:'Пять тенге за десяток? Курица обидится 🐔'}],{n:5,v:'100'},'500 ₸');
  await bye('eggs','Несу аккуратно… очень аккуратно… 🥚😬');
 }};
L[5]={title:'Сыр и курт',steps:7,reward:['spruce','Ель'],item:'cheese',
 words:[['Ірімшік','Сыр'],['Құрт','Курт'],['Тұзды','Солёный'],['Тәтті','Сладкий'],['Дәмді','Вкусный'],['Өте','Очень'],['Елу','Пятьдесят']],
 shelf:['cheese','kurt','bread','tea','sugar','pear','grapes','orange'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Ірімшік',react:'Сначала поздороваемся 🙈'},{t:'Рақмет!',react:'Спасибо? Рановато 😄'}]);
  await almaSays('Апа, говорят, у вас самый вкусный курт! 🤩');
  await apaSays('Вот, смотри на прилавок! 👇','',1400); await openFridge();
  await learn('kurt','белые шарики'); await learn('cheese','кусок сыра'); progress();
  fridgeClose();
  await apaSays(K([['Татып','попробуй'],['көр!','на вкус!']])+' 😊','Татып көр');
  RIG.mood('oops'); say('alma','Ммм… Ой! 😝 '+K([['Тұзды!','Солёный!']]),2200); speak('Тұзды'); await sleep(2300); RIG.reset();
  await ask('Какой курт на вкус?<small>Нажми на слова Алмы для подсказки</small>',[{t:'Тәтті',react:'Тәтті — сладкий. Курт точно не сладкий 😝'},{t:'Тұзды',ok:true},{t:'Салқын',react:'Салқын — холодный. Курт не из холодильника!'}]);
  panel(false); progress();
  await openFridge();
  await pick('Апа хочет угостить и сыром. Найди: <b style="color:#2f6f18">Ірімшік</b>','cheese',{kurt:'Это курт, его уже пробовали 😝',bread:'Нан — хлеб 🍞'});
  fridgeClose(); progress();
  await card('Дәмді · Өте','вкусный · очень');
  await build('Скажи Апе: «Курт очень вкусный!»<small>Собери фразу</small>',['дәмді','тұзды','Құрт','өте'],['Құрт','өте','дәмді'],'Почти! Начни с «Құрт» 😉');
  RIG.talk(1500); say('alma',K([['Құрт','курт'],['өте','очень'],['дәмді!','вкусный!']]),1800); speak('Құрт өте дәмді'); panel(false); await sleep(1800);
  await apaSays('Рахмет, Алма! 😊 Апа покраснела от радости','',1800); progress();
  await price([['Екі','два'],['жүз','сто'],['елу','пятьдесят'],['теңге','тенге']],'Екі жүз елу теңге','Сколько стоят сыр и курт?<small>Елу = пятьдесят</small>',
   [{t:'250 ₸',ok:true},{t:'205 ₸',react:'«Елу» — это 50, а не 5 😉'},{t:'2500 ₸',react:'Две с половиной тысячи? Нет-нет 😄'}],{n:3,v:'100'},'250 ₸');
  await bye('cheese','Курт — в карман, сыр — домой! 🧀');
 }};
L[6]={title:'Чай и сахар',steps:7,reward:['garden_bed','Грядка'],item:'tea',
 words:[['Шай','Чай'],['Қант','Сахар'],['Мен','И (соединяет слова)'],['Тұз','Соль'],['Мың','Тысяча'],['Шай мен қант','Чай и сахар']],
 shelf:['tea','sugar','kurt','cheese','bread','orange','pear','grapes'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Шай',react:'Сначала поздороваемся, потом чай ☕'},{t:'Сау болыңыз!',react:'Уже уходим? Мы только пришли 😄'}]);
  await almaSays('Вечером придут гости! Нужен чай и сахар ☕');
  await apaSays('Қазақ шайсыз тұра алмайды! 😄<small>Казах без чая не может!</small>','',2300);
  await openFridge(); await learn('tea','красную коробку'); await learn('sugar','пакет сахара'); progress();
  fridgeClose();
  await ask('Что такое «Қант»?',[{t:'Соль',react:'Соль — «тұз». Солёный чай? Бррр 😖'},{t:'Сахар',ok:true},{t:'Чай',react:'Чай — «шай» ☕'}]);
  panel(false); progress();
  await card('Мен','и · Шай мен қант = чай и сахар');
  await build('Попроси: «Дайте, пожалуйста, чай и сахар»<small>Собери фразу</small>',['қант','мен','беріңізші','Шай','тұз'],['Шай','мен','қант','беріңізші'],'Почти! «Шай мен қант…» 😉');
  RIG.talk(1600); say('alma',K([['Шай','чай'],['мен','и'],['қант','сахар'],['беріңізші','дайте, пожалуйста']]),2000); speak('Шай мен қант беріңізші'); panel(false); await sleep(2000); progress();
  await openFridge();
  await pick('Апа отвлеклась. Возьми сама: <b style="color:#2f6f18">Қант</b>','sugar',{tea:'Шай уже нашли! Нужен қант 😉',kurt:'Құрт в чай? Это слишком смело 😆'});
  fridgeClose(); progress();
  await price([['Мың','тысяча'],['теңге','тенге']],'Мың теңге','Сколько стоят чай и сахар?<small>Мың = тысяча</small>',
   [{t:'100 ₸',react:'Сто — это «жүз». А «мың» больше! 😉'},{t:'1000 ₸',ok:true},{t:'10 ₸',react:'Десять тенге? Апа смеётся 😂'}],{n:1,v:'1000'},'1000 ₸');
  await bye('tea','Гости будут довольны! ☕💛');
 }};
L[7]={title:'Фрукты',steps:7,reward:['swing','Качели'],item:'grapes',
 words:[['Алмұрт','Груша'],['Жүзім','Виноград'],['Апельсин','Апельсин'],['Жеміс','Фрукт'],['Келі','Килограмм'],['Алты жүз','Шестьсот']],
 shelf:['pear','grapes','orange','kurt','tea','bread','cheese','sugar'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Алмұрт',react:'Сначала поздороваемся 🙈'},{t:'Рақмет!',react:'Спасибо? Рановато 😄'}]);
  await almaSays('Хочу фруктов! Только не яблоко… это же я 🍎😅');
  await apaSays(K([['Жемістер','фрукты'],['мұнда!','здесь!']])+' 🍇','Жемістер мұнда');
  await openFridge(); await learn('pear','грушу'); await learn('grapes','виноград'); await learn('orange','апельсин'); progress();
  fridgeClose();
  await ask('Как по-казахски «груша»?',[{t:'Алма',react:'Алма — это Я!! 😤🍎'},{t:'Алмұрт',ok:true},{t:'Жүзім',react:'Жүзім — виноград 🍇'}]);
  panel(false); progress();
  await apaSays(K([['Жүзім','виноград'],['өте','очень'],['тәтті!','сладкий!']]),'Жүзім өте тәтті');
  await ask('Что сказала Апа?<small>Нажми на её слова для подсказки</small>',[{t:'Виноград очень сладкий',ok:true},{t:'Виноград очень солёный',react:'Солёный — «тұзды». Это про курт 😝'},{t:'Виноград кончился',react:'Нет-нет, его полно! 🍇'}]);
  panel(false); progress();
  await card('Келі','килограмм · Бір келі = один килограмм');
  await build('Попроси: «Дайте, пожалуйста, килограмм винограда»<small>Собери фразу</small>',['жүзім','беріңізші','Бір','келі','алма'],['Бір','келі','жүзім','беріңізші'],'Почти! «Бір келі…» 😉');
  RIG.talk(1600); say('alma',K([['Бір','один'],['келі','кило'],['жүзім','винограда'],['беріңізші','дайте, пожалуйста']]),2000); speak('Бір келі жүзім беріңізші'); panel(false); await sleep(2000);
  await openFridge(); await pick('Положи в пакет: <b style="color:#2f6f18">Жүзім</b>','grapes',{pear:'Это алмұрт — груша 🍐',orange:'Это апельсин 🍊'}); fridgeClose(); progress();
  await price([['Алты','шесть'],['жүз','сто'],['теңге','тенге']],'Алты жүз теңге','Сколько стоит килограмм винограда?<small>Алты = шесть</small>',
   [{t:'600 ₸',ok:true},{t:'60 ₸',react:'Шестьдесят — это «алпыс» 😉'},{t:'6000 ₸',react:'Шесть тысяч? Это золотой виноград? ✨'}],{n:6,v:'100'},'600 ₸');
  await bye('grapes','Витамины! 💪🍇');
 }};
L[8]={title:'Вода и сок',steps:7,reward:['well','Колодец'],item:'juice',
 words:[['Су','Вода'],['Шырын','Сок'],['Салқын','Холодный, прохладный'],['Ыстық','Жарко, горячий'],['Маған су керек','Мне нужна вода'],['Жүз елу','Сто пятьдесят']],
 fridge:['water','juice','milk','ayran','smet','butter','ice','eggs'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Су',react:'Сначала поздороваемся 🙈'},{t:'Сау болыңыз!',react:'Мы только пришли 😄'}]);
  await almaSays('Уфф… '+K('Ыстық!','Жарко!')+' 🥵 Хочу пить!');
  await ask('Алма сказала «Ыстық!». Что это значит?',[{t:'Жарко!',ok:true},{t:'Холодно!',react:'Холодно — «суық» 🥶'},{t:'Вкусно!',react:'Вкусно — «дәмді» 😋'}]);
  panel(false); progress();
  await openFridge(); await learn('juice','коробку сока'); progress();
  await apaSays(K([['Салқын','холодная'],['су','вода'],['да','тоже'],['бар!','есть!']]),'Салқын су да бар');
  await card('Салқын','холодный, прохладный');
  await pick('Найди: <b style="color:#2f6f18">Су</b>','water',{milk:'Сүт — молоко. Су и сүт — не близнецы! 💧',ice:'Мороженое тоже холодное, но это не вода 🍦'});
  fridgeClose(); progress();
  await build('Скажи: «Мне нужна холодная вода»<small>Собери фразу</small>',['керек','салқын','Маған','су','ыстық'],['Маған','салқын','су','керек'],'Почти! «Маған салқын су…» 😉');
  RIG.talk(1600); say('alma',K([['Маған','мне'],['салқын','холодная'],['су','вода'],['керек','нужна']]),1900); speak('Маған салқын су керек'); panel(false); await sleep(1900); progress();
  await price([['Жүз','сто'],['елу','пятьдесят'],['теңге','тенге']],'Жүз елу теңге','Сколько стоит вода?',
   [{t:'150 ₸',ok:true},{t:'50 ₸',react:'«Елу» — 50, но ещё есть «жүз» 😉'},{t:'1500 ₸',react:'Полторы тысячи за воду? Это из горного ледника? 🏔️'}],{n:2,v:'100'},'150 ₸');
  $('alma').querySelector('.itm').src=CAT.water.src; RIG.hold(true); await almaSays('Буль-буль-буль… Ааах! 😌💧',1800);
  await bye('water','Теперь жить можно! 💧');
 }};
L[9]={title:'Полная корзина',steps:7,reward:['fountain','Фонтан'],item:null,
 words:[['Себет','Корзина'],['Тізім','Список'],['Барлығы','Всё, всего'],['Барлығы қанша?','Сколько за всё?'],['Екі мың','Две тысячи']],
 shelf:['bread','milk','eggs','pear','tea','cheese','juice','kurt'],
 async run(){
  await greet([['Сәлем,','привет,'],['Алма!','Алма!']],'Сәлем, Алма',[{t:'Себет',react:'Сначала поздороваемся 🙈'},{t:'Рақмет!',react:'Рано благодарить 😄'}]);
  await almaSays('Мама дала большой список! 📝 Будем собирать корзину!');
  await card('Себет · Тізім','корзина · список');
  await apaSays(K([['Міне,','вот,'],['себет!','корзина!']])+' 🧺','Міне, себет',1800); progress();
  await openFridge();
  const list=[['bread','Нан'],['milk','Сүт'],['eggs','Жұмыртқа'],['pear','Алмұрт']];
  for(const [id,kk] of list){
    await pick(`Список мамы 📝: найди <b style="color:#2f6f18">${kk}</b><small>Перевода нет — вспоминай! 💪</small>`,id,{kurt:'Құрт не в списке, хотя очень хочется 😝'});
    $('p_'+id).style.opacity=.25;
  }
  fridgeClose(); progress();
  say('alma','Нан ✓ Сүт ✓ Жұмыртқа ✓ Алмұрт ✓ Всё! 🧺',2000); await sleep(2100); progress();
  await card('Барлығы','всё, всего · Барлығы қанша? = сколько за всё?');
  await build('Спроси: «Сколько за всё?»<small>Собери фразу</small>',['қанша?','Барлығы','бар','ма?'],['Барлығы','қанша?'],'Почти! Начни с «Барлығы» 😉');
  RIG.talk(1200); say('alma',K([['Барлығы','всего'],['қанша?','сколько?']]),1500); speak('Барлығы қанша'); panel(false); await sleep(1600); progress();
  say('apa',K([['Екі','две'],['мың','тысячи'],['теңге','тенге']])); speak('Екі мың теңге'); $('tagBox').style.opacity=1; $('tagBox').classList.add('pop');
  await ask('Сколько стоит вся корзина?',[{t:'200 ₸',react:'Это «екі жүз» 😉 А тут «мың»!'},{t:'2000 ₸',ok:true},{t:'20000 ₸',react:'Двадцать тысяч?! Тогда я оставлю курт 😅'}]);
  $('tagTxt').textContent='2000 ₸'; sparks($('tagBox'),10); $('tagBox').classList.remove('pop'); panel(false); progress();
  for(let i=0;i<2;i++){ const c=document.createElement('div'); c.className='coin abs'; c.textContent='1000'; c.style.left=(VL+20)+'%'; c.style.top='50%'; G.appendChild(c); await sleep(30); c.style.left=(VL+34+i*5)+'%'; c.style.top='44%'; sfx.coin(); await sleep(400); setTimeout(()=>c.remove(),900); }
  $('tagBox').style.opacity=0;
  await bye(null,'Корзина полная! Мама будет в восторге 🧺💛');
 }};
L[10]={title:'Тест',test:true,steps:10,reward:['gazebo','Беседка'],item:null,words:[],
 shelf:['bread','milk','eggs','cheese','tea','sugar','pear','water'],
 async run(){
  await almaSays('Тест! Без подсказок — проверим, что ты запомнила 💪',2400);
  const Q=[
   ()=>ask('1/10 · «Нан» — это…',[{t:'Хлеб',ok:true},{t:'Вода'},{t:'Молоко'}]),
   ()=>ask('2/10 · Как по-казахски «молоко»?',[{t:'Су'},{t:'Сүт',ok:true},{t:'Шай'}]),
   ()=>ask('3/10 · «Қанша тұрады?» значит…',[{t:'Что нужно?'},{t:'Где это?'},{t:'Сколько стоит?',ok:true}]),
   async()=>{ await openFridge(); await pick('4/10 · Найди: <b>Жұмыртқа</b>','eggs'); fridgeClose(); },
   ()=>ask('5/10 · «Үш жүз теңге» — это…',[{t:'30 ₸'},{t:'300 ₸',ok:true},{t:'3000 ₸'}]),
   ()=>build('6/10 · Собери: «Хлеб есть?»',['ма?','бар','Нан','керек'],['Нан','бар','ма?'],'Нан… бар… ма? 😉'),
   async()=>{ await openFridge(); await pick('7/10 · Найди: <b>Қант</b>','sugar'); fridgeClose(); },
   ()=>ask('8/10 · «Құрт тұзды» значит…',[{t:'Курт сладкий'},{t:'Курт солёный',ok:true},{t:'Курт холодный'}]),
   ()=>build('9/10 · Собери: «Мне нужна вода»',['керек','су','Маған','бар'],['Маған','су','керек'],'Маған… су… керек 😉'),
   ()=>ask('10/10 · Уходя из магазина, говорим…',[{t:'Сәлеметсіз бе!'},{t:'Сау болыңыз!',ok:true},{t:'Абайла!'}])
  ];
  for(const q of Q){ await q(); panel(false); progress(); await sleep(350); }
 }};

/* ===== run ===== */
const LN=+(new URLSearchParams(location.search).get('l')||3); const CFG=L[LN]||L[3];
LESSON=(CFG.test?'Тест. Магазин у дома':'Урок '+LN+'. '+CFG.title); WORDS=CFG.words; TOTAL=CFG.steps;
document.title=(CFG.test?'Тест':'Урок '+LN)+' — '+CFG.title;
async function lesson(){
  stepN=0; MISTAKES=0; $('barfill').style.width='0'; $('result').classList.remove('on'); hush(); if(RIG) RIG.reset();
  setItems(CFG.fridge?'fridge':'shelf',CFG.fridge||CFG.shelf); if(CFG.fridge) $('door').classList.remove('open');
  await toScene('shop');
  await CFG.run();
  $('barfill').style.width='100%';
  addWords(); sfx.win();
  $('resTitle').textContent=CFG.test?(MISTAKES<=3?'Тест пройден! 🏆':'Тест пройден! 👍'):'Урок '+LN+' пройден! 🎉';
  $('resSub').textContent=CFG.test?('Ошибок: '+MISTAKES+(MISTAKES===0?' — идеально! 🌟':'')):'Новые слова добавлены в словарь 📖';
  $('newWords').innerHTML=WORDS.map(([k])=>`<span>${k}</span>`).join('');
  $('rewImg').src='yard/img/'+CFG.reward[0]+'.png'; $('rewName').textContent='+1 '+CFG.reward[1]+(CFG.test?' · +50 ⭐':'');
  $('result').classList.add('on');
}
function finish(){ try{ const d=+localStorage.getItem('almaMapDone')||0; if(d<LN) localStorage.setItem('almaMapDone',String(LN)); localStorage.setItem('almaJustDone','1');
  const key='almaL'+LN+'reward';
  if(!localStorage.getItem(key)){ const S=JSON.parse(localStorage.getItem('almaHome')||'null')||{lessons:1,inv:{flowerbed:2,bush:1,spruce:1,paving:6},placed:{},paved:{},house:0};
    const r=CFG.reward[0]; S.inv[r]=(S.inv[r]||0)+1; S.lessons=Math.max(S.lessons||1,LN+1); localStorage.setItem('almaHome',JSON.stringify(S)); localStorage.setItem(key,'1');
    if(CFG.test){ localStorage.setItem('almaPts',String((+localStorage.getItem('almaPts')||0)+50)); } } }catch(e){} }
