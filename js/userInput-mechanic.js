// User input mechanic.
// Number keys control the Warhol-inspired color palettes.

let userControls = {
  paletteIndex: 0
};

function handlePaletteKeys() {
  if (key >= "1" && key <= "9") {
    userControls.paletteIndex = int(key) - 1;
  }

  if (key === "0") {
    userControls.paletteIndex = 9;
  }
}