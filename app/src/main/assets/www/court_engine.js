/* ===== Court (yard & neighbours) lesson engine: topic 2 ===== */
let MISTAKES=0;
const NAME={apa:'<small style="display:block;color:#2f6f18;font-size:3cqw;margin:0 0 .6cqw">Апа-соседка</small>'};
function nb(html,ms){ const b=$('nbSay'); b.innerHTML='<small style="display:block;color:#b07a00;font-size:3cqw;margin:0 0 .6cqw;font-weight:900">Банан 🍌</small>'+html; b.classList.add('on'); clearTimeout(b._t); if(ms) b._t=setTimeout(()=>b.classList.remove('on'),ms); }
function apa(html,ms){ say('apa',NAME.apa+html,ms); }
function hushAll(){ hush(); $('nbSay').classList.remove('on'); }
function show(id,on=true){ $(id).classList.toggle('off',!on); if(on){ $(id).classList.remove('hop'); void $(id).offsetWidth; $(id).classList.add('hop'); } }
async function almaSays(html,ms=2300){ RIG.talk(Math.min(ms,1800)); say('alma',html,ms); await sleep(ms+100); }
async function nbSays(html,spk,ms=2300){ show('cNb'); nb(html,ms); if(spk) speak(spk); await sleep(ms+100); }
async function apaSays(html,spk,ms=2300){ apa(html,ms); if(spk) speak(spk); await sleep(ms+100); }
function card(kk,ru,btn){ return new Promise(res=>{ $('q').innerHTML='Новое слово!'; $('slot').style.display='none';
  $('opts').innerHTML=`<div id="learn" style="width:100%"><b style="font-size:6.4cqw">${kk}</b><span>= ${ru}</span></div>`; speak(kk.replace(/[.…!?·]/g,' '));
  const b=document.createElement('button'); b.className='opt big'; b.textContent=btn||'Понятно 👍'; b.onclick=()=>{ac();sfx.tap();res()}; $('opts').appendChild(b); panel(true); }); }
// hotspots on the background (percent of scene)
const SPOT={roof:[2,24,52,12],win:[20,41,30,10],door:[55,41,9,12],tree:[60,21,40,23],flow:[0,49,55,8],bench:[0,68,22,18],sky:[0,2,100,16],grass:[22,62,30,6]};
function spotsOn(ids){ const box=$('spots'); box.innerHTML='';
  ids.forEach(id=>{ const [x,y,w,h]=SPOT[id]; const d=document.createElement('div'); d.className='spot'; d.id='s_'+id;
    d.style.left=x+'%'; d.style.top=y+'%'; d.style.width=w+'%'; d.style.height=h+'%'; box.appendChild(d); }); }
function el(id){ return (id.startsWith('c')&&$(id))?$(id):$('s_'+id); }
// learn: tap the glowing thing
function learn(id,kk,ru,hint){ const e=el(id); e.classList.add('glow');
  return new Promise(res=>{ $('q').innerHTML='Новое слово! Нажми '+(hint||'на то, что светится')+' 👆'; $('slot').style.display='none';
    $('opts').innerHTML='<div id="learn" style="opacity:.35"><b>?</b><span>нажми</span></div>'; panel(true);
    e.onclick=()=>{ ac(); sfx.ok(); e.classList.remove('glow'); sparks(e); e.onclick=null;
      $('opts').innerHTML=`<div id="learn"><b>${kk}</b><span>= ${ru}</span></div>`; speak(kk); setTimeout(res,1900); }; }); }
// find: tap the right one among several
function find(q,ok,ids,jokes){ return new Promise(res=>{ $('q').innerHTML=q; $('slot').style.display='none'; $('opts').innerHTML=''; panel(true);
  ids.forEach(id=>{ const e=el(id); e.onclick=async()=>{ ac();
    if(id===ok){ sfx.ok(); e.classList.add('glow'); sparks(e); alma('happy'); ids.forEach(i=>el(i).onclick=null); await sleep(900); e.classList.remove('glow'); res(); }
    else{ MISTAKES++; sfx.bad(); e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); alma('oops');
      $('opts').innerHTML=`<div id="learn" style="padding:1.6cqw 3cqw"><span style="font-size:4cqw">${(jokes&&jokes[id])||'Не то! Попробуй ещё 😉'}</span></div>`; } }; }); }); }
