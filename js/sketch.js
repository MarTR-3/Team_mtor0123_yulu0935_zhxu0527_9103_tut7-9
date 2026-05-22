let minDimension;
let marilynImg;

function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);

  minDimension = min(width, height);
}

function draw() {
  background(0);

  updatePerlin();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  minDimension = min(width, height);
}


function preload() {
  marilynImg = loadImage("assets/images/Marilyn Monroe Image.png");
}
