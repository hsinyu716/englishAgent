// feature：文法小教室
/* ---------- 文法小教室 ---------- */
const GRAMMAR=[
  {title:"a 還是 an？",
   rule:"名詞前面通常加 a；如果單字開頭發『母音』(a,e,i,o,u) 的音，就用 an。",
   examples:[{en:"a dog",zh:"一隻狗"},{en:"a cat",zh:"一隻貓"},{en:"an apple",zh:"一顆蘋果"},{en:"an egg",zh:"一顆蛋"}],
   quiz:[{q:"___ elephant",options:["a","an"],answer:"an"},{q:"___ book",options:["a","an"],answer:"a"},
         {q:"___ orange",options:["a","an"],answer:"an"},{q:"___ banana",options:["a","an"],answer:"a"}]},
  {title:"is 還是 are？",
   rule:"一個東西（單數）用 is；兩個以上（複數）用 are。",
   examples:[{en:"The cat is cute.",zh:"這隻貓很可愛。"},{en:"The dogs are big.",zh:"這些狗很大。"}],
   quiz:[{q:"The bird ___ small.",options:["is","are"],answer:"is"},{q:"The books ___ new.",options:["is","are"],answer:"are"},
         {q:"My father ___ tall.",options:["is","are"],answer:"is"}]},
  {title:"複數要加 s",
   rule:"東西不只一個時，名詞後面通常加 s。",
   examples:[{en:"one apple",zh:"一顆蘋果"},{en:"two apples",zh:"兩顆蘋果"},{en:"three cats",zh:"三隻貓"}],
   quiz:[{q:"two ___",options:["dog","dogs"],answer:"dogs"},{q:"one ___",options:["book","books"],answer:"book"},
         {q:"five ___",options:["bird","birds"],answer:"birds"}]},
  {title:"be 動詞：am / is / are",
   rule:"I 用 am；he / she / it 用 is；you / we / they 用 are。",
   examples:[{en:"I am happy.",zh:"我很開心。"},{en:"She is a teacher.",zh:"她是老師。"},{en:"They are friends.",zh:"他們是朋友。"}],
   quiz:[{q:"I ___ a student.",options:["am","is"],answer:"am"},{q:"He ___ tall.",options:["am","is"],answer:"is"},
         {q:"They ___ happy.",options:["is","are"],answer:"are"}]}
];
function renderGrammar(){
  const box=document.getElementById("grammarList");box.innerHTML="";
  GRAMMAR.forEach((g,gi)=>{
    const card=document.createElement("div");card.className="card";card.style.background="#fff8ef";
    let ex=g.examples.map(e=>`<div class="task"><button class="btn green" style="padding:6px 12px" onclick="speak('${e.en.replace(/'/g,"")}')">🔊</button> <span><b>${e.en}</b> — ${e.zh}</span></div>`).join("");
    let qz=g.quiz.map((q,qi)=>{
      const opts=q.options.map(o=>`<button class="opt" style="display:inline-block;width:auto;margin:4px 6px" onclick="answerGrammar(${gi},${qi},'${o}',this)">${o}</button>`).join("");
      return `<div style="margin:8px 0"><span class="big">${q.q.replace("___","<u>____</u>")}</span><br>${opts}<span id="gfb-${gi}-${qi}" style="margin-left:8px;font-weight:bold"></span></div>`;
    }).join("");
    card.innerHTML=`<h3>📌 ${g.title}</h3><p class="big">${g.rule}</p>${ex}<hr style="border:none;border-top:2px dashed #ffd8c9"><b>✏️ 小練習：</b>${qz}`;
    box.appendChild(card);
  });
}
function answerGrammar(gi,qi,choice,btn){
  const g=GRAMMAR[gi],q=g.quiz[qi];
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