async function talk(html,spk,ms=1800){ RIG.talk(ms); say('alma',html,ms); if(spk) speak(spk); await sleep(ms+100); }
async function done(){ panel(false); progress(); await sleep(300); hushAll(); }

const L={};
L[1]={title:'Знакомство',steps:6,reward:['flowerbed','Клумба'],
 words:[['Менің атым …','Меня зовут …'],['Сенің атың кім?','Как тебя зовут?'],['Мен','Я'],['Сен','Ты'],['Қуаныштымын!','Очень рад(а)!'],['Сәлем!','Привет!']],
 async run(){
  await almaSays('Ого, у нас новый сосед! 👀');
  await nbSays(K([['Сәлем!','Привет!']])+' 👋','Сәлем');
  await ask('Сосед говорит «Сәлем!». Ответь так же — по-дружески!',[{t:'Сәлем!',ok:true},{t:'Сау бол!',react:'Это «пока»! Мы же только встретились 🙈'},{t:'Нан',react:'Хлеб?! Сосед удивлён 😄'}]);
  await talk(K('Сәлем!','Привет!')+' 👋','Сәлем'); await done();
  await nbSays(K([['Менің','моё'],['атым','имя'],['Банан!','Банан!']]),'Менің атым Банан',2600);
  await card('Менің атым …','меня зовут … (досл. «моё имя …»)');
  await ask('Как зовут соседа?',[{t:'Апа'},{t:'Банан',ok:true},{t:'Алма',react:'Алма — это ты! 🍎'}]); await done();
  await build('Представься: «Меня зовут Алма»<small>Собери фразу</small>',['Алма','атым','Менің','Банан'],['Менің','атым','Алма'],'Почти! «Менің атым…» 😉');
  await talk(K([['Менің','моё'],['атым','имя'],['Алма!','Алма!']]),'Менің атым Алма'); await done();
  await nbSays(K([['Алма?!','Алма?!']])+' Яблоко? А я думал, ты помидор 🍅😆','Алма',2600);
  RIG.mood('oops'); await sleep(600);
  await card('Сенің атың кім?','как тебя зовут?');
  await ask('Ты хочешь спросить имя у кота. Что скажешь?',[{t:'Сенің атың кім?',ok:true},{t:'Менің атым Алма',react:'Это про тебя. А надо спросить его 😉'},{t:'Қанша тұрады?',react:'Кот не продаётся! 😹'}]);
  show('cCat'); await talk(K([['Сенің','твоё'],['атың','имя'],['кім?','кто?']]),'Сенің атың кім'); await sleep(300);
  await nbSays('Это Мырза. Он не разговаривает, только «мяу» 😸',null,2400); await done();
  await nbSays(K('Қуаныштымын!','Очень рад!')+' 😊','Қуаныштымын',2200);
  await ask('Что сказал Банан?',[{t:'Очень рад!',ok:true},{t:'Мне грустно',react:'Нет-нет, он улыбается! 😄'},{t:'До свидания',react:'Это «Сау бол» 👋'}]); await done();
 }};
