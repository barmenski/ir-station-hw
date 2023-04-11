const Max6675 = require("max6675-raspi");

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
			console.log(`unit: ${unit}`);
			console.log(`${temp.map(item => (item + unit)/4)}°C`);
		await max6675.sleep(2000);
	}
})();
