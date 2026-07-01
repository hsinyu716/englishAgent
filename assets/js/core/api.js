// core 層：外部 API（Free Dictionary 查詢 + MyMemory 翻譯，含快取）
/* ---------- 線上字典 API（Free Dictionary） ---------- */
// 快取到 localStorage，抓過的字不再重複請求
const DKEY="dictCache";
let dictCache=JSON.parse(localStorage.getItem(DKEY)||"{}");
function saveDict(){try{localStorage.setItem(DKEY,JSON.stringify(dictCache));}catch(e){}}
async function fetchDict(word){
  const w=word.toLowerCase();
  if(dictCache[w])return dictCache[w];
  try{
    const r=await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+encodeURIComponent(w));
    if(!r.ok)throw 0;
    const data=await r.json();
    const entry=data[0]||{};
    let audio="",phonetic=entry.phonetic||"";
    (entry.phonetics||[]).forEach(p=>{
      if(p.text&&!phonetic)phonetic=p.text;
      if(p.audio&&(!audio||/-us/.test(p.audio)))audio=p.audio; // 優先美式發音
    });
    let example="";
    (entry.meanings||[]).some(m=>(m.definitions||[]).some(d=>{if(d.example){example=d.example;return true;}}));
    const rec={phonetic,audio,example,ok:true};
    dictCache[w]=rec;saveDict();return rec;
  }catch(e){
    const rec={phonetic:"",audio:"",example:"",ok:false};
    dictCache[w]=rec;return rec; // 失敗也記錄，避免一直重打；但不落地永久
  }
}


/* ---------- 翻譯 API（MyMemory） ---------- */
async function translateZh(en){
  try{
    const email=encodeURIComponent("z2493225@gmail.com"); // 附上 email 提高免費額度
    const r=await fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(en)+"&langpair=en|zh-TW&de="+email);
    const d=await r.json();
    return (d.responseData&&d.responseData.translatedText)||"";
  }catch(e){return "";}
}
// 翻譯快取：同一個字只翻一次，存 localStorage
const ZKEY="zhCache";
let zhCache=JSON.parse(localStorage.getItem(ZKEY)||"{}");
async function getZh(en){
  const k=en.toLowerCase();
  if(zhCache[k])return zhCache[k];
  const t=await translateZh(en);
  if(t){zhCache[k]=t;try{localStorage.setItem(ZKEY,JSON.stringify(zhCache));}catch(e){}}
  return t;
}
