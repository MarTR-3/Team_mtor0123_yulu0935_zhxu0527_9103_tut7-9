// Perlin mechanic.
// Contains color palettes and tile drawing functions.

// Uses Zhanyu's current pop-art theme.
// If Zhanyu's file is not active yet, use the first theme as fallback.
function getCurrentPalette() {
  if (typeof POP_ART_THEMES !== "undefined") {
    return POP_ART_THEMES[colorThemeIndex];
  }

  return {
    hair: [255, 0, 150],
    lip: [0, 255, 200],
    skin: [0, 150, 255],
    bg: [0, 0, 0]
  };
}

// Converts the original image color using Zhanyu's pop-art color mechanic.
function getWarholColor(originalColor) {
  let r = red(originalColor);
  let g = green(originalColor);
  let b = blue(originalColor);

  // If pop-art mode is OFF → return original pixel
  if (!zhanyuPopArtActive) {
    return color(r, g, b);
  }

  // Get Zhanyu's recolored pixel (flat theme color)
  let newColor = getZhanyuPixelColor(r, g, b);

  // Multiply blend — keeps shading & details
  let blendedR = (r / 255) * newColor[0];
  let blendedG = (g / 255) * newColor[1];
  let blendedB = (b / 255) * newColor[2];

  return color(blendedR, blendedG, blendedB);
}


function drawCurrentTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p) {
  if (!isTransitioning) {
    drawPhaseTile(currentPhase, col, row, x, y, tileW, tileH, cols, rows, 1);
  } else {
    drawTransitionTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p);
  }
}


function drawTransitionTile(currentPhase, nextPhase, col, row, x, y, tileW, tileH, cols, rows, p) {
  drawPhaseTile(currentPhase, col, row, x, y, tileW, tileH, cols, rows, 1 - p);
  drawPhaseTile(nextPhase, col, row, x, y, tileW, tileH, cols, rows, p);
}

function drawPhaseTile(phase, col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  if (phase === 0) {
    drawFullImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount);
  }

  if (phase === 1) {
    drawImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount);
  }

  if (phase === 2) {
    drawPointTile(col, row, x, y, tileW, tileH, cols, rows, 1, alphaAmount);
  }

  if (phase === 3) {
    drawAsciiTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount);
  }
}

function drawFullImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  let sx = map(col, 0, cols, 0, marilynImg.width);
  let sy = map(row, 0, rows, 0, marilynImg.height);
  let sw = marilynImg.width / cols;
  let sh = marilynImg.height / rows;
  

  // Sample center pixel
  let centerColor = marilynImg.get(sx + sw / 2, sy + sh / 2);

  // Apply Warhol tint (with shading preserved)
  let c = getWarholColor(centerColor);

  fill(red(c), green(c), blue(c), alphaAmount * 255);
  noStroke();
  rect(x, y, tileW + 1, tileH + 1);
}
function drawImageTile(col, row, x, y, tileW, tileH, cols, rows, alphaAmount) {
  let sx = map(col, 0, cols, 0, marilynImg.width);
  let sy = map(row, 0, rows, 0, marilynImg.height);
  let sw = marilynImg.width / cols;
  let sh = marilynImg.height / rows;

  let centerColor = marilynImg.get(sx + sw / 2, sy + sh / 2);
  let c = getWarholColor(centerColor);

  fill(red(c), green(c), blue(c), alphaAmount * 255);
  noStroke();
  rect(x, y, tileW + 1, tileH + 1);
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