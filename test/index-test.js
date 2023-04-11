const Thermometer = require('./thermometer');
const Rotary = require('raspberrypi-rotary-encoder');
const process = require('process');

const therm = new Thermometer();

const pinClk = 13;
const pinDt = 14;
const pinSwitch = 12;
let inc = 0;

const rotary = new Rotary(pinClk, pinDt, pinSwitch);

rotary.on("rotate", async (delta) => {
	if(Number(delta)>0){
		inc = inc + Number(delta);
		console.log(inc);
	} else {
		let res = await therm.measure();
		console.log(res);
	};
});
rotary.on("pressed",  async() => {
	console.log("Rotary switch pressed");
	therm.stop();
	
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});

process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
	therm.max6675.stop();
  process.exit();
});
