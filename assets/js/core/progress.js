// core 層：等級(XP)、成就徽章、慶祝動畫、進度渲染
/* ---------- 等級（XP）與成就 ---------- */
const RANKS=[
  {min:0,icon:"🥚",name:"英文小蛋"},{min:15,icon:"🐣",name:"新手探險家"},
  {min:40,icon:"🏹",name:"單字小獵人"},{min:80,icon:"🦉",name:"閱讀貓頭鷹"},
  {min:140,icon:"🦅",name:"句子飛鷹"},{min:220,icon:"🐲",name:"文法小龍"},
  {min:320,icon:"⚔️",name:"英文小勇者"},{min:450,icon:"👑",name:"英文大王"},
  {min:600,icon:"🏆",name:"傳說英雄"}
];
function rankInfo(stars){
  let i=0;for(let k=0;k<RANKS.length;k++)if(stars>=RANKS[k].min)i=k;
  const cur=RANKS[i],next=RANKS[i+1]||null;
  const into=stars-cur.min,span=next?next.min-cur.min:1;
  return {lvl:i+1,cur,next,pct:next?Math.min(100,Math.round(into/span*100)):100,toNext:next?next.min-stars:0};
}
const BADGES=[
  {id:"first",icon:"⭐",name:"第一顆星",desc:"拿到第一顆星星",test:s=>s.stars>=1},
  {id:"star50",icon:"🌟",name:"星星新星",desc:"累積 50 顆星",test:s=>s.stars>=50},
  {id:"star150",icon:"💫",name:"星星大師",desc:"累積 150 顆星",test:s=>s.stars>=150},
  {id:"streak3",icon:"🔥",name:"三天不斷電",desc:"連續學習 3 天",test:s=>(s.bestStreak||0)>=3},
  {id:"streak7",icon:"🔥",name:"一週全勤",desc:"連續學習 7 天",test:s=>(s.bestStreak||0)>=7},
  {id:"flip50",icon:"🃏",name:"翻卡狂人",desc:"翻 50 張閃卡",test:s=>(s.lt.flip||0)>=50},
  {id:"spell20",icon:"🔤",name:"拼字高手",desc:"拼對 20 個字",test:s=>(s.lt.spell||0)>=20},
  {id:"quiz20",icon:"🎧",name:"好耳朵",desc:"聽力答對 20 題",test:s=>(s.lt.quiz||0)>=20},
  {id:"sent10",icon:"🧩",name:"造句高手",desc:"完成 10 句重組",test:s=>(s.lt.sent||0)>=10},
  {id:"gram10",icon:"📘",name:"文法小老師",desc:"文法答對 10 題",test:s=>(s.lt.gram||0)>=10},
  {id:"words10",icon:"📓",name:"單字收藏家",desc:"記下 10 個新單字",test:s=>(s.words||[]).length>=10},
  {id:"days7",icon:"📅",name:"暑假達人",desc:"累積學習 7 天",test:s=>(s.days||0)>=7}
];
function checkBadges(){
  const newly=[];
  BADGES.forEach(b=>{if(!save.badges[b.id]&&b.test(save)){save.badges[b.id]=true;newly.push(b);}});
  if(newly.length){persist();renderProgress();newly.forEach(b=>toast("🏅 解鎖成就！",b.icon,b.name+"｜"+b.desc));}
}
function toast(title,big,desc){
  const t=document.createElement("div");t.className="toast";
  t.innerHTML=`<div style="font-size:14px;color:#8a8aa0">${title}</div><div style="font-size:38px">${big}</div><div style="font-size:14px;font-weight:bold">${desc||""}</div>`;
  document.body.appendChild(t);confetti();
  setTimeout(()=>{t.classList.add("out");setTimeout(()=>t.remove(),500);},2600);
}

