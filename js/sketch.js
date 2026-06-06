let minDimension;
let marilynImg;
let mouthImg;
let asciiLines;

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
}

function draw() {
  let audioData = updateAudioData();

  updateTimeSystem();

  drawMarilynPerlin(audioData);
  drawMarilynSketchAudio(audioData);
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

  handlePaletteKeys();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);

  setupMarilynSketchAudio();
}