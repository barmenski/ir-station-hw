const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');
const Rotary = require('raspberrypi-rotary-encoder');

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function reset() {
	await lcd.clear();
	await lcd.printLine(0, 'Temp1: ');
	await lcd.printLine(1, 'Temp2: ');
}

async function measure () {
	try {
		await lcd.begin();
		await lcd.clear();
		await lcd.printLine(0, 'Temp1: ');
		await lcd.printLine(1, 'Temp2: ');

	} catch(e) {
		console.log(`Problem with LCD: ${e}`);
 	}
	while (true) {
		const { temp, unit } = max6675.readTemp();
		await lcd.setCursor(7, 0);
		await lcd.print(`${temp[0]} ${unit}`);
		await lcd.setCursor(7, 1);
		await lcd.print(`${temp[1]} ${unit}`);
		await sleep(1000);
	}
};

async function stop() {
	await lcd.clear();
	const phrase = `Buy-buy!`;
	await lcd.printLine(0, phrase);
	for (let i = 0; i < phrase.length; i++) {
		lcd.scrollDisplayLeft();
		await sleep(300);
	}
	await sleep(300);
	lcd.clearSync();
	lcd.noDisplay();
}

measure();

rotary.on("rotate", (delta) => {
	console.log("Rotation :"+delta);
	if(delta){
		lcd.setCursorSync(7, 1);
		lcd.printSync(inc+delta);
	} else reset();
});
rotary.on("pressed", () => {
	console.log("Rotary switch pressed");
	stop();
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});

/*
try{
	measure();
} catch(e){
	console.log(e);
	console.log(`\nir-statio-hw closed`);
	stop();
	process.exit();
}
*/
process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  stop();
  process.exit();
});
