// Leah's Audio Mechanic
// This code was generated with the help of ChatGPT.
// It allows users to click the main image to play or pause the audio.

let leahSound;
let audioStarted = false;
let audioLoaded = false;

function preloadAudioMechanic() {
  soundFormats("mp3");

  leahSound = loadSound(
    "assets/I Wanna Be Loved By You.mp3",
    function () {
      console.log("Audio loaded successfully");
      audioLoaded = true;
    },
    function (error) {
      console.error("Audio failed to load:", error);
    }
  );
}

function setupAudioMechanic() {
  // No analyser is needed now because the image does not move with the audio.
}

function toggleAudio() {
  userStartAudio();

  if (!audioLoaded) {
    console.log("Audio is still loading");
    return;
  }

  if (leahSound.isPlaying()) {
    leahSound.pause();
    audioStarted = false;
  } else {
    leahSound.loop();
    audioStarted = true;
  }
}

function drawAudioInstruction() {
  noStroke();

  fill(0, 0, 0, 160);
  rectMode(CENTER);
  rect(width / 2, height - 55, 380, 48, 20);

  fill(255);
  textSize(17);

  if (!audioLoaded) {
    text("Loading audio...", width / 2, height - 55);
  } else if (audioStarted) {
    text("Audio is playing — click image to pause", width / 2, height - 55);
  } else {
    text("Click the image to play audio", width / 2, height - 55);
  }

  rectMode(CORNER);
}