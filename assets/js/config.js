// ⚙️ 全站設定（想調整就改這裡）
//
// 預設難度級別：改這一個值，閃卡／拼字／聽力／句子四個關卡的預設一起變。
// 可填：A1 / A2 / B1 / B2 / C1
const DEFAULT_LEVEL = "A1";

// 依 DEFAULT_LEVEL 幫下拉選單選好預設級別；若該級別不存在就退回第一個選項。
function pickDefaultLevel(sel){
  sel.value = "OX:" + DEFAULT_LEVEL;
  if(sel.selectedIndex < 0) sel.selectedIndex = 0;
}
