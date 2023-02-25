const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');

const lcd = new LCD(1, 0x27, 16, 2);
const max6675 = new Max6675();

const CS = '4';
const SCK = '24';
const SO = ['25', '12'];
const UNIT = 1;

max6675.setPin(CS, SCK, SO, UNIT);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function measure () {
	try {
		lcd.beginSync();
	} catch(e) {
		console.log(e);
 	}
  while (true) {
    const { temp, unit } = max6675.readTemp();
    if (temp.length) await lcd.clear();
    await lcd.printLine(0, `Temp 1:${temp[0]} ${unit}`);
    await lcd.printLine(1, `Temp 2:${temp[1]} ${unit}`);
    await max6675.sleep(1000);
  }
};

async function stop() {
  const phrase = `Buy-buy!`;
  lcd.printLineSync(0, phrase);
  for (let i = 0; i < phrase.length; i++) {
    lcd.scrollDisplayLeft();
    await sleep(500);
  }
  lcd.clearSync();
  lcd.noDisplay();
}

try{
	measure();
} catch(e){
	console.log(e);
	console.log(`\nir-statio-hw closed`);
	stoo();
	process.exit();
}

/*process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  stop();
  process.exit();
});
*/
