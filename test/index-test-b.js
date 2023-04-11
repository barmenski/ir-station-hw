const Thermometer = require('./thermometer');
const Rotary = require('raspberrypi-rotary-encoder');
const process = require('process');

const therm = new Thermometer();

const pinClk = 13;
const pinDt = 14;
const pinSwitch = 12;
let inc = 0;

const rotary = new Rotary(pinClk, pinDt, pinSwitch);

const mePromise = ()=>{
	return new Promise (function(resolve, reject){
		const out = therm.measure(true);
		resolve(out);
	})
}

rotary.on("rotate", async (delta) => {
	if(Number(delta)>0){
		inc = inc + Number(delta);
		console.log(inc);
	} else {
		//const res = await therm.measure(true);
		mePromise().then((result)=>console.log(result+" start"));
	};
});
rotary.on("pressed",  async() => {
	console.log("Rotary switch pressed");
	//const res = await therm.measure(false);
	therm.measure(false);
	mePromise().then((result)=>console.log(result+" stop"))
		.then(()=>console.log("stopped"));
	
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});

process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  process.exit();
});
