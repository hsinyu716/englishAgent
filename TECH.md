# 暑假英文闖關 — 技術與資源文件

一個給國小中年級（含可一起使用的高年級）小孩的**互動式英文學習網頁**。
單一前端網頁，無後端、無需帳號、無需 API 金鑰，用瀏覽器打開即可使用。

---

## 1. 架構總覽

| 項目 | 內容 |
|------|------|
| 型態 | 純前端靜態網頁，**分層多檔**，無 build 步驟 |
| 入口 | `index.html`（只有畫面標記 + `<link>`/`<script>` 載入） |
| 後端 | 無 |
| 相依安裝 | 無（不需 npm / 打包工具） |
| 執行方式 | 用 Chrome 直接開 `index.html`（整個 `assets/` 資料夾需一起保留） |
| 資料儲存 | 瀏覽器 `localStorage`（本機）；可**匯出/匯入**在裝置間搬移進度（見 5.1） |

### 分層檔案結構

```
index.html                 只有 HTML 標記 + 依序載入的 <script>
assets/
  css/styles.css           全部樣式
  js/
    data/                  ── 資料層（純資料，無邏輯）
      words-oxford.js        window.OXFORD（Oxford 分級字庫）
      themes.js              THEMES 生活主題字、ALL、LVL_LABEL
    config.js              ⚙️ 全站設定：DEFAULT_LEVEL（預設級別）+ pickDefaultLevel()
    core/                  ── 核心層（跨功能共用）
      storage.js             save 存檔、日期、連續天數（localStorage）
      backup.js              進度匯出/匯入（JSON 檔或代碼，跨裝置搬移）
      api.js                 Free Dictionary 查詢 + MyMemory 翻譯（含快取）
      audio.js               發音（真人 mp3 + 合成音 fallback）
      progress.js            等級(XP)、成就徽章、慶祝動畫、進度渲染
    ui/                    ── 介面層
      nav.js                 分頁導覽
      tasks.js               每日任務 + 活動計數(bump)
    features/              ── 功能層（一關卡一檔）
      flashcards.js  spelling.js  sentences.js
      grammar.js     quiz.js      reading.js
    app.js                 啟動：載入完成後初始化各模組
```

**載入順序即依賴順序**：`data → core → ui → features → app`。
用一般 `<script>`（非 ES module）載入，所有函式維持全域，因此：
- HTML 內的 `onclick="..."` 可直接呼叫，
- 且能以 `file://` **雙擊開啟**，無需本機伺服器。

> 為什麼不用 ES module `import/export`：以 `file://` 開啟時 Chrome 會用 CORS
> 擋掉 module 載入，必須跑 http 伺服器才能開。為了維持「雙擊即用」，改用
> 依序載入的傳統 `<script>`，字庫等資料掛在 `window` 上共用。

### 一次調整預設級別
`assets/js/config.js` 的 `DEFAULT_LEVEL`（A1/A2/B1/B2/C1）是**單一設定點**：
改一個字，閃卡／拼字／聽力／句子／文法五個關卡的預設級別一起變
（各關卡 init 都呼叫 `pickDefaultLevel(sel)`；某關卡沒有該級別內容時自動退回第一項，
例如文法目前只有 A1–B2，設成 C1 時文法會退回 A1）。

---

## 2. 瀏覽器內建技術（無需外部服務）

| 技術 | 用途 | 備註 |
|------|------|------|
| HTML / CSS / 原生 JS | 全部畫面與互動 | 無框架 |
| **Web Speech API**（`speechSynthesis`） | 單字/句子發音（合成語音） | 離線可用；作為真人發音的 fallback |
| **Web Speech API**（`SpeechRecognition`） | 🎤 說說看：偵測發音（語音轉文字） | 見 2.1；需連網 + Chrome + 麥克風 |
| **localStorage** | 星星進度、每日任務、翻譯快取、字典快取 | 見第 5 節 |
| `fetch` | 呼叫下列外部 API | 需連網 |
| `Audio` | 播放真人發音 mp3 | 來源見下 |

### 2.1 🎤 說說看 —— 發音偵測

拼字關卡的「🎤 說說看」讓小孩念單字、程式判斷念得對不對。用的是**瀏覽器內建的
Web Speech API 語音辨識**，無後端、無付費服務。

