const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');

class  Thermometer {
	lcd = new LCD(1, 0x27, 16, 2);
    max6675 = new Max6675();
	thermMenu = ["thermMenu", "t=000", "t=000", "C", "C"];

	constructor(){
		this.lcd.began ? "" : this.lcd.beginSync();
		const CS="4";
		const SCK="24";
		const SO= ['25', '8'];
		const UNIT=1;
		this.max6675.setPin(CS, SCK, SO, UNIT);

		this.active = false;
		this.cycle = false;
	}

	async sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async display() {
		while(this.cycle){
		const { temp, unit } = this.max6675.readTemp();
		let tempChip = Math.round(Number(temp[0]));
		let tempBoard = Math.round(Number(temp[1]));

		if (tempChip<1000 && tempChip>99) {
			this.lcd.setCursorSync(2, 0);
			this.lcd.printSync(tempChip);
		} else if (tempChip<10){
			this.lcd.setCursorSync(4, 0);
			this.lcd.printSync(tempChip);
		} else {
			this.lcd.setCursorSync(3, 0);
			this.lcd.printSync(tempChip);
		}

		if (tempChip<1000 && tempBoard>99) {
			this.lcd.setCursorSync(2, 1);
			this.lcd.printSync(tempBoard);
		} else if (tempChip<10){
			this.lcd.setCursorSync(4, 1);
			this.lcd.printSync(tempBoard);
		} else {
			this.lcd.setCursorSync(3, 1);
			this.lcd.printSync(tempBoard);
		}
		await this.sleep(1000);
		}
		return "display stopped";
	}

	stop() {
		this.cycle = false;
	}

	async measure() {
		
		if(!this.active){
			console.log("measure");
			this.active = true;
			this.cycle = true;	

			this.lcd.clearSync();
			this.lcd.setCursorSync(0, 0);
			this.lcd.printSync(this.thermMenu[1]);
			this.lcd.setCursorSync(0, 1);
			this.lcd.printSync(this.thermMenu[2]);

			this.lcd.setCursorSync(6, 0);
			this.lcd.printSync(this.thermMenu[3]);
			this.lcd.setCursorSync(6, 1);
			this.lcd.printSync(this.thermMenu[4]);

			await this.display();
			this.active = false;
			console.log("measure stopped");
			return "measure is stopped";
		} else return "measure is running";
	}


}
module.exports = Thermometer;
