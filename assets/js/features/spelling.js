// feature：拼字遊戲
/* ---------- 拼字 ---------- */
let spellWord,spellAnswer=[],spellBtns=[],spellPool=ALL,spellPoolKey="THEME";
// 取得目前題庫的對錯記錄（沒有就建立）
function spellRec(){
  const r=save.spell[spellPoolKey]||(save.spell[spellPoolKey]={seen:{},right:0,wrong:0});
  if(!r.seen)r.seen={};if(r.right==null)r.right=0;if(r.wrong==null)r.wrong=0;
  return r;
}
function renderSpellStats(){
  const rec=spellRec(),total=spellPool.length,done=Object.keys(rec.seen).length;
  const sc=document.getElementById("spellScore");
  if(sc)sc.innerHTML="✅ 答對 <b>"+rec.right+"</b>　❌ 答錯 <b>"+rec.wrong+"</b>";
  const pg=document.getElementById("spellProgress");
  if(pg)pg.textContent="📖 進度 "+Math.min(done,total)+" / "+total+(spellWord&&spellWord.lvl?"　🎓 "+spellWord.lvl:"");
  updateSpellStarBtn();
}
// 目前這個字有沒有在收藏裡
function isStarred(en){return (save.words||[]).some(w=>w.en.toLowerCase()===String(en).toLowerCase());}
function updateSpellStarBtn(){
  const btn=document.getElementById("spellStarBtn");if(!btn)return;
  if(!spellWord){btn.style.visibility="hidden";return;}
  btn.style.visibility="visible";
  btn.textContent=isStarred(spellWord.en)?"⭐ 已收藏":"⭐ 收藏";
  updateFavBtn();
}
// 把目前這個「不熟的字」加入收藏 / 取消收藏（和「我的單字」共用）
function toggleSpellStar(){
  if(!spellWord)return;
  const en=spellWord.en,i=(save.words||[]).findIndex(w=>w.en.toLowerCase()===en.toLowerCase());
  if(i>=0){save.words.splice(i,1);persist();}
  else{
    const zh=spellWord.zh&&spellWord.zh.indexOf("翻譯中")<0?spellWord.zh:"";
    save.words.push({en,zh:zh||"(不熟的字，之後再練)"});persist();checkBadges();
  }
  updateSpellStarBtn();updateFavBtn();
  if(typeof renderWords==="function")renderWords();
  if(document.getElementById("favModal"))openFavModal(); // 彈窗開著就同步更新
}
function initSpellSource(){
  const sel=document.getElementById("spellSource");
  const gs=document.createElement("optgroup");gs.label="⭐ 我的收藏";
  const os=document.createElement("option");os.value="STAR";os.textContent="⭐ 收藏的單字（重新測試）";gs.appendChild(os);
  sel.appendChild(gs);
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
  pickDefaultLevel(sel);
  const sayBtn=document.getElementById("spellSayBtn");
  if(sayBtn&&!spellSaySupported())sayBtn.style.display="none"; // 瀏覽器不支援就隱藏
  loadSpellPool();
}
function loadSpellPool(){
  const v=document.getElementById("spellSource").value;
  spellPoolKey=v;
  if(v==="STAR"){
    // 收藏的單字（只收拼得出來的：3~10 字母、無空格）
    spellPool=(save.words||[]).filter(w=>/^[a-zA-Z]{3,10}$/.test(w.en))
      .map(w=>({en:w.en.toLowerCase(),zh:w.zh&&w.zh.indexOf("不熟的字")<0?w.zh:null,emoji:"⭐"}));
  }else if(v.indexOf("OX:")===0){
    const lvl=v.slice(3);
    // 只收 3~10 字母的單字（排除 "a"、"according to" 等太短/含空格的）
    spellPool=(window.OXFORD||[]).filter(w=>w.lvl===lvl&&/^[a-zA-Z]{3,10}$/.test(w.en))
      .map(w=>({en:w.en.toLowerCase(),zh:null,emoji:"📘",lvl:w.lvl}));
  }else{
    spellPool=ALL;
  }
  if(!spellPool.length){ // 收藏是空的
    spellWord=null;
    document.getElementById("sEmoji").textContent="⭐";
    document.getElementById("sZh").textContent="還沒有收藏任何單字，先在遊戲中按「⭐ 收藏」吧！";
    document.getElementById("answerBox").textContent="";
    document.getElementById("tiles").innerHTML="";
    document.getElementById("spellFeedback").textContent="";
    renderSpellStats();
    return;
  }
  nextSpell();
}
// 從還沒出過的題目裡隨機挑一個；全部出完就回傳 null
function pickUnseen(){
  const rec=spellRec();
  const remain=spellPool.filter(w=>!rec.seen[w.en]);
  if(!remain.length)return null;
  return remain[Math.floor(Math.random()*remain.length)];
}
function resetSpellRecord(){
  save.spell[spellPoolKey]={seen:{},right:0,wrong:0};persist();nextSpell();
}
// 叫出收藏的單字清單（彈窗）：可播放、刪除、直接重新測試
function openFavModal(){
  closeFavModal();
  const words=save.words||[];
  const back=document.createElement("div");back.className="modal-back";back.id="favModal";
  back.onclick=e=>{if(e.target===back)closeFavModal();};
  const items=words.length
    ? words.map((w,i)=>`<li><b>${escHtml(w.en)}</b><span class="wzh">${escHtml(w.zh||"")}</span>`
        +`<button class="btn green" style="padding:4px 10px;font-size:14px" onclick="playWord('${w.en.replace(/[^a-zA-Z ]/g,"")}')">🔊</button>`
        +`<button class="btn gray" style="padding:4px 10px;font-size:14px" onclick="removeFav(${i})">🗑️</button></li>`).join("")
    : `<li style="border:none;color:#8a8aa0">還沒有收藏單字，玩拼字時按「⭐ 收藏」把不熟的字存起來吧！</li>`;
  back.innerHTML=`<div class="modal">
    <h3>📓 我的收藏（${words.length} 字）</h3>
    <ul class="wordlist" id="favList">${items}</ul>
    <div class="row center" style="margin-top:16px">
      ${words.length?'<button class="btn purple" onclick="testStarredSpelling()">🔤 用拼字重新測試</button>':''}
      <button class="btn gray" onclick="closeFavModal()">關閉</button>
    </div></div>`;
  document.body.appendChild(back);
  updateFavBtn();
}
function closeFavModal(){const m=document.getElementById("favModal");if(m)m.remove();}
function removeFav(i){
  save.words.splice(i,1);persist();
  if(typeof renderWords==="function")renderWords();
  updateSpellStarBtn();updateFavBtn();
  openFavModal(); // 重新渲染清單
}
function escHtml(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function updateFavBtn(){
  const b=document.getElementById("spellFavBtn");if(b)b.textContent="📓 我的收藏 ("+((save.words||[]).length)+")";
}
// 從「我的單字」跳到拼字遊戲，用收藏的字重新測試
function testStarredSpelling(){
  closeFavModal();
  if(typeof go==="function")go("spell");
  const sel=document.getElementById("spellSource");
  if(sel){sel.value="STAR";}
  save.spell.STAR={seen:{},right:0,wrong:0};persist(); // 重新測試 → 清空這輪記錄
  loadSpellPool();
}
function nextSpell(){
  const picked=pickUnseen();
  if(!picked){ // 這個題庫全部出完了
    spellWord=null;
    document.getElementById("sEmoji").textContent="🏆";
    document.getElementById("sZh").textContent="這個題庫全部拼完囉！";
    document.getElementById("answerBox").textContent="";
    document.getElementById("tiles").innerHTML='<button class="btn purple" onclick="resetSpellRecord()">🔄 再玩一次（清空記錄）</button>';
    const rec=spellRec();
    document.getElementById("spellFeedback").innerHTML="🎉 答對 "+rec.right+" 題，答錯 "+rec.wrong+" 題";
    document.getElementById("spellFeedback").style.color="var(--green)";
    renderSpellStats();
    return;
  }
  spellWord=picked;
  spellRec().seen[spellWord.en]=1;persist(); // 標記已出過
  const cur=spellWord;
  document.getElementById("sEmoji").textContent=spellWord.emoji||"📘";
  document.getElementById("spellFeedback").textContent="";
  const sayRes=document.getElementById("spellSayResult");if(sayRes)sayRes.textContent="";
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
  renderSpellStats();
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
/* ---------- 🎤 說說看：用瀏覽器語音辨識偵測發音 ---------- */
let spellRecog=null,spellListening=false;
function spellSaySupported(){return "webkitSpeechRecognition" in window||"SpeechRecognition" in window;}
function levenshtein(a,b){
  const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);
  for(let j=0;j<=n;j++)d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return d[m][n];
}
function spellSay(){
  const btn=document.getElementById("spellSayBtn"),res=document.getElementById("spellSayResult");
  if(!spellWord){return;}
  if(!spellSaySupported()){res.textContent="😥 這個瀏覽器不支援語音辨識（請用電腦版 Chrome）";return;}
  if(spellListening){try{spellRecog.stop();}catch(e){}return;} // 再按一次 → 停止
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  spellRecog=new SR();spellRecog.lang="en-US";spellRecog.maxAlternatives=5;spellRecog.interimResults=false;
  const target=spellWord.en.toLowerCase();
  spellListening=true;btn.textContent="🔴 聆聽中…（再按一次停止）";
  res.textContent="🎧 請大聲念出這個單字…";res.style.color="var(--purple)";
  spellRecog.onresult=e=>{
    const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript.toLowerCase().trim().replace(/[^a-z ]/g,""));
    const heard=alts[0]||"";
    const hit=alts.some(a=>a===target||a.split(" ").includes(target));
    const best=Math.min(...alts.map(a=>levenshtein(a.replace(/ /g,""),target)));
    if(hit||best===0){
      res.innerHTML="🎉 發音正確！你念的是 <b>"+target+"</b>";res.style.color="var(--green)";
      addStars(1);speak(target);
    }else if(best<=Math.max(1,Math.round(target.length*0.34))){
      res.innerHTML="👍 很接近！我聽到「"+(heard||"…")+"」，正確是 <b>"+target+"</b>，再念一次看看";res.style.color="var(--brand)";
    }else{
      res.innerHTML="😅 我聽到「"+(heard||"（聽不太清楚）")+"」，正確是 <b>"+target+"</b>，再試一次！";res.style.color="#ef5350";
    }
  };
  spellRecog.onerror=e=>{
    res.textContent=e.error==="not-allowed"?"🎤 請允許使用麥克風才能偵測發音喔":"😥 聽不到聲音，再試一次";
    res.style.color="#ef5350";
  };
  spellRecog.onend=()=>{spellListening=false;btn.textContent="🎤 說說看";};
  try{spellRecog.start();}catch(e){spellListening=false;btn.textContent="🎤 說說看";}
}
function check(){
  if(spellAnswer.length===spellWord.en.length){
    const fb=document.getElementById("spellFeedback");
    if(spellAnswer.join("")===spellWord.en){
      fb.textContent="🎉 太棒了！答對了！";fb.style.color="var(--green)";
      spellRec().right++;persist();renderSpellStats();
      addStars(3);bump("spell");speak(spellWord.en);
      setTimeout(nextSpell,1400);
    }else{
      fb.textContent="😅 再試一次！";fb.style.color="#ef5350";
      spellRec().wrong++;persist();renderSpellStats();
      setTimeout(clearSpell,900);
    }
  }
}
