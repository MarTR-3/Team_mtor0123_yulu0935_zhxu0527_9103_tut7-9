
var leahActive = false; 
var leahThemeIdx = 0; 
var leahThemes = [
  { h: [0, 255, 255],  l: [255, 0, 100], s: [255, 200, 0], b: [50, 50, 50] },     
  { h: [255, 100, 0],  l: [0, 255, 0],   s: [200, 0, 255], b: [255, 255, 255] },   
  { h: [255, 255, 0],  l: [255, 255, 255], s: [0, 0, 255],   b: [20, 20, 20] },   
  { h: [200, 200, 200], l: [150, 0, 0],   s: [100, 255, 100], b: [100, 100, 255] }  
];

const IMAGE_PATH = "assets/Marilyin Monroe Image.png";
const MOUTH_PATH = "assets/mouth.PNG";

let marilynImg;
let mouthImg;

let bgMask;
let waveLayer;

const EFFECT_RES = 700;

const MOUTH_CENTER = {
  x: 0.415,
  y: 0.775

};

const MOUTH_SIZE = {
  w: 0.180,
  h: 0.100
};

function preload() {
  marilynImg = loadImage(IMAGE_PATH);
  mouthImg = loadImage(MOUTH_PATH);
  preloadAudio();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Arial");

  setupAudio();

  bgMask = createBackgroundMask();

  waveLayer = createGraphics(EFFECT_RES, EFFECT_RES);
  waveLayer.pixelDensity(1);
}

function draw() {
  background(255);

  let audioData = updateAudioData();

  let maxImageW = width * 0.62;
  let maxImageH = height * 0.76;

  let imgScale = min(
    maxImageW / marilynImg.width,
    maxImageH / marilynImg.height
  );

  let displayW = marilynImg.width * imgScale;
  let displayH = marilynImg.height * imgScale;

  let cx = width / 2;
  let cy = height / 2 - 10;

  image(marilynImg, cx, cy, displayW, displayH);

  drawECGBackgroundWaves(cx, cy, displayW, displayH, audioData);

  drawAnimatedMouth(cx, cy, displayW, displayH, audioData);

  drawInterfaceText(audioData);

  
  if (leahActive && marilynImg) {
    loadPixels(); 
    
    var curT = leahThemes[leahThemeIdx];
    
    for (var i = 0; i < pixels.length; i += 4) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
      
      
      if (r > 130 && g < 60 && b < 60) {
        pixels[i]   = curT.l[0]; pixels[i+1] = curT.l[1]; pixels[i+2] = curT.l[2];
      }
      
      else if (r > 170 && g > 150 && b < 120) {
        pixels[i]   = curT.h[0]; pixels[i+1] = curT.h[1]; pixels[i+2] = curT.h[2];
      }
      
      else if (r < 150 && g > 160 && b > 160) {
        pixels[i]   = curT.b[0]; pixels[i+1] = curT.b[1]; pixels[i+2] = curT.b[2];
      }
      
      else if (r > 180 && g > 100 && b > 100 && r > g) {
        if (r > 40 && g > 40 && b > 40) {
          pixels[i]   = curT.s[0]; pixels[i+1] = curT.s[1]; pixels[i+2] = curT.s[2];
        }
      }
    }
    updatePixels(); 
  }
}

function createBackgroundMask() {
  let smallImg = marilynImg.get();
  smallImg.resize(EFFECT_RES, EFFECT_RES);
  smallImg.loadPixels();

  let maskImg = createImage(EFFECT_RES, EFFECT_RES);
  maskImg.loadPixels();

  for (let y = 0; y < EFFECT_RES; y++) {
    for (let x = 0; x < EFFECT_RES; x++) {
      let index = 4 * (y * EFFECT_RES + x);

      let r = smallImg.pixels[index];
      let g = smallImg.pixels[index + 1];
      let b = smallImg.pixels[index + 2];

      let nx = x / EFFECT_RES;
      let ny = y / EFFECT_RES;


      let isBlueGreenBackground =
        r > 70 &&
        r < 205 &&
        g > 120 &&
        b > 120 &&
        g > r * 0.9 &&
        b > r * 0.9 &&
        Math.abs(g - b) < 95;

      let protectLeftEyeAndBrow =
        nx > 0.20 &&
        nx < 0.48 &&
        ny > 0.34 &&
        ny < 0.53;

      let protectRightEyeAndBrow =
        nx > 0.47 &&
        nx < 0.78 &&
        ny > 0.34 &&
        ny < 0.53;

      let protectEyeArea = protectLeftEyeAndBrow || protectRightEyeAndBrow;

      let alpha = isBlueGreenBackground && !protectEyeArea ? 255 : 0;

      maskImg.pixels[index] = 255;
      maskImg.pixels[index + 1] = 255;
      maskImg.pixels[index + 2] = 255;
      maskImg.pixels[index + 3] = alpha;
    }
  }

  maskImg.updatePixels();
  return maskImg;
}

