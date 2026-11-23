/* ===== Home (family) lesson engine: topic 3 ===== */
let MISTAKES=0;
const WHO={cMom:['Мама','#c0392b'],cDad:['Папа','#1f5fa8'],cGma:['Бабушка','#8e44ad'],cGpa:['Дедушка','#7a4a22'],cBro:['Братик','#2f8a1f']};
function sayAs(id,html,ms){ const [n,c]=WHO[id]; say('apa',`<small style="display:block;color:${c};font-size:3cqw;margin:0 0 .6cqw;font-weight:900">${n}</small>`+html,ms); }
function hushAll(){ hush(); }
function put(id,x){ const e=$(id); e.style.left=`calc(var(--vl,0%) + ${(28+(x-22)*0.65).toFixed(1)}%)`; e.classList.remove('off'); e.classList.remove('hop'); void e.offsetWidth; e.classList.add('hop'); }
function cast(map){ $('shopItems').classList.toggle('crowd',Object.keys(map).length>=4); ['cMom','cDad','cGma','cGpa','cBro'].forEach(id=>{ if(map[id]===undefined) $(id).classList.add('off'); else put(id,map[id]); }); }
async function almaSays(html,ms=2300){ RIG.talk(Math.min(ms,1800)); say('alma',html,ms); await sleep(ms+100); }
async function as(id,html,spk,ms=2300){ sayAs(id,html,ms); if(spk) speak(spk); const e=$(id); e.classList.remove('hop'); void e.offsetWidth; e.classList.add('hop'); await sleep(ms+100); }
function card(kk,ru,btn){ return new Promise(res=>{ $('q').innerHTML='Новое слово!'; $('slot').style.display='none';
  $('opts').innerHTML=`<div id="learn" style="width:100%"><b style="font-size:6.4cqw">${kk}</b><span>= ${ru}</span></div>`; speak(kk.replace(/[.…!?·]/g,' '));
  const b=document.createElement('button'); b.className='opt big'; b.textContent=btn||'Понятно 👍'; b.onclick=()=>{ac();sfx.tap();res()}; $('opts').appendChild(b); panel(true); }); }
function learn(id,kk,ru){ const e=$(id); e.classList.add('glow');
  return new Promise(res=>{ $('q').innerHTML=`Новое слово! Нажми на ${WHO[id][0].toLowerCase()} 👆`; $('slot').style.display='none';
    $('opts').innerHTML='<div id="learn" style="opacity:.35"><b>?</b><span>нажми</span></div>'; panel(true);
    e.onclick=()=>{ ac(); sfx.ok(); e.classList.remove('glow'); sparks(e); e.onclick=null;
      $('opts').innerHTML=`<div id="learn"><b>${kk}</b><span>= ${ru}</span></div>`; speak(kk); setTimeout(res,1900); }; }); }
function find(q,ok,ids,jokes){ return new Promise(res=>{ $('q').innerHTML=q; $('slot').style.display='none'; $('opts').innerHTML=''; panel(true);
  ids.forEach(id=>{ const e=$(id); e.onclick=async()=>{ ac();
    if(id===ok){ sfx.ok(); e.classList.add('glow'); sparks(e); alma('happy'); ids.forEach(i=>$(i).onclick=null); await sleep(900); e.classList.remove('glow'); res(); }
    else{ MISTAKES++; sfx.bad(); e.classList.remove('bad'); void e.offsetWidth; e.classList.add('bad'); alma('oops');
      $('opts').innerHTML=`<div id="learn" style="padding:1.6cqw 3cqw"><span style="font-size:4cqw">${(jokes&&jokes[id])||'Это '+WHO[id][0].toLowerCase()+'! Попробуй ещё 😉'}</span></div>`; } }; }); }); }
async function talk(html,spk,ms=1800){ RIG.talk(ms); say('alma',html,ms); if(spk) speak(spk); await sleep(ms+100); }
async function done(){ panel(false); progress(); await sleep(300); hushAll(); }

