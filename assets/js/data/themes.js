// data 層：生活主題單字 + 等級標籤（共用資料）
/* ---------- 資料：主題單字（適合國小中年級） ---------- */
const THEMES = {
  "🐾 動物 Animals":[
    {en:"dog",zh:"狗",emoji:"🐶"},{en:"cat",zh:"貓",emoji:"🐱"},{en:"rabbit",zh:"兔子",emoji:"🐰"},
    {en:"lion",zh:"獅子",emoji:"🦁"},{en:"elephant",zh:"大象",emoji:"🐘"},{en:"monkey",zh:"猴子",emoji:"🐵"},
    {en:"bird",zh:"鳥",emoji:"🐦"},{en:"fish",zh:"魚",emoji:"🐟"},{en:"bear",zh:"熊",emoji:"🐻"}
  ],
  "🍎 食物 Food":[
    {en:"apple",zh:"蘋果",emoji:"🍎"},{en:"banana",zh:"香蕉",emoji:"🍌"},{en:"bread",zh:"麵包",emoji:"🍞"},
    {en:"milk",zh:"牛奶",emoji:"🥛"},{en:"egg",zh:"蛋",emoji:"🥚"},{en:"rice",zh:"米飯",emoji:"🍚"},
    {en:"water",zh:"水",emoji:"💧"},{en:"cake",zh:"蛋糕",emoji:"🍰"},{en:"grape",zh:"葡萄",emoji:"🍇"}
  ],
  "👨‍👩‍👧 家庭 Family":[
    {en:"mother",zh:"媽媽",emoji:"👩"},{en:"father",zh:"爸爸",emoji:"👨"},{en:"sister",zh:"姊妹",emoji:"👧"},
    {en:"brother",zh:"兄弟",emoji:"👦"},{en:"baby",zh:"寶寶",emoji:"👶"},{en:"family",zh:"家庭",emoji:"👪"},
    {en:"grandma",zh:"奶奶",emoji:"👵"},{en:"grandpa",zh:"爺爺",emoji:"👴"}
  ],
  "🏫 學校 School":[
    {en:"book",zh:"書",emoji:"📕"},{en:"pen",zh:"筆",emoji:"🖊️"},{en:"pencil",zh:"鉛筆",emoji:"✏️"},
    {en:"bag",zh:"書包",emoji:"🎒"},{en:"teacher",zh:"老師",emoji:"🧑‍🏫"},{en:"desk",zh:"書桌",emoji:"🪑"},
    {en:"ruler",zh:"尺",emoji:"📏"},{en:"clock",zh:"時鐘",emoji:"🕐"}
  ],
  "🌤️ 天氣 Weather":[
    {en:"sun",zh:"太陽",emoji:"☀️"},{en:"rain",zh:"雨",emoji:"🌧️"},{en:"cloud",zh:"雲",emoji:"☁️"},
    {en:"snow",zh:"雪",emoji:"❄️"},{en:"wind",zh:"風",emoji:"🌬️"},{en:"rainbow",zh:"彩虹",emoji:"🌈"},
    {en:"hot",zh:"熱",emoji:"🥵"},{en:"cold",zh:"冷",emoji:"🥶"}
  ],
  "🎨 顏色 Colors":[
    {en:"red",zh:"紅色",emoji:"🔴"},{en:"blue",zh:"藍色",emoji:"🔵"},{en:"green",zh:"綠色",emoji:"🟢"},
    {en:"yellow",zh:"黃色",emoji:"🟡"},{en:"purple",zh:"紫色",emoji:"🟣"},{en:"orange",zh:"橘色",emoji:"🟠"},
    {en:"black",zh:"黑色",emoji:"⚫"},{en:"white",zh:"白色",emoji:"⚪"}
  ]
};
const ALL = Object.values(THEMES).flat();
const LVL_LABEL={A1:"A1 入門",A2:"A2 初階 ⭐推薦",B1:"B1 中階 ⭐推薦",B2:"B2 中高階",C1:"C1 高階"};
