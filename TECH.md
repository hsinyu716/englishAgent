# 暑假英文闖關 — 技術與資源文件

一個給國小中年級（含可一起使用的高年級）小孩的**互動式英文學習網頁**。
單一前端網頁，無後端、無需帳號、無需 API 金鑰，用瀏覽器打開即可使用。

---

## 1. 架構總覽

| 項目 | 內容 |
|------|------|
| 型態 | 純前端靜態網頁（single-page，無 build 步驟） |
| 主要檔案 | `index.html`（畫面＋全部邏輯）、`words-oxford.js`（分級字庫資料） |
| 後端 | 無 |
| 相依安裝 | 無（不需 npm / 打包工具） |
| 執行方式 | 用 Chrome 直接開 `index.html`（兩個檔案需放同一資料夾） |
| 資料儲存 | 瀏覽器 `localStorage`（本機、單一裝置） |

> 為什麼用 `<script src="words-oxford.js">` 而不是 `fetch('words.json')`：
> 以 `file://` 開啟網頁時，Chrome 會擋掉對本機檔案的 `fetch`（CORS），
> 但 `<script>` 標籤載入不受此限，所以字庫掛在 `window.OXFORD` 上。

---

## 2. 瀏覽器內建技術（無需外部服務）

| 技術 | 用途 | 備註 |
|------|------|------|
| HTML / CSS / 原生 JS | 全部畫面與互動 | 無框架 |
| **Web Speech API**（`speechSynthesis`） | 單字/句子發音（合成語音） | 離線可用；作為真人發音的 fallback |
| **localStorage** | 星星進度、每日任務、翻譯快取、字典快取 | 見第 5 節 |
| `fetch` | 呼叫下列外部 API | 需連網 |
| `Audio` | 播放真人發音 mp3 | 來源見下 |

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

> 每天第一次開啟會重置「每日任務」與「今日次數」，星星(XP)、連續天數、成就皆累積保留。
> 舊存檔載入時會自動補齊新欄位（見 `index.html` 存檔區的預設值）。

---

## 6. 各關卡功能與資料來源

| 關卡 | 玩法 | 可選級別 | 資料來源 |
|------|------|---------|---------|
| 🃏 單字閃卡 | 翻卡看中文、聽發音、看音標/例句 | 生活主題 / Oxford A1–C1 | THEMES / OXFORD |
| 🔤 拼字遊戲 | 點字母拼出單字 | 生活主題 / Oxford A1–C1（限 3–10 字母） | THEMES / OXFORD |
| 🧩 句子重組 | 看中文排出英文句子 | 生活句型 / Oxford A1–C1 | SENTENCES / OXFORD（套模板）|
| 📘 文法小教室 | 看規則→聽例句→小測驗 | — | GRAMMAR |
| 🎧 聽力測驗 | 主題字：聽音選圖；Oxford：聽音選中文＋英文 | 生活主題 / Oxford A1–C1 | THEMES / OXFORD |
| 🏆 我的進度 | 等級/連續天數/戰績/7天圖/成就徽章 | — | summerEnglishSave |
| 📚 閱讀角 | 連到真實英文網站、記錄新單字 | — | 外部網站 |

> **句子重組的 Oxford 模式**：只取**名詞、形容詞**（`posKey()` 過濾，排除 pronoun），
> 套進固定句型模板（名詞 `I have a %.`、形容詞 `It is very %.`），並自動處理 a/an。
> 不用動詞是因為無法判斷及物/不及物（如 *contain* 會產生 "We contain together." 錯句）。
> 中文提示＝模板中文 + 該字的 MyMemory 翻譯（快取）。

---

## 6.5 遊戲化 / 成就系統（讓小孩覺得有在進步）

目標：用等級、連續天數、統計、徽章讓學習有「闖關、變強」的成就感。
全部資料存在 `summerEnglishSave`，離開再回來都保留。

### 等級系統（XP）
- 星星＝經驗值。累積星星越多，等級越高（`RANKS` 表，共 9 級）。
- 標題列有即時 **XP 進度條**，顯示「再 N ⭐ 升到下一級」。
- 升級時跳**慶祝彈窗 + 彩帶**（`toast()` + `confetti()`）。

| Lv | 稱號 | 所需星星 |
|----|------|---------|
| 1 | 🥚 英文小蛋 | 0 |
| 2 | 🐣 新手探險家 | 15 |
| 3 | 🏹 單字小獵人 | 40 |
| 4 | 🦉 閱讀貓頭鷹 | 80 |
| 5 | 🦅 句子飛鷹 | 140 |
| 6 | 🐲 文法小龍 | 220 |
| 7 | ⚔️ 英文小勇者 | 320 |
| 8 | 👑 英文大王 | 450 |
| 9 | 🏆 傳說英雄 | 600 |

### 連續天數（streak）
- 每天賺到第一顆星時 `touchStreak()` 判斷：昨天也有 → 連續 +1；中斷 → 歸 1。
- 記錄 `目前連續 / 最佳紀錄 / 總學習天數`。

### 累積戰績 & 7 天長條圖
- 戰績：翻閃卡、拼對字、聽力答對、完成句子、文法答對、收藏單字（`save.lt`）。
- 圖表：`save.hist` 記每天賺的星星，畫最近 7 天長條圖。

### 成就徽章（`BADGES`，共 12 個）
達成條件時自動解鎖並跳慶祝；未解鎖顯示 🔒。

| 徽章 | 條件 |
|------|------|
| ⭐ 第一顆星 | 拿到第一顆星 |
| 🌟 星星新星 / 💫 星星大師 | 累積 50 / 150 顆星 |
| 🔥 三天不斷電 / 一週全勤 | 連續 3 / 7 天 |
| 🃏 翻卡狂人 | 翻 50 張閃卡 |
| 🔤 拼字高手 | 拼對 20 個字 |
| 🎧 好耳朵 | 聽力答對 20 題 |
| 🧩 造句高手 | 完成 10 句重組 |
| 📘 文法小老師 | 文法答對 10 題 |
| 📓 單字收藏家 | 記下 10 個新單字 |
| 📅 暑假達人 | 累積學習 7 天 |

> 相關函式：`addStars()`（記 XP/streak/歷史→檢查升級）、`checkBadges()`、
> `rankInfo()`、`renderScore()`（標題列）、`renderProgress()`（🏆 進度分頁）。

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
- 建議用 **Chrome**（語音合成與相容性最佳）。
- 兩個檔案（`index.html`、`words-oxford.js`）需放**同一資料夾**。

---

## 9. 若要重新產生 `words-oxford.js`

原始資料來自 winterdl repo 的 `data/oxford_5000.json`（物件格式，含 UK/US 音標、定義、例句、CEFR）。
轉檔流程：讀取原始 JSON → 過濾出有 word 與 cefr 的項目 → 去重 → 取用欄位
（`en/lvl/pos/ph/ex/df`）→ 依 CEFR 與字母排序 → 輸出為 `window.OXFORD=[...]`。
