function updatePerlin() {
  let imgSize = minDimension * 0.8;
  let x0 = width * 0.5 - imgSize * 0.5;
  let y0 = height * 0.5 - imgSize * 0.5;

  let cols = 80;
  let rows = 80;

  let tileW = imgSize / cols;
  let tileH = imgSize / rows;

  let time = frameCount * 0.012;
  let moveAmount = minDimension * 0.025;

  let p = getSmoothProgress();

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

      let drawX = x0 + x + offsetX;
      let drawY = y0 + y + offsetY;

      if (transitionPhase === 0) {
        drawImageTile(col, row, drawX, drawY, tileW, tileH, cols, rows);
      }

      if (transitionPhase === 1) {
        drawImageToPointTile(col, row, drawX, drawY, tileW, tileH, cols, rows, p);
      }

      if (transitionPhase === 2) {
        drawAsciiTile(col, row, drawX, drawY, tileW, tileH, cols, rows, p);
      }
    }
  }

  imageMode(CENTER);
  drawScanlines();
}
function drawImageTile(col, row, x, y, tileW, tileH, cols, rows) {
  let sourceX = map(col, 0, cols, 0, marilynImg.width);
  let sourceY = map(row, 0, rows, 0, marilynImg.height);

  let sourceW = marilynImg.width / cols;
  let sourceH = marilynImg.height / rows;

  image(
    marilynImg,
    x,
    y,
    tileW + 1,
    tileH + 1,
    sourceX,
    sourceY,
    sourceW,
    sourceH
  );
}

function drawImageToPointTile(col, row, x, y, tileW, tileH, cols, rows, p) {
  let sourceX = map(col, 0, cols, 0, marilynImg.width);
  let sourceY = map(row, 0, rows, 0, marilynImg.height);

  let c = marilynImg.get(sourceX, sourceY);

  let size = lerp(tileW, tileW * 0.45, p);
  let radius = lerp(0, tileW, p);

  fill(c);
  rectMode(CENTER);

  rect(
    x + tileW * 0.5,
    y + tileH * 0.5,
    size,
    size,
    radius
  );

  rectMode(CORNER);
}

function drawAsciiTile(col, row, x, y, tileW, tileH, cols, rows, p) {
  let asciiRow = floor(map(row, 0, rows, 0, asciiLines.length));
  let asciiCol = floor(map(col, 0, cols, 0, asciiLines[asciiRow].length));

  let character = asciiLines[asciiRow].charAt(asciiCol);

  let sourceX = map(col, 0, cols, 0, marilynImg.width);
  let sourceY = map(row, 0, rows, 0, marilynImg.height);
  let c = marilynImg.get(sourceX, sourceY);

  let pointAlpha = map(p, 0, 1, 255, 0);
  let textAlpha = map(p, 0, 1, 0, 255);

  fill(red(c), green(c), blue(c), pointAlpha);
  circle(x + tileW * 0.5, y + tileH * 0.5, tileW * 0.45);

  fill(255, textAlpha);
  textSize(tileW * 1.2);
  text(character, x + tileW * 0.5, y + tileH * 0.5);
}

function drawScanlines() {
  stroke(255, 30);

  for (let y = 0; y < height; y += 4) {
    line(0, y, width, y);
  }
}