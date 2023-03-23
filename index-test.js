const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');
const Rotary = require('raspberrypi-rotary-encoder');
const process = require('process');

const lcd = new LCD(1, 0x27, 16, 2);

const CS = '4';
const SCK = '24';
const SO = ['25', '12'];
const UNIT = 1;

const max6675 = new Max6675();
max6675.setPin(CS, SCK, SO, UNIT);

const pinClk = 13;
const pinDt = 14;
const pinSwitch = 12;

const rotary = new Rotary(pinClk, pinDt, pinSwitch);

var inc=0;
var working=true;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function reset() {
	working = true;
	measure();
}

async function measure () {
	while (working) {
		console.log("log1");
		await sleep(1000);
		console.log("log2");
		await sleep(1000);
		console.log("log3");
		await sleep(1000);
	}
};

function stop() {
	working = false;
	console.log("stop!");
}

rotary.on("rotate", (delta) => {
	working = false;
	if(Number(delta)>0){
		inc = inc + Number(delta);
		console.log(inc);
	} else {
		reset();
	};
});
rotary.on("pressed", () => {
	console.log("Rotary switch pressed");
	stop();
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});

process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  stop();
  process.exit();
});
