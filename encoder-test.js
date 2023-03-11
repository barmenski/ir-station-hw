const Rotary = require('raspberrypi-rotary-encoder');

const pinClk = 13;
const pinDt = 14;
const pinSwitch = 12;

const rotary = new Rotary(pinClk, pinDt, pinSwitch);

rotary.on("rotate", (delta) => {
	console.log("Rotation :"+delta);
});
rotary.on("pressed", () => {
	console.log("Rotary switch pressed");
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});
