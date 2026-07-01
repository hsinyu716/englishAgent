// 啟動：等 DOM 就緒後初始化各模組
/* ---------- 啟動 ---------- */
buildNav();renderScore();renderProgress();renderTasks();initFlashThemes();initSpellSource();initSentSource();renderPatterns();initGrammarSource();initQuizSource();renderWords();checkBadges();
if("speechSynthesis" in window){speechSynthesis.onvoiceschanged=()=>{};speechSynthesis.getVoices();}
