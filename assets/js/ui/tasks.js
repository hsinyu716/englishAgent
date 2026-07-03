// ui 層：每日任務 + 活動計數(bump)
/* ---------- 每日任務 ---------- */
const TASKS=[
  {id:"flip5",label:"翻 5 張單字閃卡 🃏"},
  {id:"spell3",label:"完成 3 題拼字 🔤"},
  {id:"sent2",label:"完成 2 題句子重組 🧩"},
  {id:"gram1",label:"做 1 題文法練習 📘"},
  {id:"quiz3",label:"聽力測驗答對 3 題 🎧"},
  {id:"read1",label:"到閱讀角讀一篇 📚"}
];
function renderTasks(){
  const box=document.getElementById("tasks");box.innerHTML="";
  TASKS.forEach(t=>{
    const done=save.tasks[t.id];
    const d=document.createElement("div");d.className="task"+(done?" done":"");
    // 當天勾選後就鎖定，不能再點擊，避免重複加分
    d.innerHTML=`<input type="checkbox" ${done?"checked disabled":""} onclick="toggleTask('${t.id}')"> <span>${t.label}</span>`;
    box.appendChild(d);
  });
}
function toggleTask(id){
  if(save.tasks[id])return;      // 已完成就不再處理
  save.tasks[id]=true;addStars(2);
  renderTasks();
}
let counters={flip:0,spell:0,quiz:0,sent:0,gram:0};
function bump(kind){
  counters[kind]++;
  save.lt[kind]=(save.lt[kind]||0)+1;persist();checkBadges(); // 累積戰績 + 檢查成就
  if(kind==="flip"&&counters.flip>=5&&!save.tasks.flip5)toggleTask("flip5");
  if(kind==="spell"&&counters.spell>=3&&!save.tasks.spell3)toggleTask("spell3");
  if(kind==="sent"&&counters.sent>=2&&!save.tasks.sent2)toggleTask("sent2");
  if(kind==="gram"&&counters.gram>=1&&!save.tasks.gram1)toggleTask("gram1");
  if(kind==="quiz"&&counters.quiz>=3&&!save.tasks.quiz3)toggleTask("quiz3");
}