const L={};
L[1]={title:'Мама и папа',steps:6,reward:['tandyr','Тандыр'],
 words:[['Анам','Моя мама'],['Әкем','Мой папа'],['Қызым','Доченька'],['Бұл — менің анам','Это моя мама'],['Мен сені жақсы көремін','Я тебя люблю']],
 async run(){
  cast({cMom:38,cDad:64});
  await almaSays('Знакомьтесь — моя семья! 🍎💛');
  await learn('cMom','Анам','моя мама'); await learn('cDad','Әкем','мой папа'); await done();
  await as('cMom',K([['Қызым!','доченька!']])+' 😊','Қызым');
  await card('Қызым','доченька (досл. «моя дочь»)');
  await find('Где <b style="color:#2f6f18">әкем</b>?','cDad',['cMom','cDad'],{cMom:'Это анам — мама! А папа с усами 👨'}); await done();
  await build('Скажи: «Это моя мама»',['анам','Бұл','менің','әкем'],['Бұл','менің','анам'],'«Бұл менің анам» 😉');
  await talk(K([['Бұл','это'],['менің','моя'],['анам','мама']])+' 💛','Бұл менің анам'); await done();
  await as('cDad','Папа поправил калпак и показал «класс» 👍 '+K([['Жарайсың!','молодец!']]),'Жарайсың',2600);
  await ask('Что значит «Жарайсың!»?',[{t:'Молодец!',ok:true},{t:'Иди сюда!',react:'Нет, папа хвалит тебя 😊'},{t:'Спокойной ночи',react:'Ещё день на дворе ☀️'}]); await done();
  await card('Мен сені жақсы көремін','я тебя люблю');
  await ask('Скажи маме «я тебя люблю»!',[{t:'Мен сені жақсы көремін!',ok:true},{t:'Мен Алматыданмын!',react:'Это «я из Алматы» 😄'}]);
  await talk(K([['Анашым,','мамочка,'],['мен','я'],['сені','тебя'],['жақсы көремін!','люблю!']])+' 💕','Анашым, мен сені жақсы көремін',2200);
  await as('cMom','💕 '+K([['Мен де!','я тоже!']]),'Мен де',1800); await done();
 }};
L[2]={title:'Братья и сёстры',steps:6,reward:['pond','Пруд'],
 words:[['Інім','Мой младший брат'],['Ағам','Мой старший брат'],['Әпкем','Моя старшая сестра'],['Сіңлім','Моя младшая сестра'],['Бауырым','Мой родной (брат, сестра)']],
 async run(){
  cast({cBro:50});
  await almaSays('А это мой братик. Он зелёный, потому что ещё не созрел 😆');
  await learn('cBro','Інім','мой младший брат'); await done();
  await as('cBro','Эй! Я уже большой! 😤 '+K([['Мен','я'],['үлкенмін!','большой!']]),'Мен үлкенмін',2500);
  await card('Ағам · Інім','старший брат · младший брат');
  await ask('Братик младше Алмы. Кто он для неё?',[{t:'Інім',ok:true},{t:'Ағам',react:'Ағам — старший брат. А он младше! 😉'},{t:'Әкем',react:'Әкем — папа 👨'}]); await done();
  await card('Әпкем · Сіңлім','старшая сестра · младшая сестра');
  await ask('Для братика Алма — старшая сестра. Как он её назовёт?',[{t:'Әпкем',ok:true},{t:'Сіңлім',react:'Сіңлім — младшая сестра. А Алма старше!'},{t:'Анам',react:'Анам — мама 😄'}]);
  await as('cBro',K([['Әпке,','сестрёнка,'],['ойнайық!','давай играть!']])+' ⚽','Әпке, ойнайық',2400); await done();
  await build('Скажи: «Это мой младший брат»',['інім','Бұл','менің','ағам'],['Бұл','менің','інім'],'«Бұл менің інім» 😉');
  await talk(K([['Бұл','это'],['менің','мой'],['інім','младший брат']]),'Бұл менің інім'); await done();
  await ask('У Банана есть старший брат. Как сказать «мой старший брат»?',[{t:'Ағам',ok:true},{t:'Інім',react:'Інім — младший 😉'},{t:'Атам',react:'Атам — дедушка 👴'}]); await done();
 }};
