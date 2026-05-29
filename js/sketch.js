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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);
}


function preload() {
  marilynImg = loadImage("assets/images/Marilyn Monroe Image.png");
  asciiLines = loadStrings("assets/ascii-art.txt");
}