L[2]={title:'Как дела?',steps:6,reward:['paving','Брусчатка'],
 words:[['Қалайсың?','Как дела? (другу)'],['Қалайсыз?','Как у Вас дела? (вежливо)'],['Жақсы','Хорошо'],['Тамаша!','Отлично!'],['Жаман емес','Неплохо'],['Өзің қалайсың?','А ты как?']],
 async run(){
  await apaSays(K([['Қалайсың,','как дела,'],['Алма?','Алма?']])+' 😊','Қалайсың, Алма',2500);
  await card('Қалайсың?','как дела? (другу, младшему)');
  await ask('Апа спрашивает, как дела. Как ответить «хорошо»?',[{t:'Жақсы!',ok:true},{t:'Жаман!',react:'Жаман — плохо 😢 У тебя же всё хорошо!'},{t:'Банан!',react:'Банан — это сосед 😄'}]);
  await talk(K([['Жақсы,','хорошо,'],['рақмет!','спасибо!']]),'Жақсы, рақмет'); await done();
  await card('Қалайсыз?','как у Вас дела? (вежливо — старшим)');
  await ask('Спроси у Апы вежливо: «А у Вас как дела?»',[{t:'Өзіңіз қалайсыз?',ok:true},{t:'Сен қалайсың?',react:'Старшим говорим на «Вы» — «қалайсыз» 🙏'},{t:'Қанша тұрады?',react:'Мы не в магазине 😄'}]);
  await talk(K([['Өзіңіз','а Вы'],['қалайсыз?','как?']]),'Өзіңіз қалайсыз'); await sleep(200);
  await apaSays(K([['Тамаша!','Отлично!']])+' 🌸','Тамаша'); await done();
  await card('Тамаша!','отлично!');
  show('cNb'); RIG.mood('happy');
  await nbSays('Ой-ой-ой… '+K([['Жаман…','плохо…']])+' Я поскользнулся… на своей же кожуре 🍌😵','Жаман',3000);
  await ask('Банану плохо или хорошо?',[{t:'Плохо 😵',ok:true},{t:'Отлично',react:'Он же упал! 😅'}]); await done();
  await build('Спроси Банана по-дружески: «А ты как?»',['қалайсың?','Өзің','қалайсыз?'],['Өзің','қалайсың?'],'Другу — «қалайсың», без «-ыз» 😉');
  await talk(K([['Өзің','а ты'],['қалайсың?','как?']]),'Өзің қалайсың');
  await nbSays(K([['Жаман','плохо'],['емес!','не!']])+' Уже неплохо 😁','Жаман емес',2400);
  await card('Жаман емес','неплохо (досл. «не плохо»)'); await done();
  await ask('Расставь по порядку: что лучше всего?',[{t:'Тамаша!',ok:true},{t:'Жаман емес',react:'Это «неплохо». А есть лучше! 😉'},{t:'Жаман',react:'Это «плохо» 😢'}]); await done();
 }};
L[3]={title:'Откуда ты?',steps:6,reward:['lamp','Фонарь'],
 words:[['Қайдансың?','Откуда ты?'],['Мен … -данмын','Я из …'],['Алматыданмын','Я из Алматы'],['Қала','Город'],['Ауыл','Село'],['Қай жерде?','Где?']],
 async run(){
  show('cNb');
  await nbSays(K([['Алма,','Алма,'],['қайдансың?','откуда ты?']]),'Алма, қайдансың',2400);
  await card('Қайдансың?','откуда ты?');
  await apaSays('Подсказка: Алматы — «город яблок»! 🍎 Алма — яблоко, Алматы — …','',2800);
  await card('Алматыданмын','я из Алматы · -дан/-нан = «из»');
  await build('Ответь: «Я из Алматы»',['Алматыданмын','Мен','Банан'],['Мен','Алматыданмын'],'«Мен» — я, потом откуда 😉');
  await talk(K([['Мен','я'],['Алматыданмын!','из Алматы!']])+' 🍎','Мен Алматыданмын'); await done();
  await ask('Где живёт Алма?',[{t:'В Алматы',ok:true},{t:'В Астане',react:'Нет, Алма — из «города яблок» 🍎'},{t:'В холодильнике',react:'Это молоко живёт в холодильнике 🥛😄'}]); await done();
  await ask('Спроси Банана: «А ты откуда?»',[{t:'Сен қайдансың?',ok:true},{t:'Қанша жастасың?',react:'Это про возраст — следующий урок 😉'},{t:'Қалайсың?',react:'Это «как дела?» 😊'}]);
  await talk(K([['Сен','ты'],['қайдансың?','откуда?']]),'Сен қайдансың');
  await nbSays(K([['Мен','я'],['Африкаданмын!','из Африки!']])+' 🌴 Приехал в гости!','Мен Африкаданмын',2800); await done();
  await ask('«Африкаданмын» значит…',[{t:'Я из Африки',ok:true},{t:'Я в Африку',react:'«-дан» — это «из», а не «в» 😉'},{t:'Я люблю Африку',react:'Нет, тут про то, откуда он 🌴'}]); await done();
  await apaSays(K([['Мен','я'],['ауылданмын','из села']])+' 🐑 А сейчас живу здесь, рядом с вами.','Мен ауылданмын',2800);
  await card('Ауыл · Қала','село · город');
  await ask('Апа из села. Как по-казахски «село»?',[{t:'Қала',react:'Қала — город 🏙️'},{t:'Ауыл',ok:true},{t:'Аула',react:'Аула — двор. Очень похоже! 😄'}]); await done();
 }};