L[3]={title:'Бабушка и дедушка',steps:6,reward:['lamp','Фонарь'],
 words:[['Әжем','Моя бабушка'],['Атам','Мой дедушка'],['Немере','Внук, внучка'],['Атам мен әжем','Дедушка и бабушка'],['Кел, балам!','Иди сюда, дитя!']],
 async run(){
  cast({cGma:40,cGpa:64});
  await almaSays('В гости приехали бабушка и дедушка! 🥰');
  await learn('cGma','Әжем','моя бабушка'); await learn('cGpa','Атам','мой дедушка'); await done();
  await as('cGma',K([['Кел,','иди сюда,'],['балам!','дитя!']])+' Дай обниму! 🤗','Кел, балам',2400);
  await ask('Что сказала бабушка?',[{t:'Иди сюда, дитя!',ok:true},{t:'Иди спать!',react:'Нет, она хочет обнять 🤗'},{t:'Где хлеб?',react:'Хлеб мы уже купили 😄'}]); await done();
  await card('Немере','внук, внучка');
  await as('cGpa',K([['Менің','моя'],['немерем!','внучка!']])+' 👴💛','Менің немерем',2200);
  await find('Где <b style="color:#2f6f18">атам</b>?','cGpa',['cGma','cGpa'],{cGma:'Это әжем — бабушка в платочке 👵'}); await done();
  await card('мен','и (соединяет слова) · Атам мен әжем = дедушка и бабушка');
  await build('Скажи: «Дедушка и бабушка»',['әжем','мен','Атам','анам'],['Атам','мен','әжем'],'«Атам мен әжем» 😉');
  await talk(K([['Атам','дедушка'],['мен','и'],['әжем!','бабушка!']])+' 💛','Атам мен әжем'); await done();
  await as('cGpa','Ата достал из кармана… курт! 😄 '+K([['Ал,','на,'],['немерем!','внучка!']]),'Ал, немерем',2600);
  await ask('Дедушка угостил. Что скажешь?',[{t:'Рақмет, ата!',ok:true},{t:'Сау болыңыз!',react:'Мы не уходим! 😄'}]); await done();
 }};
L[4]={title:'У меня есть…',steps:6,reward:['gazebo','Беседка'],
 words:[['… бар','есть …'],['… жоқ','нет …'],['Менің інім бар','У меня есть младший брат'],['Менің итім жоқ','У меня нет собаки'],['Сенің … бар ма?','У тебя есть …?']],
 async run(){
  cast({cBro:50});
  await card('Менің … бар','у меня есть …');
  await build('Скажи: «У меня есть младший брат»',['бар','інім','Менің','жоқ'],['Менің','інім','бар'],'«Менің інім бар» 😉');
  await talk(K([['Менің','у меня'],['інім','младший брат'],['бар','есть']]),'Менің інім бар'); await done();
  await card('… жоқ','нет … · Менің итім жоқ = у меня нет собаки');
  await as('cBro',K([['Менің','у меня'],['итім','собаки'],['жоқ…','нет…']])+' 😢 А я так хочу щенка!','Менің итім жоқ',2600);
  await ask('Есть у братика собака?',[{t:'Жоқ — нет',ok:true},{t:'Бар — есть',react:'Он же сказал «жоқ» 😢'}]); await done();
  cast({cBro:62,cMom:36});
  await as('cMom','А у нас есть… мысық! Кот соседа Мырза часто приходит 😸','',2600);
  await ask('Спроси брата: «У тебя есть кот?»',[{t:'Сенің мысығың бар ма?',ok:true},{t:'Менің мысығым бар',react:'Это «у меня есть кот» 😉'},{t:'Мысық қанша тұрады?',react:'Котов не продают! 😹'}]);
  await talk(K([['Сенің','у тебя'],['мысығың','кот'],['бар ма?','есть?']]),'Сенің мысығың бар ма');
  await as('cBro',K([['Жоқ!','нет!']])+' Но есть жук в банке 🪲😁','Жоқ',2400); await done();
  await ask('«Бар» или «жоқ»? У Алмы есть братик.',[{t:'Бар',ok:true},{t:'Жоқ',react:'Есть же! Вот он прыгает 🍏'}]); await done();
  await ask('«Нан жоқ» значит…',[{t:'Хлеба нет',ok:true},{t:'Хлеб есть',react:'Есть — «бар» 😉'},{t:'Хлеб вкусный',react:'Вкусный — «дәмді» 😋'}]); await done();
 }};
