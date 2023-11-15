
const Max6675 = require('max6675-raspi');
const DisplayLCD = require('./displayLCD');

class  Thermometer {
    max6675 = new Max6675();
	displayLCD = new DisplayLCD();

	constructor(){
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

	async measure() {
		while(this.cycle){
		const { temp, unit } = this.max6675.readTemp();
		let tempChip = Math.round(Number(temp[0]));
		let tempBoard = Math.round(Number(temp[1]));

		this.displayLCD.displayThermData(tempChip, tempBoard);

		await this.sleep(1000);
		}
		return "display stopped";
	}

	stop() {
		this.cycle = false;
	}

	async start(menu) {
		
		if(!this.active){
			console.log("measure");
			this.active = true;
			this.cycle = true;	

			this.displayLCD.displayThermTitles(menu);

			await this.measure();
			this.active = false;
			console.log("measure stopped");
			return "measure is stopped";
		} else return "measure is running";
	}


}
module.exports = Thermometer;
