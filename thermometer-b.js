const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');

class  Thermometer {
	constructor(){
	this.lcd = new LCD(1, 0x27, 16, 2);
	this.lcd.beginSync();

	this.CS = '4';
	this.SCK = '24';
	this.SO = ['25', '12'];
	this.UNIT = 1;

	this.max6675 = new Max6675();
	this.max6675.setPin(this.CS, this.SCK, this.SO, this.UNIT);

	this.active = false;
	this.cycle = false;
	}



async sleep(ms) {
  	return new Promise((resolve) => setTimeout(resolve, ms));
}

async display() {
	const { temp, unit } = this.max6675.readTemp();
	await this.lcd.setCursor(7, 0);
	await this.lcd.print(`${temp[0]}`);// ${char(223)}`);
	await this.lcd.setCursor(7, 1);
	await this.lcd.print(`${temp[1]}`);// ${char(223)}`)
	await this.sleep(1000);
	console.log("tick");
}

async measure(start) {
	if(start===true && this.active===false){ //starting cycle while
		this.active=true;//enable active=true - protect from repeating start cycle
		this.cycle=true;
		try {
			await this.lcd.clear();
			await this.lcd.printLine(0, "Temp1: ");
			await this.lcd.printLine(1, "Temp2: ");
		} catch(e) {
			console.log(`Problem with LCD: ${e}`);
		}
		while (this.cycle) {
			await this.display();
		}
	} else if(start===false && this.active===true){ //disable active flag
		this.active=false;
		this.cycle=false;
		}
	if(this.active===false && this.cycle===false) {
		return "display stopped";
	} else return "display already started";
}
}
module.exports = Thermometer;
