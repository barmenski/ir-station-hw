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
		const SO= ['25', '12'];
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
		let temp1 = Math.round(Number(temp[0]));
		let temp2 = Math.round(Number(temp[1]));

		if (temp1<1000 && temp1>99) {
			this.lcd.setCursorSync(2, 0);
			this.lcd.printSync(temp1);
		} else if (temp1<10){
			this.lcd.setCursorSync(4, 0);
			this.lcd.printSync(temp1);
		} else {
			this.lcd.setCursorSync(3, 0);
			this.lcd.printSync(temp1);
		}

		if (temp1<1000 && temp1>99) {
			this.lcd.setCursorSync(2, 1);
			this.lcd.printSync(temp2);
		} else if (temp1<10){
			this.lcd.setCursorSync(4, 1);
			this.lcd.printSync(temp2);
		} else {
			this.lcd.setCursorSync(3, 1);
			this.lcd.printSync(temp2);
		}
		console.log("cycle");
		await this.sleep(1000);
		}
		console.log("cycle stopped");
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