L[5]={title:'Возраст',steps:6,reward:['bench','Скамейка'],
 words:[['Отыз','Тридцать'],['Қырық','Сорок'],['Жетпіс','Семьдесят'],['Сексен','Восемьдесят'],['Бес жаста','Пять лет'],['Неше жаста?','Сколько лет (ему/ей)?']],
 async run(){
  cast({cGpa:36,cBro:62});
  await card('Неше жаста?','сколько ему/ей лет?');
  await as('cBro',K([['Мен','мне'],['бес','пять'],['жастамын!','лет!']])+' ✋','Мен бес жастамын',2200);
  await ask('Сколько лет братику?',[{t:'5',ok:true},{t:'6',react:'Алты — шесть. А он сказал «бес» ✋'},{t:'15',react:'Пятнадцать — «он бес» 😉'}]); await done();
  await card('Жетпіс · Сексен','семьдесят · восемьдесят');
  await as('cGpa',K([['Мен','мне'],['сексен','восемьдесят'],['жастамын','лет']])+' 👴 Но бегаю быстрее внуков!','Мен сексен жастамын',2800);
  await ask('Сколько лет дедушке?',[{t:'70',react:'70 — «жетпіс». А дедушка сказал «сексен»'},{t:'80',ok:true},{t:'18',react:'Он бы обрадовался 😄 Но нет!'}]); await done();
  cast({cMom:40,cDad:64});
  await card('Отыз · Қырық','тридцать · сорок');
  await as('cDad',K([['Мен','мне'],['қырық','сорок'],['жастамын','лет']]),'Мен қырық жастамын',2000);
  await as('cMom','А мне… это секрет! 🤫 Ладно — '+K([['отыз','тридцать']])+'!','отыз',2400);
  await ask('Кто старше?',[{t:'Әкем (40)',ok:true},{t:'Анам (30)',react:'Отыз — 30, қырық — 40 😉'}]); await done();
  await build('Спроси про дедушку: «Сколько лет дедушке?»',['жаста?','Атам','неше','бар'],['Атам','неше','жаста?'],'«Атам неше жаста?» 😉');
  await talk(K([['Атам','дедушке'],['неше','сколько'],['жаста?','лет?']]),'Атам неше жаста'); await done();
  await ask('Қырық + қырық = ?',[{t:'Сексен',ok:true},{t:'Жетпіс',react:'Жетпіс — 70. Чуть-чуть не хватает!'}]); await done();
 }};
L[6]={title:'Профессии',steps:6,reward:['garden_bed','Грядка'],
 words:[['Мұғалім','Учитель'],['Дәрігер','Врач'],['Аспаз','Повар'],['Жүргізуші','Водитель'],['Жұмыс','Работа'],['Мен … -мын','Я — … (профессия)']],
 async run(){
  cast({cMom:38,cDad:64});
  await as('cMom',K([['Мен','я'],['мұғаліммін','учитель']])+' 📚','Мен мұғаліммін',2200);
  await card('Мұғалім','учитель');
  await as('cDad',K([['Мен','я'],['жүргізушімін','водитель']])+' 🚌 Вожу автобус!','Мен жүргізушімін',2400);
  await card('Жүргізуші','водитель'); await done();
  await ask('Кем работает мама?',[{t:'Мұғалім — учитель',ok:true},{t:'Жүргізуші — водитель',react:'Это папа водит автобус 🚌'},{t:'Аспаз — повар',react:'Хотя готовит она тоже вкусно 😋'}]); await done();
  cast({cGma:40,cGpa:64});
  await card('Аспаз · Дәрігер','повар · врач');
  await as('cGma','Я 30 лет была '+K([['аспаз','поваром']])+'! Мои бауырсаки — лучшие 😋','аспаз',2600);
  await as('cGpa','А я — '+K([['дәрігер','врач']])+'. Говорю: ешьте яблоки! 🍎… Ой, Алма, прости 😅','дәрігер',3000);
  RIG.mood('oops'); await sleep(500); await done();
  await find('Кто был <b style="color:#2f6f18">дәрігер</b>?','cGpa',['cGma','cGpa'],{cGma:'Бабушка — аспаз, повар 👩‍🍳'}); await done();
  await build('Скажи: «Папа — водитель»',['жүргізуші','Әкем','мұғалім'],['Әкем','жүргізуші'],'«Әкем жүргізуші» 😉');
  await talk(K([['Әкем','мой папа'],['жүргізуші','водитель']])+' 🚌','Әкем жүргізуші'); await done();
  await ask('А кем хочет быть Алма?',[{t:'Аспаз! 🍰',ok:true},{t:'Дәрігер! 🩺',ok:true},{t:'Мұғалім! 📚',ok:true}]); await talk('Всё сразу! 😄',null,1500); await done();
 }};
