// core 層：等級(XP)、成就徽章、慶祝動畫、進度渲染
/* ---------- 等級（XP）與成就 ---------- */
const RANKS=[
  {min:0,icon:"🥚",name:"英文小蛋"},{min:15,icon:"🐣",name:"新手探險家"},{min:40,icon:"🏹",name:"單字小獵人"},{min:80,icon:"🦉",name:"閱讀貓頭鷹"},
  {min:140,icon:"🦅",name:"句子飛鷹"},{min:220,icon:"🐲",name:"文法小龍"},{min:320,icon:"⚔️",name:"英文小勇者"},{min:450,icon:"👑",name:"英文大王"},
  {min:600,icon:"🏆",name:"傳說英雄"},{min:800,icon:"🌟",name:"閃耀之星"},{min:1050,icon:"🚀",name:"衝天火箭"},{min:1350,icon:"🐉",name:"金龍騎士"},
  {min:1700,icon:"🧙",name:"英文大法師"},{min:2200,icon:"🦄",name:"獨角獸傳說"},{min:2800,icon:"🌈",name:"彩虹守護者"},{min:3600,icon:"💎",name:"鑽石英雄"},
  {min:4050,icon:"🛡️",name:"鋼鐵守護者"},{min:4550,icon:"⚡",name:"雷電勇士"},{min:5100,icon:"🔥",name:"烈焰鬥士"},{min:5700,icon:"❄️",name:"冰霜法師"},
  {min:6300,icon:"🌊",name:"巨浪領主"},{min:7000,icon:"🌪️",name:"風暴召喚師"},{min:7700,icon:"🗡️",name:"王者之劍"},{min:8400,icon:"🎖️",name:"榮耀將軍"},
  {min:9200,icon:"🦁",name:"百獸之王"},{min:10000,icon:"🐺",name:"荒野狼王"},{min:10800,icon:"🦈",name:"深海霸主"},{min:11700,icon:"🦖",name:"遠古霸王"},
  {min:12600,icon:"🐘",name:"大地巨獸"},{min:13600,icon:"🦚",name:"輝煌之翼"},{min:14600,icon:"🌙",name:"月光騎士"},{min:15600,icon:"☀️",name:"烈日戰神"},
  {min:16700,icon:"✨",name:"星辰旅者"},{min:17800,icon:"🎇",name:"星海領航"},{min:19000,icon:"☄️",name:"彗星使者"},{min:20200,icon:"🪐",name:"行星守望者"},
  {min:21400,icon:"🌌",name:"銀河探索者"},{min:22700,icon:"🛰️",name:"星際先鋒"},{min:24000,icon:"🛸",name:"星際指揮官"},{min:25300,icon:"🌠",name:"流星傳說"},
  {min:26700,icon:"🔮",name:"命運預言家"},{min:28100,icon:"📜",name:"古卷賢王"},{min:29600,icon:"🧭",name:"智慧領航者"},{min:31100,icon:"⚜️",name:"王朝守護神"},
  {min:32600,icon:"🏰",name:"帝國君主"},{min:34200,icon:"🔱",name:"海神之力"},{min:35800,icon:"🌩️",name:"雷神化身"},{min:37400,icon:"💫",name:"星界至尊"},
  {min:39100,icon:"👼",name:"英文守護神"},{min:40800,icon:"🥇",name:"英文之神"}
];
function rankInfo(stars){
  let i=0;for(let k=0;k<RANKS.length;k++)if(stars>=RANKS[k].min)i=k;
  const cur=RANKS[i],next=RANKS[i+1]||null;
  const into=stars-cur.min,span=next?next.min-cur.min:1;
  return {lvl:i+1,cur,next,pct:next?Math.min(100,Math.round(into/span*100)):100,toNext:next?next.min-stars:0};
}
// 各種進度取值器
const BG={
  stars:s=>s.stars||0,
  streak:s=>s.bestStreak||0,
  days:s=>s.days||0,
  flip:s=>s.lt.flip||0,
  spell:s=>s.lt.spell||0,
  quiz:s=>s.lt.quiz||0,
  sent:s=>s.lt.sent||0,
  gram:s=>s.lt.gram||0,
  words:s=>(s.words||[]).length,
  brain:s=>(s.lt.spell||0)+(s.lt.quiz||0)+(s.lt.sent||0)+(s.lt.gram||0), // 綜合答對數
  maxDay:s=>{const v=Object.values(s.hist||{});return v.length?Math.max(...v):0;} // 單日最多星
};
// 分類標題（決定顯示順序）
const BADGE_CATS={
  star:"⭐ 星星大師",streak:"🔥 連續學習",days:"📅 學習天數",brain:"🧠 綜合實力",
  flip:"🃏 閃卡",spell:"🔤 拼字",quiz:"🎧 聽力",sent:"🧩 造句",gram:"📘 文法",
  words:"📓 單字收藏",day:"💪 單日衝刺",special:"🎯 特別成就"
};
// 產生一枚「累積型」徽章（自帶進度條 prog）
function B(cat,id,icon,name,desc,get,goal){
  return {cat,id,icon,name,desc,test:s=>get(s)>=goal,prog:s=>[Math.min(get(s),goal),goal]};
}
const BADGES=[
  // ⭐ 星星（主要貨幣，一路衝到 2000）
  B("star","first","⭐","第一顆星","拿到第一顆星星",BG.stars,1),
  B("star","star50","🌟","星星新星","累積 50 顆星",BG.stars,50),
  B("star","star150","💫","星星達人","累積 150 顆星",BG.stars,150),
  B("star","star300","✨","星星大師","累積 300 顆星",BG.stars,300),
  B("star","star600","🌠","星星傳說","累積 600 顆星",BG.stars,600),
  B("star","star1000","🏅","星星之王","累積 1000 顆星",BG.stars,1000),
  B("star","star2000","👑","星海霸主","累積 2000 顆星",BG.stars,2000),
  // 🔥 連續學習（整個暑假 60 天）
  B("streak","streak3","🔥","三天不斷電","連續學習 3 天",BG.streak,3),
  B("streak","streak7","🔥","一週全勤","連續學習 7 天",BG.streak,7),
  B("streak","streak14","⚡","兩週火力","連續學習 14 天",BG.streak,14),
  B("streak","streak30","🌈","一個月不斷電","連續學習 30 天",BG.streak,30),
  B("streak","streak60","🏆","暑假全勤王","連續學習 60 天",BG.streak,60),
  // 📅 總學習天數
  B("days","days7","📅","暑假暖身","累積學習 7 天",BG.days,7),
  B("days","days14","📅","漸入佳境","累積學習 14 天",BG.days,14),
  B("days","days30","📆","堅持一個月","累積學習 30 天",BG.days,30),
  B("days","days60","🗓️","暑假滿分","累積學習 60 天",BG.days,60),
  // 🧠 綜合答對（跨所有遊戲）
  B("brain","brain100","🧠","英文小腦袋","總共答對 100 題",BG.brain,100),
  B("brain","brain300","🧠","英文好腦袋","總共答對 300 題",BG.brain,300),
  B("brain","brain600","🧠","英文超級腦","總共答對 600 題",BG.brain,600),
  B("brain","brain1200","🧠","英文天才腦","總共答對 1200 題",BG.brain,1200),
  // 🃏 閃卡
  B("flip","flip50","🃏","翻卡新手","翻 50 張閃卡",BG.flip,50),
  B("flip","flip150","🎴","翻卡達人","翻 150 張閃卡",BG.flip,150),
  B("flip","flip400","🀄","翻卡狂人","翻 400 張閃卡",BG.flip,400),
  // 🔤 拼字
  B("spell","spell20","🔤","拼字新手","拼對 20 個字",BG.spell,20),
  B("spell","spell60","🔡","拼字高手","拼對 60 個字",BG.spell,60),
  B("spell","spell150","📝","拼字達人","拼對 150 個字",BG.spell,150),
  B("spell","spell300","✍️","拼字大師","拼對 300 個字",BG.spell,300),
  // 🎧 聽力
  B("quiz","quiz20","🎧","好耳朵","聽力答對 20 題",BG.quiz,20),
  B("quiz","quiz60","🎵","順風耳","聽力答對 60 題",BG.quiz,60),
  B("quiz","quiz150","🎼","聽力大師","聽力答對 150 題",BG.quiz,150),
  // 🧩 造句
  B("sent","sent10","🧩","造句新手","完成 10 句重組",BG.sent,10),
  B("sent","sent40","🧩","造句高手","完成 40 句重組",BG.sent,40),
  B("sent","sent100","🎪","造句大師","完成 100 句重組",BG.sent,100),
  // 📘 文法
  B("gram","gram10","📘","文法小老師","文法答對 10 題",BG.gram,10),
  B("gram","gram40","📗","文法高手","文法答對 40 題",BG.gram,40),
  B("gram","gram100","📙","文法大師","文法答對 100 題",BG.gram,100),
  // 📓 單字收藏
  B("words","words10","📓","單字收藏家","收藏 10 個單字",BG.words,10),
  B("words","words30","📔","單字倉庫","收藏 30 個單字",BG.words,30),
  B("words","words60","📚","單字圖書館","收藏 60 個單字",BG.words,60),
  B("words","words100","🎒","單字百寶袋","收藏 100 個單字",BG.words,100),
  // 💪 單日衝刺（一天內賺到的星星）
  B("day","day20","💪","今天很拼","單日賺到 20 顆星",BG.maxDay,20),
  B("day","day50","🚀","火力全開","單日賺到 50 顆星",BG.maxDay,50),
  B("day","day100","🌋","一日爆發","單日賺到 100 顆星",BG.maxDay,100),
  // 🎯 特別
  {cat:"special",id:"allgames",icon:"🎯",name:"全能玩家",desc:"五種遊戲都玩過",
    test:s=>BG.flip(s)>0&&BG.spell(s)>0&&BG.quiz(s)>0&&BG.sent(s)>0&&BG.gram(s)>0,
    prog:s=>[["flip","spell","quiz","sent","gram"].filter(k=>BG[k](s)>0).length,5]}
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
  const badgeCard=b=>{const on=save.badges[b.id];
    const [cur,goal]=b.prog?b.prog(save):[on?1:0,1];
    const pct=Math.min(100,Math.round(cur/goal*100));
    const foot=on
      ?`<div style="font-size:12px;color:var(--green);font-weight:bold">✅ 完成</div>`
      :`<div class="bprog"><div class="bprogfill" style="width:${pct}%"></div></div><div class="muted" style="font-size:11px">${cur} / ${goal}</div>`;
    return `<div class="badge ${on?'on':'off'}"><div style="font-size:30px">${on?b.icon:'🔒'}</div><div style="font-weight:bold;font-size:14px">${b.name}</div><div class="muted" style="font-size:12px">${b.desc}</div>${foot}</div>`;};
  // 依分類分組顯示，每組附上（已解鎖/總數）
  const badgesByCat=Object.keys(BADGE_CATS).map(cat=>{
    const list=BADGES.filter(b=>b.cat===cat);if(!list.length)return"";
    const gotc=list.filter(b=>save.badges[b.id]).length;
    return `<div class="badgecat">${BADGE_CATS[cat]}　<span class="muted" style="font-size:13px">${gotc}/${list.length}</span></div>
      <div class="badgegrid">${list.map(badgeCard).join("")}</div>`;
  }).join("");
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
      <p class="muted">灰色的還沒解鎖，下面的進度條會告訴你還差多少，快去把它們一個個點亮吧！✨</p>
      ${badgesByCat}
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
