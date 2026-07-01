// core 層：進度匯出 / 匯入（讓不同裝置能有相同進度，不需要資料庫）
/* ---------- 進度備份 ---------- */
function backupMsg(text,ok){
  const el=document.getElementById("backupMsg");if(!el)return;
  el.textContent=text;el.style.color=ok?"var(--green)":"#ef5350";
}
// 把整包存檔包成有版本資訊的 JSON
function buildBackupJSON(){
  const envelope={app:"summerEnglish",v:1,exportedAt:new Date().toISOString(),data:save};
  return JSON.stringify(envelope);
}
function exportProgress(){
  try{
    const json=buildBackupJSON();
    const blob=new Blob([json],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    const d=new Date(),pad=n=>String(n).padStart(2,"0");
    a.href=url;a.download="english-progress-"+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+".json";
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    backupMsg("✅ 已下載進度檔案，拿到新裝置後用「從檔案匯入」即可",true);
  }catch(e){backupMsg("😥 匯出失敗："+e.message,false);}
}
function copyProgress(){
  const json=buildBackupJSON();
  const done=()=>backupMsg("✅ 已複製進度代碼，貼到新裝置的框框裡再按匯入",true);
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(json).then(done).catch(()=>fallbackCopy(json,done));
  }else{fallbackCopy(json,done);}
}
function fallbackCopy(text,done){
  const ta=document.createElement("textarea");ta.value=text;
  ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);
  ta.select();
  try{document.execCommand("copy");done();}
  catch(e){const box=document.getElementById("importText");if(box)box.value=text;backupMsg("已把代碼放到下方框框，請手動複製",true);}
  ta.remove();
}
function importFromFile(input){
  const f=input.files&&input.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{applyImport(String(r.result));input.value="";};
  r.onerror=()=>backupMsg("😥 讀取檔案失敗",false);
  r.readAsText(f);
}
function importFromText(){
  const box=document.getElementById("importText");
  applyImport(box?box.value:"");
}
// 匯入：解析 → 驗證 → 覆蓋存檔 → 重新整理畫面
function applyImport(text){
  text=(text||"").trim();
  if(!text){backupMsg("請先選擇檔案，或把進度代碼貼上",false);return;}
  let obj;
  try{obj=JSON.parse(text);}catch(e){backupMsg("😥 格式不對，讀不出這段進度代碼",false);return;}
  const data=(obj&&obj.data&&typeof obj.data==="object")?obj.data:obj; // 支援有無外層包裝
  if(!data||typeof data!=="object"||(data.stars==null&&data.lt==null&&!Array.isArray(data.words))){
    backupMsg("😥 這不是有效的進度資料",false);return;
  }
  save=data; // 覆蓋（storage.js 的 let save 為全域繫結，其他檔案會看到新值）
  // 補齊欄位，讓缺漏的舊備份也能正常運作
  save.stars=save.stars||0;save.count=save.count||0;
  save.hist=save.hist||{};save.lt=save.lt||{};
  ["flip","spell","quiz","sent","gram"].forEach(k=>{if(save.lt[k]==null)save.lt[k]=0;});
  save.badges=save.badges||{};save.spell=save.spell||{};
  save.quizRec=save.quizRec||{};save.sentRec=save.sentRec||{};
  save.words=Array.isArray(save.words)?save.words:[];
  save.tasks=save.tasks||{};
  save.streak=save.streak||0;save.bestStreak=save.bestStreak||0;save.days=save.days||0;
  persist();
  refreshAllUI();
  const box=document.getElementById("importText");if(box)box.value="";
  backupMsg("✅ 匯入成功！目前 ⭐ "+(save.stars||0)+" 顆星，進度已更新",true);
}
// 匯入後重新渲染所有畫面（不重建下拉選單，避免選項重複）
function refreshAllUI(){
  [ "renderScore","renderProgress","renderTasks","renderWords","checkBadges",
    "loadFlash","loadSpellPool","loadSentPool","loadQuizPool","loadGrammar" ]
    .forEach(fn=>{try{if(typeof window[fn]==="function")window[fn]();}catch(e){}});
}
