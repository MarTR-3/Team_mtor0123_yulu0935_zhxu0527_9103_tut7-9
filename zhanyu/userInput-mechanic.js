// ====== 你原本的变量 ======
let zhanyuPopArtActive = false; 
let colorThemeIndex = 0; 

// ====== 新增：控制嘴巴尺寸的变量 ======
let zhanyuMouthScale = 1.0; // 1.0 代表原始大小

const POP_ART_THEMES = [
  { hair: [255, 0, 150], lip: [0, 255, 200], skin: [0, 150, 255], bg: [255, 255, 0] },
  { hair: [0, 200, 50],  lip: [150, 0, 200], skin: [255, 120, 0], bg: [255, 150, 200] },
  { hair: [255, 255, 255], lip: [20, 20, 20], skin: [180, 180, 180], bg: [50, 255, 100] },
  { hair: [0, 50, 200],  lip: [255, 230, 0], skin: [255, 50, 50],  bg: [150, 240, 240] }
];

// ====== 新增功能函数：每帧由主 sketch 调用，用鼠标移动改变嘴巴大小 ======
function updateZhanyuMouseInput() {
  // map 函数：当鼠标移动到画布最右边(width)时，嘴巴放大倍数从 1.0 暴增到 30.0（大到撑满屏幕）
  // 你可以根据实际画面大小调节 30.0 这个极限值
  zhanyuMouthScale = map(mouseX, 0, width, 1.0, 30.0);
  
  // 约束范围，防止越界
  zhanyuMouthScale = constrain(zhanyuMouthScale, 1.0, 30.0);
}

function checkZhanyuKeyInput() {
    if (keyCode === 75) { // 'K' 键
        zhanyuPopArtActive = true;
        colorThemeIndex = (colorThemeIndex + 1) % POP_ART_THEMES.length;
        console.log("Zhanyu机制：已成功切换至波普艺术色彩主题 " + (colorThemeIndex + 1));
    }
}

function getZhanyuPixelColor(origR, origG, origB) {
    if (!zhanyuPopArtActive) {
        return [origR, origG, origB]; 
    }
    
    let currentTheme = POP_ART_THEMES[colorThemeIndex];
    
    if (origR > 140 && origG < 60 && origB < 60) {
        return currentTheme.lip; 
    }
    else if (origR > 180 && origG > 160 && origB < 120) {
        return currentTheme.hair; 
    }
    else if (origR < 150 && origG > 170 && origB > 170) {
        return currentTheme.bg; 
    }
    else {
        if (origR < 40 && origG < 40 && origB < 40) {
            return [origR, origG, origB]; 
        }
        return currentTheme.skin; 
    }
}