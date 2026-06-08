let minDimension;
let marilynImg;
let mouthImg;
let asciiLines;

let currentMode = 0;
// 0 = menu
// 1 = audio animation
// 2 = abstract Perlin animation

let audioButtonX;
let audioButtonY;
let abstractButtonX;
let abstractButtonY;
let menuColors;



function preload() {
  marilynImg = loadImage("assets/images/Marilyn Monroe Image.png");
  mouthImg = loadImage("assets/images/mouth.PNG");
  asciiLines = loadStrings("assets/ascii-art.txt");

  preloadAudio();
}

let buttonSize;  // at the top, just declare it

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("monospace");
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  minDimension = min(width, height);

  buttonSize = width * 0.12;   // scale with width
  buttonSize = constrain(buttonSize, 120, 260);  


  setupAudio();
  setupTimeSystem();
  setupMarilynSketchAudio();
  colorThemeIndex = floor(random(POP_ART_THEMES.length));
  menuColors = getRandomizedMenuColors();
  positionMenuButtons();  // so buttons use the right size/width
}


function positionMenuButtons() {
  let spacing = width * 0.18;
  spacing = constrain(spacing, 100, 250);


  audioButtonX = width / 2 - spacing;
  abstractButtonX = width / 2 + spacing;

  audioButtonY = height / 2 + height * 0.12;
  abstractButtonY = height / 2 + height * 0.12;
}


function getMenuColors() {
  let palette = POP_ART_THEMES[colorThemeIndex];

  return {
    bg: color(palette.bg[0], palette.bg[1], palette.bg[2]),
    audio: color(palette.hair[0], palette.hair[1], palette.hair[2]),
    abstract: color(palette.lip[0], palette.lip[1], palette.lip[2])
  };
}

function getRandomizedMenuColors() {
  let palette = POP_ART_THEMES[colorThemeIndex];

  // Convert palette object → array of colors
  let colors = [
    palette.bg,
    palette.hair,
    palette.lip,
    palette.skin
  ];

  // Shuffle colors
  colors = shuffle(colors);

  return {
    bg: color(colors[0][0], colors[0][1], colors[0][2]),
    audio: color(colors[1][0], colors[1][1], colors[1][2]),
    abstract: color(colors[2][0], colors[2][1], colors[2][2])
  };
}



function draw() {
  if (currentMode === 0) {
    drawMenuPage();
  }

  if (currentMode === 1) {
    drawAudioMode();
  }

  if (currentMode === 2) {
    drawAbstractMode();
  }
  
}

function drawShadowedText(str, x, y, w, h) {
  // shadow
  fill(50, 280);          // semi‑transparent black
  text(str, x + 1, y + 2, w, h);

  // main text
  fill(255);             // main white text
  text(str, x, y, w, h);
}


function drawMenuPage() {
  // use the global menuColors created in setup()
  background(menuColors.bg);
  noStroke();


  // Responsive text sizes for the title
  let titleSize = width * 0.05;
  let subtitleSize = width * 0.018;

  titleSize = constrain(titleSize, 28, 60);
  subtitleSize = constrain(subtitleSize, 14, 28);

  textSize(titleSize);
  drawShadowedText("Choose What You Like",
                  width / 2, height / 2 - titleSize * 2.5);

  textSize(subtitleSize);
  drawShadowedText("Press K inside either animation to change the pop-art color theme",
                  width / 2, height / 2 - titleSize * 1.5);


    // --- Draw Buttons ---
  noStroke();

  fill(menuColors.audio);
  circle(audioButtonX, audioButtonY, buttonSize);

  fill(menuColors.abstract);
  circle(abstractButtonX, abstractButtonY, buttonSize);


    // --- Responsive label text ---
  let labelSize = buttonSize * 0.20;
  labelSize = constrain(labelSize, 12, 28);
  textSize(labelSize);

  let labelYOffset = buttonSize * 0.02;
  let boxW = buttonSize * 0.65;
  let boxH = buttonSize * 0.65;

  // AUDIO BUTTON LABEL
  drawShadowedText(
    "Audio",
    audioButtonX - boxW / 2,
    audioButtonY - boxH / 2 - labelYOffset,
    boxW,
    boxH
  );

  // ABSTRACT BUTTON LABEL
  drawShadowedText(
    "Abstract\nMovement",
    abstractButtonX - boxW / 2,
    abstractButtonY - boxH / 2 - labelYOffset,
    boxW,
    boxH
  );
}


  

function drawAudioMode() {
  let audioData = updateAudioData();

  background(255);

  updateZhanyuMouseInput();

  drawMarilynSketchAudio(audioData);
}

function drawAbstractMode() {
  updateTimeSystem();

  let silentAudioData = {
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0,
    level: 0,
    spectrum: new Array(256).fill(0),
    waveform: new Array(256).fill(0),
    isPlaying: false
  };

  drawMarilynPerlin(silentAudioData);
}

function mousePressed() {
  if (currentMode === 0) {
    let audioDistance = dist(mouseX, mouseY, audioButtonX, audioButtonY);
    let abstractDistance = dist(mouseX, mouseY, abstractButtonX, abstractButtonY);

    if (audioDistance < buttonSize / 2) {
      currentMode = 1;
    }

    if (abstractDistance < buttonSize / 2) {
      currentMode = 2;
    }

    return;
  }

  if (currentMode === 1) {
    toggleAudio();
  }
}

function keyPressed() {
  if (key === "m" || key === "M") {
    currentMode = 0;
    return;
  }

  if (currentMode === 1) {
    if (keyCode === UP_ARROW) {
      changeVolume(0.08);
      return false;
    }

    if (keyCode === DOWN_ARROW) {
      changeVolume(-0.08);
      return false;
    }
  }

  handlePaletteKeys();
  if (currentMode === 0) {
  menuColors = getRandomizedMenuColors();
}

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);

  setupMarilynSketchAudio();
  positionMenuButtons();
  buttonSize = width * 0.12;   // scale with width
  buttonSize = constrain(buttonSize, 120, 260);  

}
