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
let sentItem,sentPicked=[],sentBtns=[],sentMode="THEME",sentOxLvl=null,sentPool=[],sentPoolKey="THEME";
function tokenize(en){return en.replace(/[.?!]/g,"").trim().split(/\s+/);}
// 取得目前題庫的對錯記錄（沒有就建立）
function sentRec(){
  const r=save.sentRec[sentPoolKey]||(save.sentRec[sentPoolKey]={seen:{},right:0,wrong:0});
  if(!r.seen)r.seen={};if(r.right==null)r.right=0;if(r.wrong==null)r.wrong=0;
  return r;
}
function renderSentStats(){
  const rec=sentRec(),total=sentPool.length,done=Object.keys(rec.seen).length;
  const sc=document.getElementById("sentScore");
  if(sc)sc.innerHTML="✅ 答對 <b>"+rec.right+"</b>　❌ 答錯 <b>"+rec.wrong+"</b>";
  const pg=document.getElementById("sentProgress");
  if(pg)pg.textContent="📖 進度 "+Math.min(done,total)+" / "+total+(sentMode==="OX"&&sentOxLvl?"　🎓 "+sentOxLvl:"");
}
// 挑目前該作答的句子：優先沿用上次記住的那句（重整不往前），否則從沒出過的隨機挑
function pickUnseenSent(){
  const rec=sentRec();
  if(rec.cur){ // 重整後維持同一句，題號不往前
    const c=sentPool.find(s=>s.en===rec.cur);
    if(c&&!rec.seen[c.en])return c;
  }
  const remain=sentPool.filter(s=>!rec.seen[s.en]);
  if(!remain.length)return null;
  return remain[Math.floor(Math.random()*remain.length)];
}
function resetSentRecord(){
  save.sentRec[sentPoolKey]={seen:{},right:0,wrong:0};sentItem=null;persist();showSent();
}

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
  pickDefaultLevel(sel);
  loadSentPool();
}
function loadSentPool(){
  const v=document.getElementById("sentSource").value;
  sentPoolKey=v;
  if(v.indexOf("OX:")===0){
    sentMode="OX";sentOxLvl=v.slice(3);
    sentPool=oxSentPool(sentOxLvl).map(w=>({en:w.ex.trim(),zh:null,word:w}));
  }else{
    sentMode="THEME";sentOxLvl=null;
    sentPool=SENTENCES.map(s=>({en:s.en,zh:s.zh}));
  }
  showSent();
}
function buildSentTiles(en){
  const shuffled=tokenize(en).sort(()=>Math.random()-.5);
  const box=document.getElementById("sentTiles");box.innerHTML="";
  shuffled.forEach(w=>{
    const b=document.createElement("button");b.className="tile";b.style.fontSize="18px";
    b.textContent=w;b.onclick=()=>pickSentWord(w,b);
    box.appendChild(b);
  });
  renderSent();
}
function pickSentWord(w,btn){
  const i=sentBtns.indexOf(btn);
  if(i>=0){ // 已放上去 → 再點一次取消這個字
    sentBtns.splice(i,1);sentPicked.splice(i,1);
    btn.classList.remove("picked");renderSent();return;
  }
  btn.classList.add("picked");sentBtns.push(btn);sentPicked.push(w);
  renderSent();checkSent();
}
// 前進到下一句（答對 / 按「下一句」才呼叫）：把目前這句標記完成，再換下一句
function nextSent(){
  const rec=sentRec();
  if(sentItem)rec.seen[sentItem.en]=1; // 只有真的作答／跳過才算完成
  rec.cur=null;persist();
  showSent();
}
// 顯示目前該作答的句子（重整 / 換題庫時用，不標記完成、題號不往前）
function showSent(){
  document.getElementById("sentFeedback").textContent="";
  sentPicked=[];sentBtns=[];
  const zhEl=document.getElementById("sentZh");
  const picked=pickUnseenSent();
  if(!picked){ // 這個題庫全部完成了
    sentItem=null;
    const rec=sentRec();
    zhEl.textContent="🏆 這個題庫全部完成囉！";
    document.getElementById("sentBox").textContent="";
    document.getElementById("sentTiles").innerHTML='<button class="btn purple" onclick="resetSentRecord()">🔄 再玩一次（清空記錄）</button>';
    const fb=document.getElementById("sentFeedback");
    fb.textContent="🎉 答對 "+rec.right+" 句，答錯 "+rec.wrong+" 句";fb.style.color="var(--green)";
    renderSentStats();
    return;
  }
  sentRec().cur=picked.en;persist(); // 記住目前這句，重整回來還是同一句
  if(sentMode==="OX"){
    const en=picked.en;                   // 真實例句
    sentItem=picked;
    const cur=sentItem;
    if(picked.zh){zhEl.textContent=picked.zh;}
    else{
      zhEl.textContent="翻譯中… ⏳";
      getZh(en).then(t=>{cur.zh=t||en;if(sentItem===cur)zhEl.textContent=cur.zh;}); // 整句翻譯（快取）
    }
    buildSentTiles(en);
  }else{
    sentItem=picked;
    zhEl.textContent=sentItem.zh;
    buildSentTiles(sentItem.en);
  }
  renderSentStats();
}
function renderSent(){
  document.getElementById("sentBox").textContent=sentPicked.length?sentPicked.join(" "):"👆 點單字排句子";
}
function clearSent(){
  sentPicked=[];sentBtns=[];
  document.querySelectorAll("#sentTiles .tile").forEach(t=>t.classList.remove("picked"));
  document.getElementById("sentFeedback").textContent="";renderSent();
}
function checkSent(){
  const target=tokenize(sentItem.en);
  if(sentPicked.length===target.length){
    const fb=document.getElementById("sentFeedback");
    if(sentPicked.join(" ")===target.join(" ")){
      fb.textContent="🎉 完成！"+sentItem.en;fb.style.color="var(--green)";
      sentRec().right++;persist();renderSentStats();
      addStars(4);bump("sent");speak(sentItem.en);setTimeout(nextSent,1800);
    }else{
      fb.textContent="😅 順序不太對，再試試！";fb.style.color="#ef5350";
      sentRec().wrong++;persist();renderSentStats();
      setTimeout(clearSent,1000);
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