L[4]={title:'Сколько лет?',steps:6,reward:['bench','Скамейка'],
 words:[['Неше жастасың?','Сколько тебе лет?'],['… жастамын','Мне … лет'],['Жеті','Семь'],['Сегіз','Восемь'],['Тоғыз','Девять'],['Алпыс','Шестьдесят']],
 async run(){
  show('cNb');
  await nbSays(K([['Неше','сколько'],['жастасың?','тебе лет?']]),'Неше жастасың',2300);
  await card('Неше жастасың?','сколько тебе лет?');
  await card('Жеті · Сегіз · Тоғыз','семь · восемь · девять');
  await build('Ответь: «Мне семь лет»',['жастамын','Мен','жеті','сегіз'],['Мен','жеті','жастамын'],'«Мен жеті жастамын» 😉');
  await talk(K([['Мен','я'],['жеті','семь'],['жастамын','лет']]),'Мен жеті жастамын'); await done();
  await nbSays(K([['Мен','я'],['сегіз','восемь'],['жастамын!','лет!']])+' Я старше! 😎','Мен сегіз жастамын',2600);
  await ask('Сколько лет Банану?',[{t:'7'},{t:'8',ok:true},{t:'9'}]); await done();
  show('cCat');
  await nbSays('А коту Мырзе — '+K([['тоғыз','девять']])+'! У него девять жизней 😸','тоғыз',2800);
  await ask('«Тоғыз» — это…',[{t:'6'},{t:'8'},{t:'9',ok:true}]); await done();
  await ask('Спроси возраст у Апы — вежливо!',[{t:'Неше жастасыз?',ok:true},{t:'Неше жастасың?',react:'Старшим — на «Вы»: жастасыз 🙏'}]);
  await talk(K([['Неше','сколько'],['жастасыз?','Вам лет?']]),'Неше жастасыз');
  await apaSays(K([['Алпыс','шестьдесят'],['жастамын!','мне лет!']])+' А душой — двадцать 💃','Алпыс жастамын',2800);
  await card('Алпыс','шестьдесят'); await done();
  await ask('Посчитай: жеті + бір = ?',[{t:'Сегіз',ok:true},{t:'Тоғыз',react:'Тоғыз — девять. Многовато 😉'},{t:'Алты',react:'Алты — шесть. Маловато 😉'}]); await done();
 }};
L[5]={title:'Мой дом',steps:6,reward:['bush','Куст'],
 words:[['Үй','Дом'],['Шатыр','Крыша'],['Терезе','Окно'],['Есік','Дверь'],['Әдемі','Красивый'],['Бұл','Это']],
 async run(){
  spotsOn(['roof','win','door']);
  await apaSays('Это мой дом! Нравится? 🏡','',2000);
  await card('Үй · Бұл','дом · это');
  await learn('roof','Шатыр','крыша','на голубую крышу');
  await learn('win','Терезе','окно','на окна');
  await learn('door','Есік','дверь','на дверь'); await done();
  await find('Найди: <b style="color:#2f6f18">Есік</b>','door',['roof','win','door'],{roof:'Шатыр — крыша 🏠',win:'Терезе — окно 🪟'}); await done();
  await find('Найди: <b style="color:#2f6f18">Терезе</b>','win',['roof','win','door'],{roof:'Шатыр — крыша 🏠',door:'Есік — дверь 🚪'}); await done();
  await card('Әдемі','красивый');
  await build('Скажи Апе: «Дом очень красивый!»',['әдемі','Үй','өте','тұзды'],['Үй','өте','әдемі'],'«Үй өте әдемі» 😉');
  await talk(K([['Үй','дом'],['өте','очень'],['әдемі!','красивый!']]),'Үй өте әдемі');
  await apaSays(K('Рақмет!','Спасибо!')+' Заходи на чай ☕','Рақмет',2200); await done();
  show('cNb'); await nbSays('А у меня дом — это кожура! 🍌 Тоже әдемі?',null,2600);
  await ask('Что ответишь Банану? «Очень красивый!»',[{t:'Өте әдемі!',ok:true},{t:'Өте тұзды!',react:'Солёный?! Банан обиделся 😤'}]); await done();
 }};
