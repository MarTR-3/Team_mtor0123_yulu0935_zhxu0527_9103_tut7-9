// Marilyn Perlin Draws.
// Draws the Perlin / ASCII Marilyn system.

function drawMarilynPerlin(audioData) {
  let palette = getCurrentPalette();

  background(palette.bg[0], palette.bg[1], palette.bg[2]);

  let maxImageW = width * 0.62;
  let maxImageH = height * 0.76;

  let imgScale = min(
    maxImageW / marilynImg.width,
    maxImageH / marilynImg.height
  );

  let displayW = marilynImg.width * imgScale;
  let displayH = marilynImg.height * imgScale;

  let cx = width / 2;
  let cy = height / 2 - 10;

  let cols = 70;
  let rows = 70;

  let tileW = displayW / cols;
  let tileH = displayH / rows;

  let x0 = cx - displayW / 2;
  let y0 = cy - displayH / 2;

  // Audio movement placeholders:
  // bass controls movement size.
  // mid controls Perlin detail.
  // treble controls small shake.
  let bass01 = map(audioData.bass, 0, 255, 0, 1, true);
  let mid01 = map(audioData.mid, 0, 255, 0, 1, true);
  let treble01 = map(audioData.treble, 0, 255, 0, 1, true);

  let time = frameCount * 0.012;
  let noiseScale = map(mid01, 0, 1, 0.04, 0.14);
  let moveAmount = minDimension * map(bass01, 0, 1, 0.01, 0.07);
  let trebleShake = map(treble01, 0, 1, 0, minDimension * 0.01);

  let p = getSmoothProgress();

  imageMode(CORNER);
  noStroke();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * tileW;
      let y = row * tileH;

      let n = noise(col * noiseScale, row * noiseScale, time);
      let angle = n * TWO_PI * 2;

      let offsetX = cos(angle) * moveAmount * n + random(-trebleShake, trebleShake);
      let offsetY = sin(angle) * moveAmount * n + random(-trebleShake, trebleShake);

      let drawX = x0 + x + offsetX;
      let drawY = y0 + y + offsetY;

      drawCurrentTile(
        transitionPhase,
        getNextPhase(),
        col,
        row,
        drawX,
        drawY,
        tileW,
        tileH,
        cols,
        rows,
        p
      );
    }
  }

  imageMode(CENTER);
}