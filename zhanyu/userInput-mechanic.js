let zhanyuPopArtActive = false; 
let colorThemeIndex = 0; 


let zhanyuMouthScale = 1.0; 

const POP_ART_THEMES = [
  { hair: [255, 0, 150], lip: [0, 255, 200], skin: [0, 150, 255], bg: [255, 255, 0] },
  { hair: [0, 200, 50],  lip: [150, 0, 200], skin: [255, 120, 0], bg: [255, 150, 200] },
  { hair: [255, 255, 255], lip: [20, 20, 20], skin: [180, 180, 180], bg: [50, 255, 100] },
  { hair: [0, 50, 200],  lip: [255, 230, 0], skin: [255, 50, 50],  bg: [150, 240, 240] }
];


function updateZhanyuMouseInput() {
  
  zhanyuMouthScale = map(mouseX, 0, width, 1.0, 30.0);
  
  
  zhanyuMouthScale = constrain(zhanyuMouthScale, 1.0, 30.0);
}

function checkZhanyuKeyInput() {
    if (keyCode === 75) { 
        zhanyuPopArtActive = true;
        colorThemeIndex = (colorThemeIndex + 1) % POP_ART_THEMES.length;
        console.log("Zhanyu System: Successfully switched to Pop Art theme " + (colorThemeIndex + 1));
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