L[7]={title:'Характер',steps:6,reward:['swing','Качели'],
 words:[['Мейірімді','Добрый'],['Көңілді','Весёлый'],['Ақылды','Умный'],['Тентек','Озорной, шалун'],['Өте','Очень']],
 async run(){
  cast({cGma:38,cBro:64});
  await card('Мейірімді','добрый');
  await talk(K([['Әжем','бабушка'],['мейірімді','добрая']])+' 🥰','Әжем мейірімді');
  await card('Тентек','озорной, шалун');
  await as('cBro','Хи-хи! Я спрятал папин калпак! 🎩😜','',2200);
  await ask('Какой братик?',[{t:'Тентек',ok:true},{t:'Мейірімді',react:'Добрый, но сейчас — шалун 😜'},{t:'Аспаз',react:'Аспаз — повар 😄'}]); await done();
  cast({cGpa:38,cDad:64});
  await card('Ақылды · Көңілді','умный · весёлый');
  await as('cGpa','Я решаю кроссворды без подсказок 🧠','',2200);
  await find('Кто <b style="color:#2f6f18">ақылды</b> (решает кроссворды)?','cGpa',['cGpa','cDad'],{cDad:'Папа — көңілді, весёлый 😄'}); await done();
  await as('cDad','Ха-ха-ха! Шутка дня: почему яблоко красное? Стесняется! 😂','',2800);
  await ask('Папа какой?',[{t:'Көңілді',ok:true},{t:'Тентек',react:'Шутит, но не шалит 😄'}]); await done();
  await build('Скажи: «Дедушка очень умный»',['ақылды','Атам','өте','тентек'],['Атам','өте','ақылды'],'«Атам өте ақылды» 😉');
  await talk(K([['Атам','дедушка'],['өте','очень'],['ақылды!','умный!']]),'Атам өте ақылды'); await done();
  await ask('А Алма какая? 😊',[{t:'Көңілді',ok:true},{t:'Ақылды',ok:true},{t:'Мейірімді',ok:true}]); await talk('Правильно — всё сразу! 🍎✨',null,1600); await done();
 }};
L[8]={title:'Семейное фото',steps:6,reward:['flowerbed','Клумба'],
 words:[['Отбасы','Семья'],['Сурет','Фото, картинка'],['Сурет түсірейік!','Давайте сфотографируемся!'],['Күліңдер!','Улыбайтесь!'],['Барлығы','Все']],
 async run(){
  cast({cMom:30,cDad:50,cGma:70});
  await card('Отбасы','семья');
  await as('cDad',K([['Сурет','фото'],['түсірейік!','давайте сделаем!']])+' 📸','Сурет түсірейік',2200);
  await card('Сурет','фото, картинка'); await done();
  await find('Кто встанет в центр? Найди <b style="color:#2f6f18">әкем</b>','cDad',['cMom','cDad','cGma']); await done();
  cast({cGpa:30,cBro:50,cGma:70});
  await find('Позови на фото <b style="color:#2f6f18">інім</b>','cBro',['cGpa','cBro','cGma'],{cGpa:'Это атам — дедушка 👴',cGma:'Это әжем — бабушка 👵'}); await done();
  await as('cBro','Я буду делать смешную рожицу 😜','',1800);
  await card('Күліңдер!','улыбайтесь! (всем)');
  await ask('Фотограф хочет, чтобы все улыбнулись. Что скажет?',[{t:'Күліңдер!',ok:true},{t:'Кешіріңіз!',react:'Это «извините» 🙏'},{t:'Сау болыңдар!',react:'Это «до свидания» всем 👋'}]); await done();
  cast({cGpa:22,cGma:38,cMom:54,cDad:70});
  await talk(K([['Барлығы,','все,'],['күліңдер!','улыбайтесь!']])+' 😁','Барлығы, күліңдер',1800);
  $('fade').style.transition='opacity .08s'; $('fade').style.opacity=1; sfx.coin(); await sleep(120); $('fade').style.opacity=0; await sleep(200); $('fade').style.transition='';
  alma('happy'); await almaSays('Готово! Лучшее '+K([['отбасы','семейное'],['суреті!','фото!']])+' 📸💛',2400); await done();
  await ask('«Отбасы» значит…',[{t:'Семья',ok:true},{t:'Фото',react:'Фото — «сурет» 📸'},{t:'Дом',react:'Дом — «үй» 🏠'}]); await done();
 }};
