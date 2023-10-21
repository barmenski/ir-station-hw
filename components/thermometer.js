const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');

class  Thermometer {
	constructor(){
	this.lcd = new LCD(1, 0x27, 16, 2);
	this.lcd.beginSync();

	this.CS = '4';
	this.SCK = '24';
	this.SO = ['25', '8'];
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
	while(this.cycle){
	const { temp, unit } = this.max6675.readTemp();
	await this.lcd.setCursor(7, 0);
	await this.lcd.print(`${temp[0]}`);// ${char(223)}`);
	await this.lcd.setCursor(7, 1);
	await this.lcd.print(`${temp[1]}`);// ${char(223)}`)
	await this.sleep(1000);
	console.log("tick");
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
		//this.max6675.setPin(this.CS, this.SCK, this.SO, this.UNIT);
		await this.lcd.clear();
		await this.lcd.printLine(0, "Temp1: ");
		await this.lcd.printLine(1, "Temp2: ");
		let res = await this.display();
		await this.lcd.clear();
		//this.max6675.stop();
		console.log(res);
		this.active = false;
		return "measure is stopped";
	} else return "measure is running";
}


}
module.exports = Thermometer;
