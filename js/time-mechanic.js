// Time mechanic.
// Controls the visual phases and transition speed.
//
// phase 0 = mini rectangles
// phase 1 = rounded points
// phase 2 = ASCII art

let transitionPhase = 0;
let transitionProgress = 0;
let isTransitioning = false;

let phaseStartedAt = 0;
let transitionStartedAt = 0;

// Change these values to control time.
// hold = how long the phase stays still.
// transition = how long it takes to change into the next phase.
// 1000 = 1 second.
phaseTiming = [
  { name: "full image", hold: 2500, transition: 2000 },
  { name: "mini rectangles", hold: 3000, transition: 2000 },
  { name: "rounded points", hold: 5000, transition: 1500 },
  { name: "ASCII art", hold: 3000, transition: 2500 }
];


function setupTimeSystem() {
  phaseStartedAt = millis();
  transitionStartedAt = millis();
}

function updateTimeSystem() {
  let currentTiming = phaseTiming[transitionPhase];

  if (!isTransitioning) {
    let holdElapsed = millis() - phaseStartedAt;

    transitionProgress = 0;

    if (holdElapsed >= currentTiming.hold) {
      isTransitioning = true;
      transitionStartedAt = millis();
    }
  } else {
    let transitionElapsed = millis() - transitionStartedAt;

    transitionProgress = constrain(
      transitionElapsed / currentTiming.transition,
      0,
      1
    );

    if (transitionProgress >= 1) {
      transitionPhase = (transitionPhase + 1) % 4;
      phaseStartedAt = millis();
      transitionStartedAt = millis();
      transitionProgress = 0;
      isTransitioning = false;
    }
  }
}

function getSmoothProgress() {
  return transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
}

function getNextPhase() {
  return (transitionPhase + 1) % 4;
}