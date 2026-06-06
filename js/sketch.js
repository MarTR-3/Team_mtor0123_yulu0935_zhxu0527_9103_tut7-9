
var zhanyuActive = false; 
var zhanyuThemeIdx = 0; 
var zhanyuThemes = [
  { h: [255, 0, 150], l: [0, 255, 200], s: [0, 150, 255], b: [255, 255, 0] },     
  { h: [0, 200, 50],  l: [150, 0, 200], s: [255, 120, 0], b: [255, 150, 200] },   
  { h: [255, 255, 255], l: [20, 20, 20], s: [180, 180, 180], b: [50, 255, 100] }, 
  { h: [0, 50, 200],  l: [255, 230, 0], s: [255, 50, 50],  b: [150, 240, 240] }  
];

let minDimension;
let marilynImg;
let asciiLines;


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  minDimension = min(width, height);
  setupTimeSystem();
}

function draw() {
  background(0);

  updateTimeSystem();
  updatePerlin();
  
 
  if (zhanyuActive) {
    loadPixels(); 
    
    var curT = zhanyuThemes[zhanyuThemeIdx];
    
    
    for (var i = 0; i < pixels.length; i += 4) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
      
      
      if (r > 130 && g < 60 && b < 60) {
        pixels[i]   = curT.l[0];
        pixels[i+1] = curT.l[1];
        pixels[i+2] = curT.l[2];
      }
      
      else if (r > 170 && g > 150 && b < 120) {
        pixels[i]   = curT.h[0];
        pixels[i+1] = curT.h[1];
        pixels[i+2] = curT.h[2];
      }
      
      else if (r < 150 && g > 160 && b > 160) {
        pixels[i]   = curT.b[0];
        pixels[i+1] = curT.b[1];
        pixels[i+2] = curT.b[2];
      }
      
      else if (r > 180 && g > 100 && b > 100 && r > g) {
        if (r > 40 && g > 40 && b > 40) {
          pixels[i]   = curT.s[0];
          pixels[i+1] = curT.s[1];
          pixels[i+2] = curT.s[2];
        }
      }
    }
    
    updatePixels(); 
  }
}


    

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);
}


function preload() {
  marilynImg = loadImage("assets/images/Marilyn Monroe Image.png");
  asciiLines = loadStrings("assets/ascii-art.txt");
}


function keyPressed() {
  if (keyCode === 75) { 
    zhanyuPopArtActive = true;
    colorThemeIndex = (colorThemeIndex + 1) % POP_ART_THEMES.length;
    console.log("Zhanyu 全局换色主题已切换，当前主题: " + (colorThemeIndex + 1));
  }
}


//
function keyPressed() {
  if (keyCode === 75) { // K 键
    zhanyuActive = true;
    zhanyuThemeIdx = (zhanyuThemeIdx + 1) % zhanyuThemes.length;
    console.log("Zhanyu 色彩滤镜已切换至主题: " + (zhanyuThemeIdx + 1));
  }
}

// 
window.addEventListener('keydown', function(event) {
  if (event.key === 'k' || event.key === 'K') { 
    zhanyuActive = true;
    
  
    zhanyuThemeIdx = (zhanyuThemeIdx + 1) % zhanyuThemes.length;
    
    console.log("🚀 Zhanyu最高级原生钩子触发！色彩主题已强行切换至: " + (zhanyuThemeIdx + 1));
  }
});