function drawECGBackgroundWaves(cx, cy, displayW, displayH, audioData) {
  waveLayer.clear();

  let spectrum = audioData.spectrum;
  let waveform = audioData.waveform;

  let time = millis() * 0.001;

  waveLayer.noStroke();
  waveLayer.fill(120, 230, 225, 28);
  waveLayer.rect(0, 0, EFFECT_RES, EFFECT_RES);

  let lineCount = 11;
  let spacing = EFFECT_RES / (lineCount + 1);

  for (let j = 0; j < lineCount; j++) {
    let baseY = spacing * (j + 1);

    let bass = audioData.bass;
    let mid = audioData.mid;
    let treble = audioData.treble;

    let mainAmp = map(mid + treble, 0, 510, 2, 36);
    let spikeAmp = map(bass, 0, 255, 10, 100);

    mainAmp *= 0.5 + audioData.volume;
    spikeAmp *= 0.5 + audioData.volume;

    let alpha = audioData.isPlaying ? 140 : 45;

    waveLayer.noFill();
    waveLayer.stroke(0, 45, 210, alpha);
    waveLayer.strokeWeight(audioData.isPlaying ? 1.8 : 1.1);

    waveLayer.beginShape();

    for (let x = 0; x <= EFFECT_RES; x += 7) {
      let waveIndex = floor(map(x, 0, EFFECT_RES, 0, waveform.length - 1));
      let spectrumIndex = floor(map(x, 0, EFFECT_RES, 0, spectrum.length - 1));

      let waveValue = waveform[waveIndex] || 0;
      let freqValue = spectrum[spectrumIndex] || 0;

      let smallMove = waveValue * mainAmp;
      let freqMove = map(freqValue, 0, 255, -4, 4);

      let beatX =
        ((time * 180 + j * 55) % (EFFECT_RES + 160)) - 80;

      let d = x - beatX;

      let ecgSpike = 0;

      ecgSpike += -0.18 * spikeAmp * Math.exp(-((d + 34) * (d + 34)) / 180);
      ecgSpike += 0.35 * spikeAmp * Math.exp(-((d + 8) * (d + 8)) / 45);
      ecgSpike += -1.15 * spikeAmp * Math.exp(-(d * d) / 18);
      ecgSpike += 0.55 * spikeAmp * Math.exp(-((d - 9) * (d - 9)) / 40);
      ecgSpike += -0.28 * spikeAmp * Math.exp(-((d - 35) * (d - 35)) / 260);

      let y = baseY + smallMove + freqMove + ecgSpike;

      waveLayer.vertex(x, y);
    }

    waveLayer.endShape();
  }

  let maskedWave = waveLayer.get();
  maskedWave.mask(bgMask);

  image(maskedWave, cx, cy, displayW, displayH);
}

function drawAnimatedMouth(cx, cy, displayW, displayH, audioData) {
  let imgLeft = cx - displayW / 2;
  let imgTop = cy - displayH / 2;

  let scaleX = displayW / marilynImg.width;
  let scaleY = displayH / marilynImg.height;

  let mouthX = imgLeft + MOUTH_CENTER.x * marilynImg.width * scaleX;
  let mouthY = imgTop + MOUTH_CENTER.y * marilynImg.height * scaleY;

  let mouthBaseW = MOUTH_SIZE.w * marilynImg.width * scaleX;
  let mouthBaseH = MOUTH_SIZE.h * marilynImg.height * scaleY;

  let mouthScale = getMouthScale(audioData);

  image(
    mouthImg,
    mouthX,
    mouthY,
    mouthBaseW * mouthScale,
    mouthBaseH * mouthScale
  );
}

function getMouthScale(audioData) {
  let volumeScale = map(audioData.volume, 0, 1, 0.85, 1.65);
  let levelPulse = map(audioData.level, 0, 0.25, 0, 0.25, true);
  let bassPulse = map(audioData.bass, 0, 255, 0, 0.14, true);

  return constrain(volumeScale + levelPulse + bassPulse, 0.8, 1.85);
}

function drawInterfaceText(audioData) {
  fill(30);
  noStroke();

  textSize(15);

  if (!audioData.isPlaying) {
    text("Click anywhere to play / resume the song", width / 2, height - 62);
  } else {
    text("Click again to pause     |     ↓ lower volume     ↑ higher volume", width / 2, height - 62);
  }

  let barW = 180;
  let barH = 6;
  let barX = width / 2 - barW / 2;
  let barY = height - 35;

  noStroke();
  fill(220);
  rect(barX, barY, barW, barH, 10);

  fill(0, 45, 210);
  rect(barX, barY, barW * audioData.volume, barH, 10);
}

function mousePressed() {
  toggleAudio();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    changeVolume(0.08);
    return false;
  }

  if (keyCode === DOWN_ARROW) {
    changeVolume(-0.08);
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}




window.addEventListener('keydown', function(event) {
  if (event.key === 'k' || event.key === 'K') { 
    leahActive = true;
    leahThemeIdx = (leahThemeIdx + 1) % leahThemes.length;
    console.log("🚀 Leah 的专属色彩主题已强行切换至: " + (leahThemeIdx + 1));
  }
});