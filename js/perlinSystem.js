function updatePerlin() {
  let imgSize = minDimension * 0.8;
  let x0 = width * 0.5 - imgSize * 0.5;
  let y0 = height * 0.5 - imgSize * 0.5;

  let cols = 90;
  let rows = 90;

  let tileW = imgSize / cols;
  let tileH = imgSize / rows;

  let time = frameCount * 0.005;
  let moveAmount = minDimension * 0.015;

  imageMode(CORNER);
  noStroke();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * tileW;
      let y = row * tileH;

      let n = noise(col * 0.08, row * 0.08, time);

      let angle = n * TWO_PI * 2;

      let offsetX = cos(angle) * moveAmount * n;
      let offsetY = sin(angle) * moveAmount * n;

      let sourceX = map(x, 0, imgSize, 0, marilynImg.width);
      let sourceY = map(y, 0, imgSize, 0, marilynImg.height);

      let sourceW = marilynImg.width / cols;
      let sourceH = marilynImg.height / rows;

      image(
        marilynImg,
        x0 + x + offsetX,
        y0 + y + offsetY,
        tileW + 1,
        tileH + 1,
        sourceX,
        sourceY,
        sourceW,
        sourceH
      );
    }
  }

  imageMode(CENTER);

  // CRT scanlines
  stroke(255, 30);

  for (let y = 0; y < height; y += 4) {
    line(0, y, width, y);
  }
}