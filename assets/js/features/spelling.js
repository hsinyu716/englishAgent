// feature：拼字遊戲
/* ---------- 拼字 ---------- */
let spellWord,spellAnswer=[],spellBtns=[],spellPool=ALL;
function initSpellSource(){
  const sel=document.getElementById("spellSource");
  const g1=document.createElement("optgroup");g1.label="📚 生活主題（基礎）";
  const o0=document.createElement("option");o0.value="THEME";o0.textContent="生活主題混合";g1.appendChild(o0);
  sel.appendChild(g1);
  if(window.OXFORD&&window.OXFORD.length){
    const g2=document.createElement("optgroup");g2.label="🎓 Oxford 分級（越後面越難）";
    ["A1","A2","B1","B2","C1"].forEach(l=>{
      const n=(window.OXFORD||[]).filter(w=>w.lvl===l&&/^[a-zA-Z]{3,10}$/.test(w.en)).length;
      if(!n)return;
      const o=document.createElement("option");o.value="OX:"+l;o.textContent=(LVL_LABEL[l]||l)+"（"+n+"字）";g2.appendChild(o);
    });
    sel.appendChild(g2);
  }
  loadSpellPool();
}
function loadSpellPool(){
  const v=document.getElementById("spellSource").value;
  if(v.indexOf("OX:")===0){
    const lvl=v.slice(3);
    // 只收 3~10 字母的單字（排除 "a"、"according to" 等太短/含空格的）
    spellPool=(window.OXFORD||[]).filter(w=>w.lvl===lvl&&/^[a-zA-Z]{3,10}$/.test(w.en))
      .map(w=>({en:w.en.toLowerCase(),zh:null,emoji:"📘",lvl:w.lvl}));
  }else{
    spellPool=ALL;
  }
  nextSpell();
}
function nextSpell(){
  spellWord=spellPool[Math.floor(Math.random()*spellPool.length)];
  const cur=spellWord;
  document.getElementById("sEmoji").textContent=spellWord.emoji||"📘";
  document.getElementById("spellFeedback").textContent="";
  spellAnswer=[];spellBtns=[];
  // 中文提示（Oxford 字沒中文 → 即時翻譯並快取）
  const zhEl=document.getElementById("sZh");
  if(spellWord.zh){zhEl.textContent=spellWord.zh;}
  else{
    zhEl.textContent="翻譯中… ⏳";
    getZh(spellWord.en).then(t=>{cur.zh=t||"（聽發音拼拼看）";if(spellWord===cur)zhEl.textContent=cur.zh;});
  }
  const letters=spellWord.en.split("");
  const shuffled=[...letters].sort(()=>Math.random()-.5);
  const tiles=document.getElementById("tiles");tiles.innerHTML="";
  shuffled.forEach((ltr,i)=>{
    const b=document.createElement("button");b.className="tile";b.textContent=ltr;
    b.onclick=()=>pickLetter(ltr,b);tiles.appendChild(b);
  });
  renderAnswer();
  fetchDict(spellWord.en); // 預抓真人發音進快取
  playWord(spellWord.en);
}
function pickLetter(ltr,btn){
  const i=spellBtns.indexOf(btn);
  if(i>=0){ // 已選過 → 再點一次取消這個字母
    spellBtns.splice(i,1);spellAnswer.splice(i,1);
    btn.classList.remove("picked");renderAnswer();return;
  }
  btn.classList.add("picked");spellBtns.push(btn);spellAnswer.push(ltr);
  renderAnswer();check();
}
function renderAnswer(){
  const box=document.getElementById("answerBox");
  box.textContent=spellAnswer.length?spellAnswer.join(""):"👆 點字母拼出來";
}
function clearSpell(){
  spellAnswer=[];spellBtns=[];
  document.querySelectorAll("#tiles .tile").forEach(t=>t.classList.remove("picked"));
  document.getElementById("spellFeedback").textContent="";renderAnswer();
}
function check(){
  if(spellAnswer.length===spellWord.en.length){
    const fb=document.getElementById("spellFeedback");
    if(spellAnswer.join("")===spellWord.en){
      fb.textContent="🎉 太棒了！答對了！";fb.style.color="var(--green)";
      addStars(3);bump("spell");speak(spellWord.en);
      setTimeout(nextSpell,1400);
    }else{
      fb.textContent="😅 再試一次！";fb.style.color="#ef5350";
      setTimeout(clearSpell,900);
    }
  }
}
