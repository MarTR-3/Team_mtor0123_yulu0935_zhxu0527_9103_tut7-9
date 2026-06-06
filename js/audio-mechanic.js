// Audio mechanic.
// Loads the song and returns bass, mid, treble, volume, waveform, and spectrum.

let song;
let fft;
let amplitude;

let targetVolume = 0.55;
let currentVolume = 0.55;

let hasStarted = false;

function preloadAudio() {
  song = loadSound("assets/audio/I Wanna Be Loved By You.mp3");
}

function setupAudio() {
  fft = new p5.FFT(0.85, 256);
  amplitude = new p5.Amplitude(0.9);

  song.setVolume(currentVolume);
  fft.setInput(song);
  amplitude.setInput(song);
}

function toggleAudio() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
    hasStarted = true;
  }
}

function changeVolume(amount) {
  targetVolume = constrain(targetVolume + amount, 0, 1);
}

function updateAudioData() {
  currentVolume = lerp(currentVolume, targetVolume, 0.08);

  if (song) {
    song.setVolume(currentVolume);
  }

  let isPlaying = song && song.isPlaying();

  let spectrum = isPlaying ? fft.analyze() : new Array(256).fill(0);
  let waveform = isPlaying ? fft.waveform() : new Array(256).fill(0);

  let bass = isPlaying ? fft.getEnergy("bass") : 0;
  let mid = isPlaying ? fft.getEnergy("mid") : 0;
  let treble = isPlaying ? fft.getEnergy("treble") : 0;
  let level = isPlaying ? amplitude.getLevel() : 0;

  return {
    spectrum,
    waveform,
    bass,
    mid,
    treble,
    level,
    volume: currentVolume,
    isPlaying
  };
}