const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');

class  Thermometer {
	lcd = new LCD(1, 0x27, 16, 2);
    max6675 = new Max6675();
	thermMenu = ["thermMenu", "t=000", "t=000", "C", "C"];

	constructor(){
		this.lcd = new LCD(1, 0x27, 16, 2);
		this.lcd.beginSync();

		this.active = false;
		this.cycle = false;
	}

	init = ()=> {
		this.lcd = new LCD(1, 0x27, 16, 2);
		this.lcd.began ? "" : this.lcd.beginSync();
		const CS="4";
		const SCK="24";
		const SO= ['25', '12'];
		const UNIT=1;
		this.max6675.setPin(CS, SCK, SO, UNIT);
	}

	async sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async display() {
		while(this.cycle){
		const { temp, unit } = this.max6675.readTemp();

        this.lcd.setCursorSync(2, 0);
        this.lcd.printSync(Math.round(Number(temp[0])));
        this.lcd.setCursorSync(2, 1);
        this.lcd.printSync(Math.round(Number(temp[1])));
		await this.sleep(1000);
		}
		return "display stopped";
	}

	async stop() {
		this.cycle = false;
	}

	async measure() {
		if(!this.active){
			this.active = true;
			this.cycle = true;	

			await this.lcd.clear();
			this.lcd.setCursorSync(0, 0);
			this.lcd.printSync(this.thermMenu[1]);
			this.lcd.setCursorSync(0, 1);
			this.lcd.printSync(this.thermMenu[2]);

			this.lcd.setCursorSync(6, 0);
			this.lcd.printSync(this.thermMenu[3]);
			this.lcd.setCursorSync(6, 1);
			this.lcd.printSync(this.thermMenu[4]);

			await this.display();
			//await this.lcd.clear();
			this.active = false;

			return "measure is stopped";
		} else return "measure is running";
	}


}
module.exports = Thermometer;
