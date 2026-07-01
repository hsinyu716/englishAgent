// feature：單字閃卡
/* ---------- 閃卡 ---------- */
let flashList=[],flashIdx=0,flashFlipped=false;
function initFlashThemes(){
  const sel=document.getElementById("flashTheme");
  if(window.OXFORD&&window.OXFORD.length){
    const g2=document.createElement("optgroup");g2.label="🎓 Oxford 分級（越後面越難）";
    ["A1","A2","B1","B2","C1"].forEach(l=>{
      const n=window.OXFORD.filter(w=>w.lvl===l).length;
      if(!n)return;
      const o=document.createElement("option");o.value="OX:"+l;o.textContent=(LVL_LABEL[l]||l)+"（"+n+"字）";g2.appendChild(o);
    });
    sel.appendChild(g2);
  }
    const g1=document.createElement("optgroup");g1.label="📚 生活主題（基礎，附 emoji）";
    Object.keys(THEMES).forEach(k=>{const o=document.createElement("option");o.value=k;o.textContent=k;g1.appendChild(o);});
    sel.appendChild(g1);

    pickDefaultLevel(sel);
    loadFlash();
}
function loadFlash(){
  const v=document.getElementById("flashTheme").value;
  if(v.indexOf("OX:")===0){
    const lvl=v.slice(3);
    flashList=(window.OXFORD||[]).filter(w=>w.lvl===lvl)
      .map(w=>({en:w.en,zh:null,emoji:"📘",ph:w.ph,ex:w.ex,df:w.df,pos:w.pos,lvl:w.lvl}))
      .sort(()=>Math.random()-.5); // 打散，每次順序不同
  }else{
    flashList=THEMES[v];
  }
  flashIdx=0;showFlash();
}
async function showFlash(){
  const c=flashList[flashIdx];flashFlipped=false;
  document.getElementById("flashCard").classList.remove("flip");
  document.getElementById("fEmoji").textContent=c.emoji||"📘";
  document.getElementById("fWord").textContent=c.en;
  document.getElementById("flashProgress").textContent=(flashIdx+1)+" / "+flashList.length+(c.lvl?"　🎓 "+c.lvl:"");
  const zhEl=document.getElementById("fZh");
  if(c.zh){zhEl.textContent=c.zh;}
  else{ // Oxford 字沒有中文 → 用 MyMemory 即時翻譯並快取
    zhEl.textContent="翻譯中… ⏳";
    const t=await getZh(c.en);
    c.zh=t||"（先聽發音記字）";
    if(flashList[flashIdx]===c)zhEl.textContent=c.zh;
  }
  enrichFlash(c);
}
async function enrichFlash(c){
  const ph=document.getElementById("fPhonetic"),ex=document.getElementById("fExample"),src=document.getElementById("fSource");
  // 先用本地字庫資料（Oxford 自帶音標/例句/定義），立刻顯示
  ph.textContent=c.ph||"";
  ex.textContent=c.ex?("📝 "+c.ex):(c.ph?"":"查字典中… ⏳");
  src.textContent=c.df?((c.pos?"["+c.pos+"] ":"")+c.df):"";
  // 再抓真人發音（也順便補主題字缺的音標/例句）
  const rec=await fetchDict(c.en);
  if(flashList[flashIdx].en!==c.en)return;
  if(!c.ph&&rec.phonetic)ph.textContent=rec.phonetic;
  if(!c.ex){ex.textContent=rec.example?("📝 "+rec.example):(rec.ok?"":"（字典離線，用電腦發音）");}
  if(!c.df)src.textContent=rec.audio?"🎧 真人發音 by Free Dictionary API":"";
}
function flipFlash(){flashFlipped=!flashFlipped;document.getElementById("flashCard").classList.toggle("flip",flashFlipped);}
function speakCurrent(){playWord(flashList[flashIdx].en);}
function nextFlash(){flashIdx=(flashIdx+1)%flashList.length;showFlash();bump("flip");setTimeout(()=>playWord(flashList[flashIdx].en),200);}
function prevFlash(){flashIdx=(flashIdx-1+flashList.length)%flashList.length;showFlash();}
