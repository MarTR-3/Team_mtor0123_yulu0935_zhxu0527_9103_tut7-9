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
let buttonSize = 220;

function preload() {
  marilynImg = loadImage("assets/images/Marilyn Monroe Image.png");
  mouthImg = loadImage("assets/images/mouth.PNG");
  asciiLines = loadStrings("assets/ascii-art.txt");

  preloadAudio();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont("monospace");
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  minDimension = min(width, height);

  setupAudio();
  setupTimeSystem();
  setupMarilynSketchAudio();

  positionMenuButtons();
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

function drawMenuPage() {
  background(135, 206, 235);

  fill(40, 60, 90);
  noStroke();

  textSize(40);
  text("Choose What You Like", width / 2, height / 2 - 160);

  textSize(18);
  text("Press K inside either animation to change the pop-art color theme", width / 2, height / 2 - 105);

  fill(235, 60, 60);
  circle(audioButtonX, audioButtonY, buttonSize);

  fill(255);
  textSize(24);
  text("Audio", audioButtonX, audioButtonY);

  fill(255, 140, 0);
  circle(abstractButtonX, abstractButtonY, buttonSize);

  fill(255);
  textSize(17);
  text("Perlin noise\nand randomness", abstractButtonX, abstractButtonY);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);

  setupMarilynSketchAudio();
  positionMenuButtons();
}

function positionMenuButtons() {
  audioButtonX = width / 2 - 180;
  audioButtonY = height / 2 + 80;

  abstractButtonX = width / 2 + 180;
  abstractButtonY = height / 2 + 80;
}