L[6]={title:'Двор',steps:6,reward:['spruce','Ель'],
 words:[['Аула','Двор'],['Ағаш','Дерево'],['Гүл','Цветок'],['Орындық','Скамейка'],['Биік','Высокий'],['Алма ағашы','Яблоня']],
 async run(){
  spotsOn(['tree','flow','bench']);
  await almaSays('Какой у нас красивый '+K('аула','двор')+'! 🌳');
  await card('Аула','двор');
  await learn('tree','Ағаш','дерево','на дерево');
  await learn('flow','Гүл','цветы','на цветы');
  await learn('bench','Орындық','скамейка','на скамейку'); await done();
  await find('Найди: <b style="color:#2f6f18">Орындық</b>','bench',['tree','flow','bench'],{tree:'Ағаш — дерево 🌳',flow:'Гүл — цветы 🌸'}); await done();
  await apaSays('Это '+K([['алма','яблоневое'],['ағашы','дерево']])+' — яблоня! 🍎','алма ағашы',2400);
  RIG.mood('oops'); await almaSays('Ой… там мои родственники висят?! 😳🍎',2300); RIG.reset(); await done();
  await card('Биік','высокий');
  await build('Скажи: «Дерево очень высокое»',['биік','Ағаш','өте','гүл'],['Ағаш','өте','биік'],'«Ағаш өте биік» 😉');
  await talk(K([['Ағаш','дерево'],['өте','очень'],['биік!','высокое!']]),'Ағаш өте биік'); await done();
  await ask('Что такое «Гүл»?',[{t:'Цветок',ok:true},{t:'Двор',react:'Двор — «аула» 😉'},{t:'Дерево',react:'Дерево — «ағаш» 🌳'}]); await done();
 }};
L[7]={title:'Цвета',steps:6,reward:['garden_bed','Грядка'],
 words:[['Қызыл','Красный'],['Сары','Жёлтый'],['Жасыл','Зелёный'],['Көк','Синий, голубой'],['Ақ','Белый'],['Түс','Цвет']],
 async run(){
  show('cNb'); show('cDog'); spotsOn(['sky','grass']);
  await card('Түс','цвет');
  await card('Қызыл','красный — как Алма! 🍎');
  await nbSays('А я — '+K([['сары!','жёлтый!']])+' 💛','сары',2000);
  await learn('sky','Көк','синий, голубой','на небо');
  await learn('grass','Жасыл','зелёный','на траву');
  await learn('cDog','Ақ','белый','на щенка'); await done();
  await find('Найди что-то <b style="color:#2f6f18">сары</b>','cNb',['cNb','cDog','sky','grass'],{cDog:'Щенок — ақ, белый 🐶',sky:'Небо — көк 💙',grass:'Трава — жасыл 💚'}); await done();
  await find('Найди что-то <b style="color:#2f6f18">көк</b>','sky',['cNb','cDog','sky','grass'],{cNb:'Банан — сары 💛',cDog:'Щенок — ақ 🤍',grass:'Трава — жасыл 💚'}); await done();
  await ask('Какого цвета Алма?',[{t:'Қызыл',ok:true},{t:'Жасыл',react:'Зелёные яблоки бывают, но Алма — красная! ❤️'},{t:'Көк',react:'Синее яблоко?! 😱'}]); await done();
  await nbSays('А если я перезрею, стану… '+K([['қоңыр','коричневым']])+' 😱','қоңыр',2500);
  await ask('Собери: «Банан жёлтый»',[{t:'Банан сары',ok:true},{t:'Банан қызыл',react:'Красный банан? Нет 😄'},{t:'Банан ақ',react:'Ақ — белый 🤍'}]); await done();
 }};
