// feature：文法小教室（分級）
/* ---------- 文法小教室 ---------- */
// 文法沒有公開分級資料庫 → 各級別單元為人工編寫。目前提供 A1 / A2 / B1 / B2。
const GRAMMAR={
  A1:[
    {title:"a 還是 an？",
     rule:"名詞前面通常加 a；如果單字開頭發『母音』(a,e,i,o,u) 的音，就用 an。",
     examples:[{en:"a dog",zh:"一隻狗"},{en:"a cat",zh:"一隻貓"},{en:"an apple",zh:"一顆蘋果"},{en:"an egg",zh:"一顆蛋"}],
     quiz:[{q:"___ elephant",options:["a","an"],answer:"an"},{q:"___ book",options:["a","an"],answer:"a"},
           {q:"___ orange",options:["a","an"],answer:"an"}]},
    {title:"is 還是 are？",
     rule:"一個東西（單數）用 is；兩個以上（複數）用 are。",
     examples:[{en:"The cat is cute.",zh:"這隻貓很可愛。"},{en:"The dogs are big.",zh:"這些狗很大。"}],
     quiz:[{q:"The bird ___ small.",options:["is","are"],answer:"is"},{q:"The books ___ new.",options:["is","are"],answer:"are"}]},
    {title:"複數要加 s",
     rule:"東西不只一個時，名詞後面通常加 s。",
     examples:[{en:"one apple",zh:"一顆蘋果"},{en:"two apples",zh:"兩顆蘋果"},{en:"three cats",zh:"三隻貓"}],
     quiz:[{q:"two ___",options:["dog","dogs"],answer:"dogs"},{q:"one ___",options:["book","books"],answer:"book"}]},
    {title:"be 動詞：am / is / are",
     rule:"I 用 am；he / she / it 用 is；you / we / they 用 are。",
     examples:[{en:"I am happy.",zh:"我很開心。"},{en:"She is a teacher.",zh:"她是老師。"},{en:"They are friends.",zh:"他們是朋友。"}],
     quiz:[{q:"I ___ a student.",options:["am","is"],answer:"am"},{q:"He ___ tall.",options:["am","is"],answer:"is"},
           {q:"They ___ happy.",options:["is","are"],answer:"are"}]},
    {title:"this / that / these / those",
     rule:"近的用 this（單）/ these（複）；遠的用 that（單）/ those（複）。",
     examples:[{en:"This is my book.",zh:"這是我的書。"},{en:"That is a bird.",zh:"那是一隻鳥。"},{en:"These are apples.",zh:"這些是蘋果。"}],
     quiz:[{q:"___ is my dog.（近）",options:["This","These"],answer:"This"},{q:"___ are cats.（近，複數）",options:["This","These"],answer:"These"}]},
    {title:"There is / There are",
     rule:"有一個東西用 There is；有很多用 There are。",
     examples:[{en:"There is a cat.",zh:"有一隻貓。"},{en:"There are two dogs.",zh:"有兩隻狗。"}],
     quiz:[{q:"___ a book here.",options:["There is","There are"],answer:"There is"},{q:"___ three birds.",options:["There is","There are"],answer:"There are"}]},
    {title:"人稱代名詞（當主詞）",
     rule:"代替人或東西當主詞：I 我、you 你、he 他、she 她、it 它、we 我們、they 他們。",
     examples:[{en:"He is my friend.",zh:"他是我的朋友。"},{en:"They are students.",zh:"他們是學生。"}],
     quiz:[{q:"___ is a girl.（她）",options:["He","She"],answer:"She"},{q:"___ are happy.（我們）",options:["We","I"],answer:"We"}]},
    {title:"所有格：my / your / his / her",
     rule:"表示『某人的』：my 我的、your 你的、his 他的、her 她的、our 我們的、their 他們的。",
     examples:[{en:"This is my bag.",zh:"這是我的書包。"},{en:"Her name is Amy.",zh:"她的名字是 Amy。"}],
     quiz:[{q:"That is ___ dog.（他的）",options:["his","her"],answer:"his"},{q:"___ book is new.（我的）",options:["My","Me"],answer:"My"}]},
    {title:"疑問詞 What / Where / Who",
     rule:"What 問什麼、Where 問哪裡、Who 問誰。",
     examples:[{en:"What is this?",zh:"這是什麼？"},{en:"Where is my cat?",zh:"我的貓在哪裡？"},{en:"Who is she?",zh:"她是誰？"}],
     quiz:[{q:"___ is your name?",options:["What","Where"],answer:"What"},{q:"___ are you?（你在哪）",options:["Who","Where"],answer:"Where"}]},
    {title:"祈使句（命令 / 請求）",
     rule:"叫別人做事，直接用原形動詞開頭。",
     examples:[{en:"Open the door.",zh:"打開門。"},{en:"Please sit down.",zh:"請坐下。"}],
     quiz:[{q:"___ the book.（打開）",options:["Open","Opens"],answer:"Open"},{q:"Please ___ quiet.",options:["be","are"],answer:"be"}]}
  ],
  A2:[
    {title:"現在簡單式：he/she/it + s",
     rule:"主詞是 he / she / it 時，動詞要加 s。",
     examples:[{en:"I like apples.",zh:"我喜歡蘋果。"},{en:"She likes apples.",zh:"她喜歡蘋果。"},{en:"He plays soccer.",zh:"他踢足球。"}],
     quiz:[{q:"She ___ to school.",options:["go","goes"],answer:"goes"},{q:"I ___ milk.",options:["like","likes"],answer:"like"},
           {q:"He ___ books.",options:["read","reads"],answer:"reads"}]},
    {title:"否定：don't / doesn't",
     rule:"一般動詞否定：I/you/we/they 用 don't；he/she/it 用 doesn't。後面接原形動詞。",
     examples:[{en:"I don't like coffee.",zh:"我不喜歡咖啡。"},{en:"She doesn't eat meat.",zh:"她不吃肉。"}],
     quiz:[{q:"He ___ like it.",options:["don't","doesn't"],answer:"doesn't"},{q:"We ___ have time.",options:["don't","doesn't"],answer:"don't"}]},
    {title:"疑問句：Do / Does ...?",
     rule:"一般動詞問句：I/you/we/they 用 Do；he/she/it 用 Does，放句首。",
     examples:[{en:"Do you like cats?",zh:"你喜歡貓嗎？"},{en:"Does she play piano?",zh:"她會彈鋼琴嗎？"}],
     quiz:[{q:"___ he like tea?",options:["Do","Does"],answer:"Does"},{q:"___ they run fast?",options:["Do","Does"],answer:"Do"}]},
    {title:"can / can't（能力）",
     rule:"can 表示會、能；can't 表示不會、不能。後面接原形動詞。",
     examples:[{en:"I can swim.",zh:"我會游泳。"},{en:"She can't fly.",zh:"她不會飛。"}],
     quiz:[{q:"Birds ___ fly.",options:["can","can't"],answer:"can"},{q:"A fish ___ walk.",options:["can","can't"],answer:"can't"}]},
    {title:"現在進行式 be + V-ing",
     rule:"正在做某事：be 動詞 + 動詞ing。",
     examples:[{en:"I am eating.",zh:"我正在吃。"},{en:"She is running.",zh:"她正在跑。"}],
     quiz:[{q:"He is ___ .",options:["play","playing"],answer:"playing"},{q:"They are ___ .",options:["sing","singing"],answer:"singing"}]},
    {title:"介系詞 in / on / at（時間）",
     rule:"月份/年用 in；星期/日期用 on；時刻用 at。",
     examples:[{en:"in July",zh:"在七月"},{en:"on Monday",zh:"在星期一"},{en:"at eight",zh:"在八點"}],
     quiz:[{q:"___ Sunday",options:["in","on"],answer:"on"},{q:"___ the morning",options:["in","at"],answer:"in"},{q:"___ night",options:["in","at"],answer:"at"}]},
    {title:"地點介系詞 in / on / under / next to",
     rule:"in 在裡面、on 在上面、under 在下面、next to 在旁邊。",
     examples:[{en:"The cat is under the table.",zh:"貓在桌子下面。"},{en:"The book is on the desk.",zh:"書在書桌上。"}],
     quiz:[{q:"The ball is ___ the box.（裡面）",options:["in","on"],answer:"in"},{q:"The dog is ___ the chair.（下面）",options:["under","on"],answer:"under"}]},
    {title:"was / were（過去 be 動詞）",
     rule:"is/am 的過去是 was；are 的過去是 were。",
     examples:[{en:"I was happy.",zh:"我（那時）很開心。"},{en:"They were here.",zh:"他們（那時）在這裡。"}],
     quiz:[{q:"She ___ tired.",options:["was","were"],answer:"was"},{q:"We ___ at home.",options:["was","were"],answer:"were"}]},
    {title:"have / has",
     rule:"I / you / we / they 用 have；he / she / it 用 has。",
     examples:[{en:"I have a pen.",zh:"我有一枝筆。"},{en:"She has a cat.",zh:"她有一隻貓。"}],
     quiz:[{q:"He ___ a bike.",options:["have","has"],answer:"has"},{q:"They ___ books.",options:["have","has"],answer:"have"}]},
    {title:"受格代名詞 me / him / her / them",
     rule:"當動詞或介系詞的受詞：me 我、him 他、her 她、us 我們、them 他們。",
     examples:[{en:"She loves me.",zh:"她愛我。"},{en:"I know him.",zh:"我認識他。"}],
     quiz:[{q:"Please help ___ .（我）",options:["I","me"],answer:"me"},{q:"I can see ___ .（他們）",options:["they","them"],answer:"them"}]},
    {title:"some / any",
     rule:"肯定句用 some；否定句和問句用 any。",
     examples:[{en:"I have some apples.",zh:"我有一些蘋果。"},{en:"I don't have any money.",zh:"我沒有任何錢。"}],
     quiz:[{q:"Do you have ___ pens?",options:["some","any"],answer:"any"},{q:"There are ___ books here.",options:["some","any"],answer:"some"}]}
  ],
  B1:[
    {title:"過去簡單式（規則 +ed）",
     rule:"過去發生的事，規則動詞字尾加 ed。",
     examples:[{en:"She walked to school.",zh:"她走路去學校。"},{en:"We played soccer.",zh:"我們踢了足球。"}],
     quiz:[{q:"Yesterday I ___ TV.",options:["watch","watched"],answer:"watched"},{q:"They ___ soccer.",options:["play","played"],answer:"played"}]},
    {title:"不規則過去式",
     rule:"有些動詞的過去式不加 ed，要另外記。",
     examples:[{en:"go → went",zh:"去"},{en:"eat → ate",zh:"吃"},{en:"see → saw",zh:"看見"}],
     quiz:[{q:"I ___ to the zoo.",options:["goed","went"],answer:"went"},{q:"She ___ an apple.",options:["ate","eated"],answer:"ate"}]},
    {title:"未來式 will",
     rule:"will + 原形動詞，表示未來要做的事。",
     examples:[{en:"I will call you.",zh:"我會打給你。"},{en:"It will rain.",zh:"會下雨。"}],
     quiz:[{q:"I ___ help you.",options:["will","willed"],answer:"will"},{q:"She will ___ .",options:["come","comes"],answer:"come"}]},
    {title:"be going to（打算）",
     rule:"be going to + 原形動詞，表示計畫要做的事。",
     examples:[{en:"I am going to swim.",zh:"我打算去游泳。"},{en:"She is going to study.",zh:"她打算念書。"}],
     quiz:[{q:"We are going to ___ .",options:["play","played"],answer:"play"},{q:"He ___ going to run.",options:["is","are"],answer:"is"}]},
    {title:"比較級 / 最高級",
     rule:"兩個比較加 -er（比較級）；三個以上加 -est（最高級）。",
     examples:[{en:"tall → taller → tallest",zh:"高 → 更高 → 最高"},{en:"He is taller than me.",zh:"他比我高。"}],
     quiz:[{q:"A is ___ than B.",options:["big","bigger"],answer:"bigger"},{q:"the ___ mountain",options:["highest","high"],answer:"highest"}]},
    {title:"頻率副詞",
     rule:"always 總是 > usually 通常 > sometimes 有時 > never 從不。放在一般動詞前面。",
     examples:[{en:"I always brush my teeth.",zh:"我總是刷牙。"},{en:"She never eats meat.",zh:"她從不吃肉。"}],
     quiz:[{q:"I ___ go to bed at nine.（通常）",options:["usually","never"],answer:"usually"},{q:"He ___ tells lies.（從不）",options:["always","never"],answer:"never"}]},
    {title:"現在完成式 have/has + 過去分詞",
     rule:"經驗或到現在為止的事：have/has + 過去分詞（p.p.）。",
     examples:[{en:"I have finished my homework.",zh:"我做完功課了。"},{en:"She has seen this movie.",zh:"她看過這部電影。"}],
     quiz:[{q:"I have ___ lunch.",options:["eat","eaten"],answer:"eaten"},{q:"He ___ gone home.",options:["have","has"],answer:"has"}]},
    {title:"must / have to（必須）",
     rule:"表示必須、應該。must 和 have to 後面都接原形動詞。",
     examples:[{en:"You must wear a helmet.",zh:"你必須戴安全帽。"},{en:"I have to go now.",zh:"我必須走了。"}],
     quiz:[{q:"You ___ stop at a red light.",options:["must","musts"],answer:"must"},{q:"She has ___ study.",options:["to","for"],answer:"to"}]},
    {title:"should（建議）",
     rule:"給建議：should + 原形動詞（應該）。",
     examples:[{en:"You should drink water.",zh:"你應該喝水。"},{en:"He should sleep early.",zh:"他應該早點睡。"}],
     quiz:[{q:"You ___ see a doctor.",options:["should","shoulds"],answer:"should"},{q:"We should ___ .",options:["rest","rested"],answer:"rest"}]},
    {title:"過去進行式 was/were + V-ing",
     rule:"過去某個時間正在做的事：was/were + 動詞ing。",
     examples:[{en:"I was reading a book.",zh:"我（那時）正在看書。"},{en:"They were playing.",zh:"他們（那時）正在玩。"}],
     quiz:[{q:"She was ___ .",options:["cook","cooking"],answer:"cooking"},{q:"We ___ watching TV.",options:["was","were"],answer:"were"}]},
    {title:"because / so（原因與結果）",
     rule:"because 接原因；so 接結果。",
     examples:[{en:"I am tired because I ran.",zh:"我很累，因為我跑步了。"},{en:"It rained, so we stayed home.",zh:"下雨了，所以我們待在家。"}],
     quiz:[{q:"I'm happy ___ it's my birthday.",options:["because","so"],answer:"because"},{q:"He was sick, ___ he went home.",options:["because","so"],answer:"so"}]}
  ],
  B2:[
    {title:"被動語態 be + 過去分詞",
     rule:"強調『被』做的動作：be 動詞 + 過去分詞（p.p.）。",
     examples:[{en:"The window was broken.",zh:"窗戶被打破了。"},{en:"English is spoken here.",zh:"這裡（有人）說英文。"}],
     quiz:[{q:"The cake was ___ by Mom.",options:["make","made"],answer:"made"},{q:"The room is ___ every day.",options:["clean","cleaned"],answer:"cleaned"}]},
    {title:"關係代名詞 who / which / that",
     rule:"who 指人、which 指物、that 兩者都可，用來連接並補充說明。",
     examples:[{en:"The girl who sings is Amy.",zh:"那個唱歌的女孩是 Amy。"},{en:"a book which is fun",zh:"一本很有趣的書"}],
     quiz:[{q:"the man ___ helped me",options:["who","which"],answer:"who"},{q:"a dog ___ is big",options:["who","which"],answer:"which"}]},
    {title:"used to（以前習慣）",
     rule:"used to + 原形動詞：以前常做、但現在不做了。",
     examples:[{en:"I used to play the piano.",zh:"我以前會彈鋼琴。"},{en:"She used to live here.",zh:"她以前住這裡。"}],
     quiz:[{q:"He used to ___ soccer.",options:["play","played"],answer:"play"},{q:"They ___ to be friends.",options:["used","use"],answer:"used"}]},
    {title:"第一條件句 if + 現在, will",
     rule:"真實可能的假設：If + 現在簡單式, 主要子句用 will。",
     examples:[{en:"If it rains, I will stay home.",zh:"如果下雨，我就待在家。"},{en:"If you study, you will pass.",zh:"如果你念書，你會通過。"}],
     quiz:[{q:"If you run, you ___ be tired.",options:["will","would"],answer:"will"},{q:"If it ___ , we will swim.",options:["is sunny","will be sunny"],answer:"is sunny"}]},
    {title:"動名詞 vs 不定詞",
     rule:"有些動詞後面接 V-ing（enjoy/like）；有些接 to + 原形（want/need）。",
     examples:[{en:"I enjoy swimming.",zh:"我喜歡游泳。"},{en:"I want to eat.",zh:"我想要吃東西。"}],
     quiz:[{q:"I enjoy ___ .",options:["reading","to read"],answer:"reading"},{q:"She wants ___ home.",options:["to go","going"],answer:"to go"}]},
    {title:"too / enough",
     rule:"too 太（過頭，負面）；enough 足夠。too + 形容詞；形容詞 + enough。",
     examples:[{en:"It is too hot.",zh:"太熱了。"},{en:"He is tall enough.",zh:"他夠高了。"}],
     quiz:[{q:"This box is ___ heavy.（太）",options:["too","enough"],answer:"too"},{q:"She is old ___ to drive.（足夠）",options:["too","enough"],answer:"enough"}]}
  ]
};
let grammarLvl="A1";
function initGrammarSource(){
  const sel=document.getElementById("grammarSource");
  const g=document.createElement("optgroup");g.label="🎓 文法分級";
  Object.keys(GRAMMAR).forEach(l=>{
    const o=document.createElement("option");o.value="OX:"+l;o.textContent=(LVL_LABEL[l]||l)+"（"+GRAMMAR[l].length+"單元）";g.appendChild(o);
  });
  sel.appendChild(g);
  pickDefaultLevel(sel);           // 依 config.js 的 DEFAULT_LEVEL 選預設
  loadGrammar();
}
function loadGrammar(){
  const v=document.getElementById("grammarSource").value;
  grammarLvl=v.indexOf("OX:")===0?v.slice(3):v;
  if(!GRAMMAR[grammarLvl])grammarLvl=Object.keys(GRAMMAR)[0]; // 沒有該級別就退回第一級
  renderGrammar();
}
function renderGrammar(){
  const box=document.getElementById("grammarList");box.innerHTML="";
  (GRAMMAR[grammarLvl]||[]).forEach((g,gi)=>{
    const card=document.createElement("div");card.className="card";card.style.background="#fff8ef";
    let ex=g.examples.map(e=>`<div class="task"><button class="btn green" style="padding:6px 12px" onclick="speak('${e.en.replace(/'/g,"")}')">🔊</button> <span><b>${e.en}</b> — ${e.zh}</span></div>`).join("");
    let qz=g.quiz.map((q,qi)=>{
      const opts=q.options.map(o=>{const oj=o.replace(/'/g,"\\'"); // 選項含單引號(can't/don't)要跳脫
        return `<button class="opt" style="display:inline-block;width:auto;margin:4px 6px" onclick="answerGrammar(${gi},${qi},'${oj}',this)">${o}</button>`;}).join("");
      return `<div style="margin:8px 0"><span class="big">${q.q.replace("___","<u>____</u>")}</span><br>${opts}<span id="gfb-${gi}-${qi}" style="margin-left:8px;font-weight:bold"></span></div>`;
    }).join("");
    card.innerHTML=`<h3>📌 ${g.title}</h3><p class="big">${g.rule}</p>${ex}<hr style="border:none;border-top:2px dashed #ffd8c9"><b>✏️ 小練習：</b>${qz}`;
    box.appendChild(card);
  });
}
function answerGrammar(gi,qi,choice,btn){
  const g=GRAMMAR[grammarLvl][gi],q=g.quiz[qi];
  const fb=document.getElementById(`gfb-${gi}-${qi}`);
  const parent=btn.parentElement;
  if(choice===q.answer){
    parent.querySelectorAll(".opt").forEach(b=>b.style.pointerEvents="none");
    btn.classList.add("correct");fb.textContent="✅ 答對了！";fb.style.color="var(--green)";
    if(!btn.dataset.scored){btn.dataset.scored="1";addStars(2);bump("gram");
      speak(q.q.replace("___",q.answer));}
  }else{
    btn.classList.add("wrong");fb.textContent="❌ 再想想";fb.style.color="#ef5350";
  }
}
