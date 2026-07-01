// core 層：發音（真人 mp3 + 瀏覽器合成音 fallback）
/* ---------- 語音發音 ---------- */
// 先確保字典抓完，再決定音源 → 第一次和之後都用同一個引擎，音量才一致
// （有真人 mp3 就一律播真人，抓不到就一律用瀏覽器合成音）
async function playWord(word){
  const rec=await fetchDict(word);
  if(rec&&rec.audio){
    const a=new Audio(rec.audio);a.volume=1;
    a.play().catch(()=>speak(word)); // 播放失敗（如自動播放被擋）退回合成音
  }else speak(word);
}
function speak(text){
  if(!("speechSynthesis" in window)){alert("這個瀏覽器不支援發音，換 Chrome 試試！");return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";u.rate=.85;u.pitch=1.1;
  const v=speechSynthesis.getVoices().find(v=>/en-US|English/i.test(v.lang+v.name));
  if(v)u.voice=v;speechSynthesis.speak(u);
}
