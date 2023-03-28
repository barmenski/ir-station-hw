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

let inc=0;
let active = false;
let cycle = false;
let cycling = false;

function sleep(ms) {
  	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function display() {
	console.log(`log1`);
	await sleep(1000);
	console.log("log2");
	await sleep(1000);
	console.log("log3");
	await sleep(1000);
}

async function measure(start) {
	if(start===true && active===false){ 	//starting cycle while
		active=true;			//enable active=true - protect from repeating start cycle
		while (cycle) {
			await display();
		}
	} else if(start===false && active===true){ //disable active flag
		active=false;
	}
	if(active===false && cycle===false) {
		return "display stopped";
	} else return "display already started";
}

async function stop() {
	cycle=false;
	await measure(false);
};

rotary.on("rotate", async (delta) => {
	if(Number(delta)>0){
		inc = inc + Number(delta);
		console.log(inc);
	} else {
		cycle=true;
		let res = await measure(true);
		console.log(res+" start");
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
  process.exit(1);
});
