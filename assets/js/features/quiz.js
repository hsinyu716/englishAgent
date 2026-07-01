// feature：聽力測驗
/* ---------- 聽力測驗 ---------- */
let quizWord,quizScore=0,quizPool=ALL,quizMode="THEME";
function initQuizSource(){
  const sel=document.getElementById("quizSource");
  const g1=document.createElement("optgroup");g1.label="📚 生活主題（聽音選圖）";
  const o0=document.createElement("option");o0.value="THEME";o0.textContent="生活主題混合";g1.appendChild(o0);
  sel.appendChild(g1);
  if(window.OXFORD&&window.OXFORD.length){
    const g2=document.createElement("optgroup");g2.label="🎓 Oxford 分級（聽音選中文）";
    ["A1","A2","B1","B2","C1"].forEach(l=>{
      const n=(window.OXFORD||[]).filter(w=>w.lvl===l&&w.en.length>=3).length;
      if(!n)return;
      const o=document.createElement("option");o.value="OX:"+l;o.textContent=(LVL_LABEL[l]||l)+"（"+n+"字）";g2.appendChild(o);
    });
    sel.appendChild(g2);
  }
  loadQuizPool();
}
function loadQuizPool(){
  const v=document.getElementById("quizSource").value;
  if(v.indexOf("OX:")===0){
    quizMode="OX";
    const lvl=v.slice(3);
    quizPool=(window.OXFORD||[]).filter(w=>w.lvl===lvl&&w.en.length>=3)
      .map(w=>({en:w.en,zh:null,lvl:w.lvl}));
    document.getElementById("quizHint").textContent="聽發音，選出正確的中文意思！";
  }else{
    quizMode="THEME";quizPool=ALL;
    document.getElementById("quizHint").textContent="聽發音，選出正確的圖片！";
  }
  nextQuiz();
}
async function nextQuiz(){
  document.getElementById("quizFeedback").textContent="";
  quizWord=quizPool[Math.floor(Math.random()*quizPool.length)];
  const cur=quizWord;
  const opts=[quizWord];
  while(opts.length<4){
    const w=quizPool[Math.floor(Math.random()*quizPool.length)];
    if(!opts.find(o=>o.en===w.en))opts.push(w);
  }
  opts.sort(()=>Math.random()-.5);
  const box=document.getElementById("quizOptions");box.innerHTML="";
  if(quizMode==="OX"){
    box.textContent="準備選項中… ⏳";
    // 每個選項都要中文（快取，重複幾乎免費）
    await Promise.all(opts.map(async o=>{if(!o.zh)o.zh=await getZh(o.en)||o.en;}));
    if(quizWord!==cur)return; // 使用者已切下一題/換級別就放棄這批選項
    box.innerHTML="";
    opts.forEach(o=>{
      const b=document.createElement("button");b.className="opt";b.style.textAlign="center";
      const en=document.createElement("b");en.textContent=o.en;
      const zh=document.createElement("span");zh.textContent="　"+o.zh;
      b.appendChild(en);b.appendChild(zh);
      b.onclick=()=>answerQuiz(o,b);box.appendChild(b);
    });
  }else{
    const row=document.createElement("div");row.className="row center";
    opts.forEach(o=>{
      const b=document.createElement("button");b.className="tile";b.style.fontSize="48px";
      b.style.width="90px";b.style.height="90px";b.textContent=o.emoji;
      b.onclick=()=>answerQuiz(o,b);row.appendChild(b);
    });
    box.appendChild(row);
  }
  fetchDict(quizWord.en); // 預抓真人發音
  setTimeout(()=>playWord(quizWord.en),300);
}
function answerQuiz(o,btn){
  const fb=document.getElementById("quizFeedback");
  if(o.en===quizWord.en){
    fb.textContent="🎉 對了！"+quizWord.en+" = "+(quizWord.zh||"");fb.style.color="var(--green)";
    quizScore++;document.getElementById("quizScore").textContent=quizScore;
    addStars(3);bump("quiz");
    setTimeout(nextQuiz,1500);
  }else{
    fb.textContent="😅 這是 "+o.en+"（"+(o.zh||"")+"），再聽一次！";fb.style.color="#ef5350";
    btn.style.opacity=".3";
  }
}
