
const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require("max6675-raspi");

const lcd = new LCD(1, 0x27, 16, 2);
// Init the lcd (must be done before calling any other methods)
lcd.beginSync();
// Clear any previously displayed content
//lcd.clearSync();
// Display text multiline
//lcd.printLineSync(0, 'Hello, world!');
//lcd.printLineSync(1, 'I output LCD.');


const CS = "4";
const SCK = "24";
const SO = ["25", "12"];
const UNIT = "1";
const max6675 = new Max6675();
max6675.setPin(CS, SCK, SO, UNIT);

(async () => {
	while (true) {
		const { temp, unit } = max6675.readTemp();
		if (temp.length)
			lcd.clearSync();
			lcd.printLineSync(0, `Temp -:${temp[0]/4}°C`);
			lcd.printLineSync(1, `Temp _:${temp[1]/4}°C`);
			//console.log(`unit: ${unit}`);
			//console.log(`${temp.map(item => (item + unit)/4)}°C`);
		await max6675.sleep(2000);
	}
})();
