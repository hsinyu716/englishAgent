// ui 層：分頁導覽
/* ---------- 導覽 ---------- */
const TABS=[["home","🏠 首頁"],["progress","🏆 進度"],["flash","🃏 閃卡"],["spell","🔤 拼字"],["quiz","🎧 聽力"],["sentence","🧩 句子"],["grammar","📘 文法"],["read","📚 閱讀"]];
function buildNav(){
  const nav=document.getElementById("nav");
  TABS.forEach(([id,label])=>{
    const b=document.createElement("button");b.textContent=label;b.onclick=()=>go(id);b.dataset.tab=id;
    nav.appendChild(b);
  });
}
function go(id){
  document.querySelectorAll("section").forEach(s=>s.classList.toggle("show",s.id===id));
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
