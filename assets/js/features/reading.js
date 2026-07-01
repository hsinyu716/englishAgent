// feature：閱讀角 / 我的單字
/* ---------- 我的單字 ---------- */
async function addWord(){
  const enEl=document.getElementById("newWordEn"),zhEl=document.getElementById("newWordZh");
  const en=enEl.value.trim();let zh=zhEl.value.trim();
  if(!en)return;
  if(!zh){zh=await translateZh(en)||"(請自行填中文)";} // 沒填中文就自動翻譯
  save.words.push({en,zh});persist();
  enEl.value="";zhEl.value="";
  if(!save.tasks.read1)toggleTask("read1",true);
  renderWords();checkBadges();
}
function renderWords(){
  const ul=document.getElementById("myWords");ul.innerHTML="";
  save.words.forEach((w,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<b>${w.en}</b> — ${w.zh} <button class="btn green" style="padding:4px 10px;font-size:14px" onclick="playWord('${w.en.replace(/'/g,"")}')">🔊</button> <button class="btn gray" style="padding:4px 10px;font-size:14px" onclick="delWord(${i})">🗑️</button>`;
    ul.appendChild(li);
  });
}
function delWord(i){save.words.splice(i,1);persist();renderWords();}