L[9]={title:'Семейный ужин',steps:6,reward:['well','Колодец'],
 words:[['Дастархан','Накрытый стол'],['Бауырсақ','Баурсак'],['Ас болсын!','Приятного аппетита!'],['Тағы','Ещё'],['Тоқпын','Я сыт(а)'],['Дәмді екен!','Как вкусно!']],
 async run(){
  cast({cGma:36,cGpa:58,cBro:78});
  await as('cGma','Все к '+K([['дастарханға!','столу!']])+' 🍲 Бауырсаки горячие!','дастарханға',2400);
  await card('Дастархан · Бауырсақ','накрытый стол · баурсак');
  await as('cGpa',K([['Ас','приятного'],['болсын!','аппетита!']]),'Ас болсын',2000);
  await card('Ас болсын!','приятного аппетита!'); await done();
  await ask('Что говорят перед едой?',[{t:'Ас болсын!',ok:true},{t:'Сау болыңыз!',react:'Это «до свидания» 👋'},{t:'Абайла!',react:'Это «осторожно»… хотя чай горячий 😅'}]); await done();
  await talk(K([['Дәмді','вкусно'],['екен!','как же!']])+' 😋','Дәмді екен');
  await card('Тағы','ещё');
  await as('cBro',K([['Тағы!','ещё!'],['Тағы!','ещё!'],['Тағы!','ещё!']])+' 🤤','Тағы, тағы',2200);
  await ask('Братик сказал «тағы» три раза. Что он хочет?',[{t:'Ещё баурсаков!',ok:true},{t:'Спать',react:'Не похоже 😄'},{t:'Домой',react:'Он и так дома 🏠'}]); await done();
  await card('Тоқпын','я сыт(а)');
  await as('cGma','Алма, '+K([['тағы?','ещё?']])+' 🍲','Тағы',1800);
  await build('Ответь: «Спасибо, я сыта!»',['тоқпын','Рақмет,','тағы'],['Рақмет,','тоқпын'],'«Рақмет, тоқпын» 😉');
  await talk(K([['Рақмет,','спасибо,'],['тоқпын!','я сыта!']])+' 😌','Рақмет, тоқпын'); await done();
  await as('cBro','А я — нет! Ещё 10 бауырсаков, пожалуйста! 😂','',2200); await done();
 }};
L[10]={title:'Тест',test:true,steps:10,reward:['fountain','Фонтан'],words:[],
 async run(){
  cast({cMom:24,cDad:42,cGma:60,cGpa:78});
  await almaSays('Тест про семью! Без подсказок 💪',2000);
  const Q=[
   ()=>find('1/10 · Найди: <b>Анам</b>','cMom',['cMom','cDad','cGma','cGpa']),
   ()=>find('2/10 · Найди: <b>Атам</b>','cGpa',['cMom','cDad','cGma','cGpa']),
   ()=>ask('3/10 · «Інім» — это…',[{t:'Младший брат',ok:true},{t:'Старший брат'},{t:'Дедушка'}]),
   ()=>ask('4/10 · «Менің итім жоқ» значит…',[{t:'У меня есть собака'},{t:'У меня нет собаки',ok:true}]),
   ()=>ask('5/10 · «Сексен» — это…',[{t:'60'},{t:'70'},{t:'80',ok:true}]),
   ()=>ask('6/10 · «Мұғалім» — это…',[{t:'Врач'},{t:'Учитель',ok:true},{t:'Повар'}]),
   ()=>build('7/10 · Собери: «Это моя мама»',['анам','Бұл','менің','әкем'],['Бұл','менің','анам'],'Бұл… менің… анам'),
   ()=>ask('8/10 · «Тентек» — это…',[{t:'Шалун',ok:true},{t:'Умный'},{t:'Добрый'}]),
   ()=>ask('9/10 · Перед едой говорят…',[{t:'Ас болсын!',ok:true},{t:'Тоқпын'},{t:'Күліңдер!'}]),
   ()=>ask('10/10 · «Отбасы» — это…',[{t:'Семья',ok:true},{t:'Фото'},{t:'Стол'}])
  ];
  for(const q of Q){ await q(); panel(false); progress(); await sleep(350); }
 }};

/* ===== run ===== */
const LN=+(new URLSearchParams(location.search).get('l')||1); const CFG=L[LN]||L[1]; const GN=20+LN;
LESSON=(CFG.test?'Тест. Семья':'Семья · Урок '+LN+'. '+CFG.title); WORDS=CFG.words; TOTAL=CFG.steps;
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