**核心：`SpeechRecognition`（語音轉文字）**
```js
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
spellRecog = new SR();
spellRecog.lang = "en-US";
spellRecog.maxAlternatives = 5;    // 一次要 5 個候選字，比對更寬容
spellRecog.interimResults = false; // 只要最終結果
```
在 Chrome 上，麥克風收到的聲音會送到 Google 的語音引擎，回傳「聽到的英文字」＋
最多 5 個候選。我們不自訓模型，瀏覽器直接給結果。

**比對邏輯（不是死板的字串相等）** — `check()` 分三級：
1. **完全正確**：5 個候選裡有人 `=== 正確答案`（或整句包含它）→ 🎉 `addStars(1)` + 播放正確發音。
2. **很接近**：用 **Levenshtein 編輯距離**算差幾個字母，`距離 ≤ 字長 × 34%`（例：apple 差 1 字母）→ 👍 鼓勵再念。
3. **錯誤**：差太多 → 顯示「我聽到 XXX」。

```js
levenshtein("aple", "apple") // → 1（動態規劃算最少編輯次數）
```

**相容性處理**：`spellSaySupported()` 做功能偵測，不支援的瀏覽器（Safari/Firefox
支援不完整）在 `initSpellSource()` 時**自動把按鈕隱藏**；沒授權麥克風 / 沒聲音會給對應提示。

- 程式進入點：`spellSay()`、`spellSaySupported()`、`levenshtein()`（皆在 `features/spelling.js`）
- **需求**：Chrome + 麥克風權限 + 連網（Chrome 的辨識是雲端的）。

> **技術定位（誠實說明）**：這是「speech-to-text 有沒有把你的聲音辨識成正確單字」，
> **不是**逐音素的專業發音評分。念得夠清楚就會過，但它不會像 Azure Pronunciation
> Assessment 那類服務去分析每個音素、重音、語調並給分。對「敢開口、念得像」這個
> 目的夠用；若要嚴格口說矯正，需另接雲端發音評測 API。

---

## 3. 外部公開 API（免費、免金鑰、支援 CORS 可直接從瀏覽器呼叫）

### 3.1 Free Dictionary API — 真人發音／音標／例句
- 端點：`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- 提供：KK/IPA 音標、**真人發音 mp3**（英/美）、英文定義、真實例句
- 金鑰：不需要
- 用途：閃卡即時「加值」；拼字/聽力預抓發音進快取
- 注意：社群維運，偶爾會慢或短暫掛掉 → 已做離線 fallback（改用合成語音）
- 程式進入點：`fetchDict()`、`playWord()`
- **音量一致性**：`playWord()` 會**先 `await fetchDict()` 再決定音源**，避免第一次播合成音（大聲）、
  之後播真人 mp3（小聲）的落差；有真人一律真人、抓不到一律合成音。

### 3.2 MyMemory Translation API — 英→繁中翻譯
- 端點：`https://api.mymemory.translated.net/get?q={word}&langpair=en|zh-TW&de={email}`
- 提供：機器翻譯（英文 → 繁體中文）
- 金鑰：不需要
- **`de={email}` 參數的原因（免費額度）**：
  | 用法 | 額度 |
  |------|------|
  | 匿名 | 5,000 字元/天（按 IP） |
  | 帶 `de=` 有效 email | **50,000 字元/天**（10 倍） |
  | CAT 白名單 | 150,000 字元/天（個人專案不符資格） |
  - email 僅用於用量異常時聯絡，**不需註冊、不驗證**。
  - 超額時回傳 `quotaFinished:true` 與 "YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY"。
  - 額度算**字元數**、按 **IP** 計。
- 用途：Oxford 字庫沒有中文 → 顯示時即時翻譯；新增單字時自動補中文
- 品質：機器翻譯，單字大多準確，偶爾需人工微調
- 程式進入點：`translateZh()`、`getZh()`（含快取）

### 3.3 Datamuse API —（已評估，未採用）
- 端點：`https://api.datamuse.com/words?...`
- 未採用原因：依主題抓字**未針對兒童年齡篩選**，實測「animal 相關字」會出現 `fauna / carnal / brute` 等太難或不適合的字。改用有分級的 Oxford 字表。

---

## 4. 資料來源與字庫

### 4.1 Oxford 3000/5000 CEFR 分級字庫（`words-oxford.js`）
- 來源 repo：`github.com/winterdl/oxford-5000-vocabulary-audio-definition`
- 內容：**5,309 個字**（去重後），CEFR 分級 A1–C1
  | 級別 | 字數 |
  |------|------|
  | A1 | 898 |
  | A2 | 867 |
  | B1 | 802 |
  | B2 | 1,428 |
  | C1 | 1,314 |
