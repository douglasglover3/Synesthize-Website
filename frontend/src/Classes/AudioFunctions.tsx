let vol = 50;

const setVol = function(volume: number) {
    vol = volume;
}

const playNote = function(note: string) {
    const file = require("../musical_notes/Piano_" + note + ".mp3");
    const audio = new Audio(file);
    audio.volume = (vol / 100);    // audio.volume in the range of [0, 1]
    audio.play();
}

export { playNote, setVol };