function addStars(n){
  const before=rankInfo(save.stars).lvl;
  save.stars+=n;save.count+=n;
  save.hist[todayStr()]=(save.hist[todayStr()]||0)+n;
  touchStreak();
  persist();renderScore();renderProgress();confetti();
  const after=rankInfo(save.stars).lvl;
  if(after>before){const r=RANKS[after-1];toast("🎉 升級了！",r.icon,"Lv."+after+"　"+r.name);}
  checkBadges();
}
function renderScore(){
  const r=rankInfo(save.stars);
  document.getElementById("hdrRank").textContent=r.cur.icon+" Lv."+r.lvl+" "+r.cur.name;
  document.getElementById("hdrStars").textContent="⭐ "+save.stars;
  document.getElementById("hdrStreak").textContent="🔥 連續 "+(save.streak||0)+" 天";
  document.getElementById("xpFill").style.width=r.pct+"%";
  document.getElementById("xpText").textContent=r.next?("再 "+r.toNext+" ⭐ 升到「"+r.next.icon+" "+r.next.name+"」"):"已達最高等級 👑 你太強了！";
}
function renderProgress(){
  const el=document.getElementById("progressBody");if(!el)return;
  const r=rankInfo(save.stars),lt=save.lt;
  const stat=(icon,label,val)=>`<div class="statc"><div style="font-size:26px">${icon}</div><div class="statn">${val}</div><div class="muted" style="font-size:13px">${label}</div></div>`;
  const days=[];for(let i=6;i>=0;i--)days.push(shiftDay(-i));
  const max=Math.max(1,...days.map(d=>save.hist[d]||0));
  const bars=days.map(d=>{const v=save.hist[d]||0;const h=Math.round(v/max*100);const lbl=d.split("-").slice(1).join("/");
    return `<div class="barwrap"><div class="barval">${v||""}</div><div class="bar" style="height:${h}%"></div><div class="barlbl">${lbl}</div></div>`;}).join("");
  const got=BADGES.filter(b=>save.badges[b.id]).length;
  const badges=BADGES.map(b=>{const on=save.badges[b.id];
    return `<div class="badge ${on?'on':'off'}"><div style="font-size:30px">${on?b.icon:'🔒'}</div><div style="font-weight:bold;font-size:14px">${b.name}</div><div class="muted" style="font-size:12px">${b.desc}</div></div>`;}).join("");
  el.innerHTML=`
    <div class="card center" style="background:linear-gradient(145deg,#ab7df6,#7c5fe6);color:#fff">
      <div style="font-size:52px">${r.cur.icon}</div>
      <h2 style="margin:6px 0">Lv.${r.lvl}　${r.cur.name}</h2>
      <div class="xpbar" style="background:rgba(255,255,255,.3)"><div class="xpfill" style="width:${r.pct}%"></div></div>
      <div style="font-size:14px;margin-top:8px">${r.next?('離「'+r.next.icon+' '+r.next.name+'」還差 <b>'+r.toNext+'</b> ⭐'):'已達最高等級，太厲害了！👑'}</div>
    </div>
    <div class="card">
      <h3>🔥 連續學習</h3>
      <div class="row center" style="gap:24px">
        ${stat("🔥",'目前連續天數',save.streak||0)}
        ${stat("🏅",'最佳紀錄',save.bestStreak||0)}
        ${stat("📅",'總學習天數',save.days||0)}
      </div>
      <p class="muted center">每天來玩一下，連續天數才不會斷掉喔！</p>
    </div>
    <div class="card">
      <h3>📊 累積戰績</h3>
      <div class="statgrid">
        ${stat("⭐",'總星星',save.stars)}
        ${stat("🃏",'翻閃卡',lt.flip||0)}
        ${stat("🔤",'拼對字',lt.spell||0)}
        ${stat("🎧",'聽力答對',lt.quiz||0)}
        ${stat("🧩",'完成句子',lt.sent||0)}
        ${stat("📘",'文法答對',lt.gram||0)}
        ${stat("📓",'收藏單字',(save.words||[]).length)}
      </div>
    </div>
    <div class="card">
      <h3>📈 最近 7 天的星星</h3>
      <div class="chart">${bars}</div>
    </div>
    <div class="card">
      <h3>🏆 成就徽章（${got}/${BADGES.length}）</h3>
      <div class="badgegrid">${badges}</div>
    </div>`;
}
function confetti(){
  const e=["🎉","⭐","🌟","✨","🎈"];
  for(let i=0;i<12;i++){
    const c=document.createElement("div");c.className="confetti";
    c.textContent=e[i%e.length];c.style.left=(Math.random()*100)+"vw";
    c.style.animationDelay=(Math.random()*.4)+"s";document.body.appendChild(c);
    setTimeout(()=>c.remove(),2200);
  }
}