- 每筆欄位：`en`（單字）、`lvl`（CEFR）、`pos`（詞性）、`ph`（美式音標）、`ex`（例句）、`df`（英文定義）
- 掛載方式：`window.OXFORD`（陣列）
- **授權提醒**：Oxford 3000/5000 的「選字」屬牛津大學出版社，該 repo 未附 LICENSE。
  - ✅ 自家小孩學習使用沒問題
  - ⚠️ 若日後**公開發布或商用**，建議改用授權明確的 **NGSL（CC BY-SA）**

### 4.2 內建生活主題字（`index.html` 內 `THEMES`）
- 6 大主題：動物、食物、家庭、學校、天氣、顏色
- 每字自帶 emoji＋中文，供基礎複習與「聽音選圖」關卡使用

### 4.3 內建句型（`index.html` 內 `SENTENCES`、`GRAMMAR`）
- 10 組常用句型（句子重組關卡）
- 4 個文法主題：a/an、is/are、複數 +s、be 動詞

---

## 5. localStorage 儲存的鍵（keys）

| Key | 內容 | 產生位置 |
|-----|------|---------|
| `summerEnglishSave` | 星星(XP)、今日次數、每日任務、我的單字、連續天數、累積戰績、成就、每日星星紀錄 | `persist()` |
| `dictCache` | Free Dictionary 查詢結果（音標/例句/發音URL） | `saveDict()` |
| `zhCache` | 英→繁中翻譯結果（同字不重複翻） | `getZh()` |

`summerEnglishSave` 內的欄位：

| 欄位 | 意義 |
|------|------|
| `stars` | 累積星星＝經驗值(XP)，決定等級 |
| `count` | 今日賺到的星星數 |
| `tasks` | 每日任務完成狀態 |
| `words` | 我的單字（閱讀角新增） |
| `streak` / `bestStreak` / `days` | 目前連續天數 / 最佳紀錄 / 總學習天數 |
| `lastEarnDay` | 上次賺星的日期（算連續天數用） |
| `hist` | `{日期: 當天星星}`，畫最近 7 天長條圖用 |
| `lt` | lifetime 累積戰績 `{flip,spell,quiz,sent,gram}` |
| `badges` | 已解鎖成就 `{成就id: true}` |
| `spell` | 拼字**每個題庫**的記錄 `{題庫key: {seen:{字:1}, right, wrong}}`（含 `STAR` 收藏庫）|
| `quizRec` | 聽力每個題庫的記錄 `{題庫key: {seen, right, wrong}}` |
| `sentRec` | 句子每個題庫的記錄 `{題庫key: {seen, right, wrong}}` |

> `seen` 記「已出過的題目」→ 出過的不重覆；`right/wrong` 記對錯；題庫 key 為
> 下拉選單值（`THEME`、`OX:A1`…、拼字另有 `STAR` 收藏庫）。三個關卡各自分題庫累計，
> 全部出完顯示完成畫面可「清空記錄」重玩。

> 每天第一次開啟會重置「每日任務」與「今日次數」，星星(XP)、連續天數、成就皆累積保留。
> 舊存檔載入時會自動補齊新欄位（見 `storage.js` 的預設值）。

### 5.1 進度匯出 / 匯入（跨裝置，`backup.js`）

因為 `localStorage` 綁在單一裝置的瀏覽器，換手機/電腦進度不會跟著走。此功能讓使用者
**手動搬移整包進度**，不需要資料庫或帳號。位置在「🏆 我的進度」頁最下方。

- **匯出**：把整包 `save`（含上表所有欄位）包成有版本資訊的 JSON —— `{app,v,exportedAt,data:save}`。
  - `⬇️ 下載檔案`：存成 `english-progress-YYYYMMDD.json`（`Blob` + `<a download>`）。
  - `📋 複製代碼`：`navigator.clipboard` 複製整段 JSON（失敗時退回 `execCommand("copy")`）。
- **匯入**：從檔案（`FileReader`）或貼上的代碼 → `JSON.parse` → 驗證 → **覆蓋 `save`** → `persist()` → 重繪畫面。
  - 支援有無外層包裝（`obj.data` 或直接是 `save`）。
  - **驗證**：格式錯誤或非進度資料會拒絕且**不動到現有進度**。
  - **欄位補齊**：舊/缺欄位的備份也能匯入（補上 `spell/quizRec/sentRec/lt` 等預設）。
