// Perlin mechanic.
// Contains color palettes and tile drawing functions.

let warholPalettes = [
  { bg: [93, 201, 205], skin: [247, 132, 156], hair: [245, 207, 55], lips: [210, 39, 32], eyes: [141, 206, 226], shadow: [25, 25, 25] },
  { bg: [245, 204, 61], skin: [235, 105, 163], hair: [37, 190, 201], lips: [196, 31, 48], eyes: [75, 198, 232], shadow: [30, 30, 30] },
  { bg: [236, 73, 58], skin: [255, 191, 205], hair: [250, 225, 74], lips: [155, 24, 50], eyes: [58, 180, 215], shadow: [20, 20, 20] },
  { bg: [92, 197, 125], skin: [249, 148, 96], hair: [252, 220, 52], lips: [220, 45, 42], eyes: [91, 196, 232], shadow: [24, 24, 24] },
  { bg: [50, 115, 198], skin: [244, 155, 180], hair: [241, 207, 49], lips: [226, 44, 36], eyes: [109, 207, 232], shadow: [18, 18, 18] },
  { bg: [245, 124, 44], skin: [248, 180, 198], hair: [254, 223, 63], lips: [195, 27, 42], eyes: [95, 196, 218], shadow: [26, 26, 26] },
  { bg: [180, 82, 173], skin: [250, 151, 111], hair: [250, 219, 62], lips: [220, 47, 43], eyes: [84, 204, 226], shadow: [22, 22, 22] },
  { bg: [239, 92, 135], skin: [246, 170, 102], hair: [245, 222, 53], lips: [170, 31, 57], eyes: [69, 185, 218], shadow: [28, 28, 28] },
  { bg: [89, 202, 174], skin: [246, 116, 147], hair: [247, 197, 48], lips: [212, 40, 40], eyes: [130, 210, 230], shadow: [21, 21, 21] },
  { bg: [245, 229, 84], skin: [236, 98, 151], hair: [47, 185, 205], lips: [190, 30, 47], eyes: [110, 204, 225], shadow: [24, 24, 24] }
];

function getCurrentPalette() {
  return warholPalettes[userControls.paletteIndex];
}

function getWarholColor(originalColor) {
  let palette = getCurrentPalette();
  let b = brightness(originalColor);

  let chosen;

  if (b < 35) {
    chosen = palette.shadow;
  } else if (b < 90) {
    chosen = palette.skin;
  } else if (b < 160) {
    chosen = palette.lips;
  } else if (b < 220) {
    chosen = palette.eyes;
  } else {
    chosen = palette.hair;
  }

  return color(chosen[0], chosen[1], chosen[2]);
}

function drawCurrentTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p) {
  if (!isTransitioning) {
    drawPhaseTile(currentPhase, col, row, x, y, tileW, tileH, cols, rows, 1);
  } else {
    drawTransitionTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p);
  }
}

function drawPhaseTile(phase, col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  if (phase === 0) {
    drawImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount);
  }

  if (phase === 1) {
    drawPointTile(col, row, x, y, tileW, tileH, cols, rows, 1, alphaAmount);
  }

  if (phase === 2) {
    drawAsciiTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount);
  }
}

function drawTransitionTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p) {
  drawPhaseTile(currentPhase, col, row, x, y, tileW, tileH, cols, rows, 1 - p);
  drawPhaseTile(nextPhase, col, row, x, y, tileW, tileH, cols, rows, p);
}

function drawImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  tint(255, alphaAmount * 255);

  let sx = map(col, 0, cols, 0, marilynImg.width);
  let sy = map(row, 0, rows, 0, marilynImg.height);
  let sw = marilynImg.width / cols;
  let sh = marilynImg.height / rows;

  image(marilynImg, x, y, tileW + 1, tileH + 1, sx, sy, sw, sh);

  noTint();
}

function drawPointTile(col, row, x, y, tileW, tileH, cols, rows, roundAmount, alphaAmount) {
  let sx = map(col, 0, cols, 0, marilynImg.width);
  let sy = map(row, 0, rows, 0, marilynImg.height);

  let c = getWarholColor(marilynImg.get(sx, sy));
  let size = lerp(tileW, tileW * 0.45, roundAmount);
  let radius = lerp(0, tileW, roundAmount);

  fill(red(c), green(c), blue(c), alphaAmount * 255);
  rectMode(CENTER);

  rect(x + tileW / 2, y + tileH / 2, size, size, radius);

  rectMode(CORNER);
}

function drawAsciiTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  let asciiRow = floor(map(row, 0, rows, 0, asciiLines.length));
  let asciiCol = floor(map(col, 0, cols, 0, asciiLines[asciiRow].length));
  let character = asciiLines[asciiRow].charAt(asciiCol);

  let sx = map(col, 0, cols, 0, marilynImg.width);
  let sy = map(row, 0, rows, 0, marilynImg.height);

  let c = getWarholColor(marilynImg.get(sx, sy));

  fill(red(c), green(c), blue(c), alphaAmount * 255);
  textSize(tileW * 1.15);
  text(character, x + tileW / 2, y + tileH / 2);
}