// Main sketch file
// This file only displays the main image.
// Clicking the image will play or pause Leah's audio.

let mainImage;

let imageX;
let imageY;
let imageW;
let imageH;

function preload() {
  mainImage = loadImage("assets/Marilyn Monroe Image.png");

  preloadAudioMechanic();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  setupMainImage();
  setupAudioMechanic();
}

function draw() {
  background(15);

  // Draw the main image only
  image(mainImage, imageX, imageY, imageW, imageH);

  // Draw instruction text
  drawAudioInstruction();
}

function setupMainImage() {
  imageX = width / 2;
  imageY = height / 2;

  // Image size
  imageW = min(width * 0.55, 650);
  imageH = imageW * 0.75;
}

function mousePressed() {
  if (isMouseOnMainImage()) {
    toggleAudio();
  }
}

function isMouseOnMainImage() {
  return (
    mouseX > imageX - imageW / 2 &&
    mouseX < imageX + imageW / 2 &&
    mouseY > imageY - imageH / 2 &&
    mouseY < imageY + imageH / 2
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupMainImage();
}