- **資料量**：即使把 Oxford A1–C1 全部 5,300 字在三個遊戲玩過一遍（約 11,000 筆 seen），
  匯出 JSON 也僅約 **173 KB**（gzip 後 ~57 KB）；實際使用多半 20–40 KB，遠低於 localStorage 上限。
- 程式進入點：`exportProgress()`、`copyProgress()`、`importFromFile()`、`importFromText()`、`applyImport()`。

> 實作重點：`storage.js` 的 `let save` 是所有 `<script>` 共用的**同一個全域繫結**，
> 匯入時 `applyImport()` 直接 `save = data` 重新指派，其他檔案讀到的即是新值。

---

## 6. 各關卡功能與資料來源

| 關卡 | 玩法 | 可選級別 | 資料來源 |
|------|------|---------|---------|
| 🃏 單字閃卡 | 翻卡看中文、聽發音、看音標/例句 | 生活主題 / Oxford A1–C1 | THEMES / OXFORD |
| 🔤 拼字遊戲 | 點字母拼出單字；🎤 說說看偵測發音、⭐ 收藏不熟的字 | 生活主題 / Oxford A1–C1（限 3–10 字母）/ ⭐ 收藏 | THEMES / OXFORD / save.words |
| 🧩 句子重組 | 看中文排出英文句子 | 生活句型 / Oxford A1–C1 | SENTENCES / OXFORD（真實例句）|
| 📘 文法小教室 | 看規則→聽例句→小測驗 | A1 / A2 / B1 / B2（人工編寫，共 38 單元） | GRAMMAR |
| 🎧 聽力測驗 | 主題字：聽音選圖；Oxford：聽音選中文＋英文 | 生活主題 / Oxford A1–C1 | THEMES / OXFORD |

> **拼字 / 聽力 / 句子三關的「進度 · 不重覆 · 分數」**：各自依題庫記錄（`save.spell/quizRec/sentRec`）：
> 出過的題目不再重覆（`seen`）、顯示「📖 N / 總數」進度與「✅ 對 / ❌ 錯」分數，全部出完顯示完成畫面。
> **拼字收藏**：`⭐ 收藏`把不熟的字存進 `save.words`（與閱讀角「我的單字」共用），可用「📓 我的收藏」
> 彈窗檢視/刪除，或選「⭐ 收藏的單字」題庫重新測試。
| 🏆 我的進度 | 等級/連續天數/戰績/7天圖/成就徽章 | — | summerEnglishSave |
| 📚 閱讀角 | 連到真實英文網站、記錄新單字 | — | 外部網站 |

> **句子重組的 Oxford 模式**：直接用字庫內建的**真實例句 `ex`**（牛津提供）來重組，
> 句子自然又多變（如 "What did she actually say?"），不是模板換字。
> 只挑乾淨完整句（`cleanSentence()`：大寫開頭、句尾標點、只含字母/縮寫'/空白、4–8 詞），
> 排除片語與含逗號/斜線/括號的例句。中文提示＝整句 MyMemory 翻譯（快取）。
> 每級約 200–325 句可玩。

---

## 6.5 遊戲化 / 成就系統（讓小孩覺得有在進步）

目標：用等級、連續天數、統計、徽章讓學習有「闖關、變強」的成就感。
全部資料存在 `summerEnglishSave`，離開再回來都保留。

### 等級系統（XP）
- 星星＝經驗值。累積星星越多，等級越高（`RANKS` 表，共 **16 級**，衝到 3600★，讓整個暑假都有下一級可追）。
- 標題列有即時 **XP 進度條**，顯示「再 N ⭐ 升到下一級」。
- 升級時跳**慶祝彈窗 + 彩帶**（`toast()` + `confetti()`）。

| Lv | 稱號 | 所需星星 | | Lv | 稱號 | 所需星星 |
|----|------|---------|---|----|------|---------|
| 1 | 🥚 英文小蛋 | 0 | | 9 | 🏆 傳說英雄 | 600 |
| 2 | 🐣 新手探險家 | 15 | | 10 | 🌟 閃耀之星 | 800 |
| 3 | 🏹 單字小獵人 | 40 | | 11 | 🚀 衝天火箭 | 1050 |
| 4 | 🦉 閱讀貓頭鷹 | 80 | | 12 | 🐉 金龍騎士 | 1350 |
| 5 | 🦅 句子飛鷹 | 140 | | 13 | 🧙 英文大法師 | 1700 |
| 6 | 🐲 文法小龍 | 220 | | 14 | 🦄 獨角獸傳說 | 2200 |
| 7 | ⚔️ 英文小勇者 | 320 | | 15 | 🌈 彩虹守護者 | 2800 |
| 8 | 👑 英文大王 | 450 | | 16 | 💎 鑽石英雄 | 3600 |

