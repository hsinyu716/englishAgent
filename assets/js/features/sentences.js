// feature：句子重組（含真實例句）
/* ---------- 句子重組 ---------- */
const SENTENCES=[
  {en:"This is a dog.",zh:"這是一隻狗。"},
  {en:"I have a cat.",zh:"我有一隻貓。"},
  {en:"I like apples.",zh:"我喜歡蘋果。"},
  {en:"The sun is hot.",zh:"太陽很熱。"},
  {en:"It is a red apple.",zh:"這是一顆紅蘋果。"},
  {en:"I see a bird.",zh:"我看到一隻鳥。"},
  {en:"My mother is kind.",zh:"我的媽媽很親切。"},
  {en:"I go to school.",zh:"我去上學。"},
  {en:"The cat is black.",zh:"那隻貓是黑色的。"},
  {en:"I can see a rainbow.",zh:"我看得到彩虹。"}
];
let sentItem,sentPicked=[],sentMode="THEME",sentOxLvl=null;
function tokenize(en){return en.replace(/[.?!]/g,"").trim().split(/\s+/);}

// Oxford 模式用「真實例句」來重組（不是模板換字）：句子自然又多變。
// 只挑乾淨完整的句子，避免片語、含逗號/斜線/括號等難處理的例句。
function cleanSentence(s){
  if(!s)return false;s=s.trim();
  if(!/^[A-Z]/.test(s))return false;                 // 大寫開頭＝完整句
  if(!/[.?!]$/.test(s))return false;                 // 句尾有標點
  if(!/^[A-Za-z' ]+$/.test(s.slice(0,-1)))return false; // 只留字母/縮寫'/空白
  const n=s.slice(0,-1).split(/\s+/).length;
  return n>=4&&n<=8;                                 // 4~8 詞，好玩不太長
}
function oxSentPool(lvl){return (window.OXFORD||[]).filter(w=>w.lvl===lvl&&cleanSentence(w.ex));}
function initSentSource(){
  const sel=document.getElementById("sentSource");
  const g1=document.createElement("optgroup");g1.label="📚 生活句型（基礎）";
  const o0=document.createElement("option");o0.value="THEME";o0.textContent="生活常用句";g1.appendChild(o0);
  sel.appendChild(g1);
  if(window.OXFORD&&window.OXFORD.length){
    const g2=document.createElement("optgroup");g2.label="🎓 Oxford 分級（真實例句）";
    ["A1","A2","B1","B2","C1"].forEach(l=>{
      const n=oxSentPool(l).length;if(!n)return;
      const o=document.createElement("option");o.value="OX:"+l;o.textContent=(LVL_LABEL[l]||l)+"（"+n+"句）";g2.appendChild(o);
    });
    sel.appendChild(g2);
  }
  loadSentPool();
}
function loadSentPool(){
  const v=document.getElementById("sentSource").value;
  if(v.indexOf("OX:")===0){sentMode="OX";sentOxLvl=v.slice(3);}
  else{sentMode="THEME";sentOxLvl=null;}
  nextSent();
}
function buildSentTiles(en){
  const shuffled=tokenize(en).sort(()=>Math.random()-.5);
  const box=document.getElementById("sentTiles");box.innerHTML="";
  shuffled.forEach(w=>{
    const b=document.createElement("button");b.className="tile";b.style.fontSize="18px";
    b.textContent=w;b.onclick=()=>{b.classList.add("used");sentPicked.push(w);renderSent();checkSent();};
    box.appendChild(b);
  });
  renderSent();
}
function nextSent(){
  document.getElementById("sentFeedback").textContent="";
  sentPicked=[];
  const zhEl=document.getElementById("sentZh");
  if(sentMode==="OX"){
    const pool=oxSentPool(sentOxLvl);
    const w=pool[Math.floor(Math.random()*pool.length)];
    const en=w.ex.trim();                 // 真實例句
    sentItem={en,zh:null,word:w};
    const cur=sentItem;
    zhEl.textContent="翻譯中… ⏳";
    getZh(en).then(t=>{cur.zh=t||en;if(sentItem===cur)zhEl.textContent=cur.zh;}); // 整句翻譯（快取）
    buildSentTiles(en);
  }else{
    sentItem=SENTENCES[Math.floor(Math.random()*SENTENCES.length)];
    zhEl.textContent=sentItem.zh;
    buildSentTiles(sentItem.en);
  }
}
function renderSent(){
  document.getElementById("sentBox").textContent=sentPicked.length?sentPicked.join(" "):"👆 點單字排句子";
}
function clearSent(){
  sentPicked=[];document.querySelectorAll("#sentTiles .tile").forEach(t=>t.classList.remove("used"));
  document.getElementById("sentFeedback").textContent="";renderSent();
}
function checkSent(){
  const target=tokenize(sentItem.en);
  if(sentPicked.length===target.length){
    const fb=document.getElementById("sentFeedback");
    if(sentPicked.join(" ")===target.join(" ")){
      fb.textContent="🎉 完成！"+sentItem.en;fb.style.color="var(--green)";
      addStars(4);bump("sent");speak(sentItem.en);setTimeout(nextSent,1800);
    }else{
      fb.textContent="😅 順序不太對，再試試！";fb.style.color="#ef5350";setTimeout(clearSent,1000);
    }
  }
}
function renderPatterns(){
  const box=document.getElementById("patternList");box.innerHTML="";
  SENTENCES.forEach(s=>{
    const d=document.createElement("div");d.className="task";
    d.innerHTML=`<button class="btn green" style="padding:6px 12px" onclick="speak('${s.en.replace(/'/g,"")}')">🔊</button> <span><b>${s.en}</b><br><span class="muted">${s.zh}</span></span>`;
    box.appendChild(d);
  });
}
