// core 層：存檔 / 日期 / 連續天數（localStorage）
/* ---------- 存檔 ---------- */
const KEY="summerEnglishSave";
let save = JSON.parse(localStorage.getItem(KEY) || "null") || {stars:0,today:"",count:0,tasks:{},words:[]};
// 補齊新欄位（讓舊存檔也能升級）
save.hist=save.hist||{};                 // 每天賺到的星星，畫 7 天圖用
save.lt=save.lt||{};                     // 累積戰績 lifetime counters
["flip","spell","quiz","sent","gram"].forEach(k=>{if(save.lt[k]==null)save.lt[k]=0;});
save.badges=save.badges||{};             // 已解鎖成就
save.spell=save.spell||{};               // 拼字對錯記錄：每個題庫 {seen:{字:1}, right, wrong}
save.streak=save.streak||0;              // 目前連續天數
save.bestStreak=save.bestStreak||0;      // 最佳連續紀錄
save.days=save.days||0;                  // 總學習天數
function persist(){localStorage.setItem(KEY,JSON.stringify(save));}
function dayKey(d){return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
function todayStr(){return dayKey(new Date());}
function shiftDay(n){const d=new Date();d.setDate(d.getDate()+n);return dayKey(d);}
if(save.today!==todayStr()){save.today=todayStr();save.count=0;save.tasks={};persist();}

// 每天賺到第一顆星時更新連續天數
function touchStreak(){
  const t=todayStr();
  if(save.lastEarnDay===t)return;
  if(save.lastEarnDay===shiftDay(-1))save.streak=(save.streak||0)+1; // 昨天也有 → 連續+1
  else save.streak=1;                                                // 中斷 → 重新開始
  save.lastEarnDay=t;
  save.days=(save.days||0)+1;
  save.bestStreak=Math.max(save.bestStreak||0,save.streak);
}