### 連續天數（streak）
- 每天賺到第一顆星時 `touchStreak()` 判斷：昨天也有 → 連續 +1；中斷 → 歸 1。
- 記錄 `目前連續 / 最佳紀錄 / 總學習天數`。

### 累積戰績 & 7 天長條圖
- 戰績：翻閃卡、拼對字、聽力答對、完成句子、文法答對、收藏單字（`save.lt`）。
- 圖表：`save.hist` 記每天賺的星星，畫最近 7 天長條圖。

### 成就徽章（`BADGES`，共 **44 個 / 12 大類**）
為了撐滿兩個月暑假，把徽章做成**階梯式**（每類多階、門檻遞增），永遠有下一個目標。
達成時自動解鎖並跳慶祝；**未解鎖顯示 🔒 並附進度條與「N / 目標」**，製造「就快到了」的黏著感。
進度頁依分類分組，每組標「已解鎖 / 總數」。

| 分類 | 階數 | 門檻範圍 |
|------|------|---------|
| ⭐ 星星大師 | 7 | 1 → 2000 顆星 |
| 🔥 連續學習 | 5 | 連續 3 → 60 天 |
| 📅 學習天數 | 4 | 累積 7 → 60 天 |
| 🧠 綜合實力 | 4 | 跨遊戲總答對 100 → 1200 題 |
| 🃏 閃卡 | 3 | 翻 50 → 400 張 |
| 🔤 拼字 | 4 | 拼對 20 → 300 字 |
| 🎧 聽力 | 3 | 答對 20 → 150 題 |
| 🧩 造句 | 3 | 完成 10 → 100 句 |
| 📘 文法 | 3 | 答對 10 → 100 題 |
| 📓 單字收藏 | 4 | 收藏 10 → 100 字 |
| 💪 單日衝刺 | 3 | 單日賺 20 / 50 / 100 星 |
| 🎯 特別成就 | 1 | 全能玩家：五種遊戲都玩過 |

> 取值器集中在 `BG`（`stars/streak/days/flip/…/brain（跨遊戲加總）/maxDay（單日最高星）`），
> 累積型徽章用 `B(cat,id,icon,name,desc,get,goal)` 產生，自帶 `test` 與 `prog`（進度條）。
> 相關函式：`addStars()`（記 XP/streak/歷史→檢查升級）、`checkBadges()`、
> `rankInfo()`、`renderScore()`（標題列）、`renderProgress()`（🏆 進度分頁，依 `BADGE_CATS` 分組）。

---

## 7. 外部學習資源（閱讀角連結）

| 資源 | 網址 | 說明 |
|------|------|------|
| Unite for Literacy | https://www.uniteforliteracy.com/ | 免費有聲英文繪本，每頁可點聽發音 |
| News in Levels（Level 1） | https://newsinlevels.com/level/level-1/ | 分級簡易英文新聞，有慢速朗讀 |

> 這兩個站以「開新分頁」連結，未用 iframe 內嵌
> （多數網站設定 `X-Frame-Options` 會擋內嵌，直接連結最穩定）。

---

## 8. 使用需知

- **需連網**才有：即時翻譯（MyMemory）、真人發音（Free Dictionary）。
- **離線時**：音標／例句（Oxford 內建）照常顯示；發音改用瀏覽器合成語音。
- 建議用 **Chrome**（語音合成、語音辨識與相容性最佳）。
- `index.html` 與 `assets/` 資料夾需**放在一起**（相對路徑載入）。
- **行動裝置**：`<meta name="viewport" ... user-scalable=no>` 搭配 CSS `touch-action:manipulation`
  禁止雙擊放大（iOS Safari 會忽略 `user-scalable=no`，靠 `touch-action` 才擋得掉），避免小孩點字母時誤觸縮放。

---

## 9. 若要重新產生 `words-oxford.js`

原始資料來自 winterdl repo 的 `data/oxford_5000.json`（物件格式，含 UK/US 音標、定義、例句、CEFR）。
轉檔流程：讀取原始 JSON → 過濾出有 word 與 cefr 的項目 → 去重 → 取用欄位
（`en/lvl/pos/ph/ex/df`）→ 依 CEFR 與字母排序 → 輸出為 `window.OXFORD=[...]`
（放在 `assets/js/data/words-oxford.js`）。