L[8]={title:'Кто это? Что это?',steps:6,reward:['swing','Качели'],
 words:[['Бұл кім?','Кто это? (о человеке)'],['Бұл не?','Что это? (о предмете, животном)'],['Мысық','Кошка, кот'],['Ит','Собака'],['Көршім','Мой сосед'],['Досым','Мой друг']],
 async run(){
  show('cCat'); show('cDog'); show('cNb');
  await card('Бұл кім? · Бұл не?','кто это? (о людях) · что это? (о вещах и животных)');
  await learn('cCat','Мысық','кошка, кот','на кота');
  await learn('cDog','Ит','собака','на щенка'); await done();
  await apaSays(K([['Бұл','это'],['не?','что?']])+' 👉🐱','Бұл не',1800);
  await ask('Апа показывает на кота. Ответь!',[{t:'Бұл — мысық',ok:true},{t:'Бұл — ит',react:'Ит — собака 🐶 А это кот!'},{t:'Бұл — Банан',react:'Банан обиделся: он не кот! 😤'}]); await done();
  await ask('О ком спрашивают «Бұл кім?»',[{t:'О человеке',ok:true},{t:'О собаке',react:'О животных — «Бұл не?» 😉'},{t:'О дереве',react:'О вещах — «Бұл не?» 🌳'}]); await done();
  await card('Көршім · Досым','мой сосед · мой друг');
  await find('Где <b style="color:#2f6f18">көршім</b> Апа?','cApa',['cApa','cNb','cCat','cDog'],{cNb:'Банан — досым, друг 🍌',cCat:'Это мысық 🐱',cDog:'Это ит 🐶'}); await done();
  await nbSays('Эй! Ит гоняется за мысықом! 🐶💨🐱',null,2200);
  $('cDog').style.left='calc(var(--vl,0%) + 70%)'; $('cCat').style.left='calc(var(--vl,0%) + 50%)'; sfx.bad(); await sleep(1100);
  $('cDog').style.left=''; $('cCat').style.left='';
  await build('Скажи: «Это мой друг»',['досым','Бұл','менің','мысық'],['Бұл','менің','досым'],'«Бұл менің досым» 😉');
  await talk(K([['Бұл','это'],['менің','мой'],['досым!','друг!']])+' 🍌','Бұл менің досым'); await done();
 }};
L[9]={title:'Вежливые слова',steps:6,reward:['well','Колодец'],
 words:[['Кешіріңіз!','Извините!'],['Оқасы жоқ','Ничего, не за что'],['Өтінемін','Пожалуйста (прошу)'],['Рақмет!','Спасибо!'],['Сау бол!','Пока! (другу)'],['Сау болыңыз!','До свидания! (вежливо)']],
 async run(){
  show('cNb');
  await nbSays('Ой! Я случайно наступил тебе на ногу 😬',null,2200); RIG.mood('oops');
  await nbSays(K('Кешіріңіз!','Извините!'),'Кешіріңіз',1800);
  await card('Кешіріңіз!','извините!');
  await card('Оқасы жоқ','ничего / не за что');
  await ask('Банан извинился. Что ответишь?',[{t:'Оқасы жоқ!',ok:true},{t:'Жаман!',react:'Он же извинился! Будь добрее 😊'},{t:'Сәлем!',react:'Мы уже здоровались 🙃'}]);
  await talk(K('Оқасы жоқ!','Ничего!')+' 😊','Оқасы жоқ'); await done();
  await apaSays('Вот, угощайтесь яблоками! 🍎','',2000); RIG.mood('oops');
  await almaSays('Яблоками?! … Ладно, Банан, это тебе 😅',2300);
  await ask('Апа угостила. Что скажешь?',[{t:'Рақмет!',ok:true},{t:'Кешіріңіз!',react:'Извиняться не за что 😉'},{t:'Оқасы жоқ',react:'Это говорят в ответ на спасибо 😉'}]);
  await talk(K('Рақмет!','Спасибо!'),'Рақмет');
  await apaSays(K('Оқасы жоқ!','Не за что!')+' 🌸','Оқасы жоқ',1800); await done();
  await card('Өтінемін','пожалуйста (прошу)');
  await build('Попроси Банана: «Пожалуйста, дай мяч»',['доп','Өтінемін,','бер','алма'],['Өтінемін,','доп','бер'],'«Өтінемін, доп бер» 😉');
  await talk(K([['Өтінемін,','пожалуйста,'],['доп','мяч'],['бер','дай']])+' ⚽','Өтінемін, доп бер'); await done();
  await ask('Прощаешься с Апой (старшей). Что скажешь?',[{t:'Сау болыңыз!',ok:true},{t:'Сау бол!',react:'«Сау бол» — другу. Старшим — «Сау болыңыз» 🙏'}]);
  await talk(K('Сау болыңыз!','До свидания!'),'Сау болыңыз');
  await nbSays(K('Сау бол,','Пока,')+' Алма! 🍌👋','Сау бол',2000); await done();
 }};
