let transitionPhase = 0;
let transitionProgress = 0;

let phaseDurations = [5000, 3000, 9000];
// rectangles, points, ASCII

let lastPhaseChange = 0;

function setupTimeSystem() {
  lastPhaseChange = millis();
}

function updateTimeSystem() {
  let currentDuration = phaseDurations[transitionPhase];
  let elapsed = millis() - lastPhaseChange;

  transitionProgress = constrain(elapsed / currentDuration, 0, 1);

  if (elapsed >= currentDuration) {
    transitionPhase = (transitionPhase + 1) % 3;
    lastPhaseChange = millis();
    transitionProgress = 0;
  }
}

function getSmoothProgress() {
  return transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
}