L[10]={title:'Тест',test:true,steps:10,reward:['fountain','Фонтан'],words:[],
 async run(){
  show('cNb'); show('cCat'); show('cDog'); spotsOn(['tree','door','sky']);
  await almaSays('Тест про двор и соседей! Без подсказок 💪',2300);
  const Q=[
   ()=>ask('1/10 · «Менің атым Алма» значит…',[{t:'Меня зовут Алма',ok:true},{t:'Я из Алматы'},{t:'Мне семь лет'}]),
   ()=>ask('2/10 · Как ответить на «Қалайсың?»',[{t:'Жақсы!',ok:true},{t:'Бұл не?'},{t:'Қайдансың?'}]),
   ()=>build('3/10 · Собери: «Я из Алматы»',['Алматыданмын','Мен','жастамын'],['Мен','Алматыданмын'],'Мен… Алматыданмын'),
   ()=>ask('4/10 · «Сегіз» — это…',[{t:'7'},{t:'8',ok:true},{t:'9'}]),
   ()=>find('5/10 · Найди: <b>Есік</b>','door',['tree','door','sky']),
   ()=>find('6/10 · Найди: <b>Ағаш</b>','tree',['tree','door','sky']),
   ()=>find('7/10 · Найди что-то <b>сары</b>','cNb',['cNb','cCat','cDog']),
   ()=>find('8/10 · Найди: <b>Ит</b>','cDog',['cNb','cCat','cDog']),
   ()=>ask('9/10 · О предмете спрашивают…',[{t:'Бұл кім?'},{t:'Бұл не?',ok:true}]),
   ()=>ask('10/10 · Ответ на «Кешіріңіз!»',[{t:'Оқасы жоқ',ok:true},{t:'Рақмет'},{t:'Сәлем'}])
  ];
  for(const q of Q){ await q(); panel(false); progress(); await sleep(350); }
 }};

/* ===== run ===== */
const LN=+(new URLSearchParams(location.search).get('l')||1); const CFG=L[LN]||L[1]; const GN=10+LN;
LESSON=(CFG.test?'Тест. Двор и соседи':'Двор · Урок '+LN+'. '+CFG.title); WORDS=CFG.words; TOTAL=CFG.steps;
document.title=(CFG.test?'Тест':'Урок '+LN)+' — '+CFG.title;
async function lesson(){
  stepN=0; MISTAKES=0; $('barfill').style.width='0'; $('result').classList.remove('on'); hushAll(); if(RIG) RIG.reset();
  await toScene('shop');
  await CFG.run();
  $('barfill').style.width='100%'; hushAll();
  addWords(); sfx.win();
  $('resTitle').textContent=CFG.test?(MISTAKES<=3?'Тест пройден! 🏆':'Тест пройден! 👍'):'Урок '+LN+' пройден! 🎉';
  $('resSub').textContent=CFG.test?('Ошибок: '+MISTAKES+(MISTAKES===0?' — идеально! 🌟':'')):'Новые слова добавлены в словарь 📖';
  $('newWords').innerHTML=WORDS.map(([k])=>`<span>${k}</span>`).join('');
  $('rewImg').src='yard/img/'+CFG.reward[0]+'.png'; $('rewName').textContent='+1 '+CFG.reward[1]+(CFG.test?' · +50 ⭐':'');
  $('result').classList.add('on');
}
function finish(){ try{ const d=+localStorage.getItem('almaMapDone')||0; if(d<GN) localStorage.setItem('almaMapDone',String(GN)); localStorage.setItem('almaJustDone','1');
  const key='almaL'+GN+'reward';
  if(!localStorage.getItem(key)){ const S=JSON.parse(localStorage.getItem('almaHome')||'null')||{lessons:1,inv:{flowerbed:2,bush:1,spruce:1,paving:6},placed:{},paved:{},house:0};
    const r=CFG.reward[0]; S.inv[r]=(S.inv[r]||0)+1; S.lessons=Math.max(S.lessons||1,GN+1); localStorage.setItem('almaHome',JSON.stringify(S)); localStorage.setItem(key,'1');
    if(CFG.test){ localStorage.setItem('almaPts',String((+localStorage.getItem('almaPts')||0)+50)); } } }catch(e){} }
