const PID = require('./pid.js');
const PWM = require('./pwm.js');

const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');


class  PbMinus {
	lcd = new LCD(1, 0x27, 16, 2);
  max6675 = new Max6675();
  pwm = new PWM();
	thermMenu = ["thermMenu", "t=000", "t=000", "C", "C"];
	workPbMinusMenu = ["workPbMinusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
	stayPbMinusMenu = ["stayPbMinusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "Zzz"];

	constructor(){
		this.lcd.began ? "" : this.lcd.beginSync();
		const CS="4";
		const SCK="24";
		const SO= ['8', '25'];
		const UNIT=1;
		this.max6675.setPin(CS, SCK, SO, UNIT);

    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.startTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.currTime = 0;
    this.rise = 0;
    this.timerStopped = true;

    this.preHeatTime = 0;
    this.preHeatTemp = 0;
    this.liquidTime = 0;
    this.liquidTemp = 0;
    this.peakTime = 0;
    this.peakTemp = 0;

    this.PBottom = 40;
    this.IBottom = 0.05;
    this.DBottom = 80;

    this.PTop = 40;
    this.ITop = 0.05;
    this.DTop = 80;

    this.profilePbMinus = [
      [120, 160],
      [210, 219],
      [240, 250],
    ];
    //[time sec, temp C],
    //[time sec, temp C],
    //[time sec, temp C]
	}

	async sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	displayTitles() {
    this.lcd.clearSync();

    this.lcd.setCursorSync(0, 0);
    this.lcd.printSync(this.workPbMinusMenu[1]);
    this.lcd.setCursorSync(0, 1);
    this.lcd.printSync(this.workPbMinusMenu[2]);

    this.lcd.setCursorSync(6, 0);
    this.lcd.printSync(this.workPbMinusMenu[3]);
    this.lcd.setCursorSync(6, 1);
    this.lcd.printSync(this.workPbMinusMenu[4]);

    this.lcd.setCursorSync(13, 0);
    this.lcd.printSync(this.workPbMinusMenu[5]);
    this.lcd.setCursorSync(13, 1);
    this.lcd.printSync(this.workPbMinusMenu[6]);

    //t=000 P=000% pt1
    //t=000 P=000% run

  }

	async displayData() {

		if (this.tempChip<1000 && this.tempChip>99) {
			this.lcd.setCursorSync(2, 0);
			this.lcd.printSync(this.tempChip);
		} else if (this.tempChip<10){
			this.lcd.setCursorSync(4, 0);
			this.lcd.printSync(this.tempChip);
		} else {
			this.lcd.setCursorSync(3, 0);
			this.lcd.printSync(this.tempChip);
		}

		if (this.tempBoard<1000 && this.tempBoard>99) {
			this.lcd.setCursorSync(2, 1);
			this.lcd.printSync(this.tempBoard);
		} else if (this.tempBoard<10){
			this.lcd.setCursorSync(4, 1);
			this.lcd.printSync(this.tempBoard);
		} else {
			this.lcd.setCursorSync(3, 1);
			this.lcd.printSync(this.tempBoard);
		}

    if (this.powerTop<1000 && this.powerTop>99) {
			this.lcd.setCursorSync(8, 0);
			this.lcd.printSync(this.powerTop);
		} else if (this.powerTop<10){
			this.lcd.setCursorSync(10, 0);
			this.lcd.printSync(this.tempBoard);
		} else {
			this.lcd.setCursorSync(9, 0);
			this.lcd.printSync(this.tempBoard);
		}

    if (this.powerBottom<1000 && this.powerBottom>99) {
			this.lcd.setCursorSync(8, 1);
			this.lcd.printSync(this.powerBottom);
		} else if (this.powerBottom<10){
			this.lcd.setCursorSync(10, 1);
			this.lcd.printSync(this.powerBottom);
		} else {
			this.lcd.setCursorSync(9, 1);
			this.lcd.printSync(this.powerBottom);
		}

      //t=000 P=000% pt1
      //  ↑↑↑   ↑↑↑ 
      //t=000 P=000% run
      //  ↑↑↑   ↑↑↑

	}



  getTemperature = () => {
    const { temp, unit } = this.max6675.readTemp();
    this.tempChip = Math.round(Number(temp[0]));
    this.tempBoard = Math.round(Number(temp[1]));

  };

  heat = () => {
    this.currTime++;

    this.getTemperature(); 

    if (this.tempChip < this.preHeatTemp) {
      //1 stage - prepare Heat

      if (this.startTemp===null) 
        {
          this.rise = Number(
            ((this.preHeatTemp - this.tempChip) / (this.preHeatTime - 0)).toFixed(2)
          );
          this.startTemp = this.tempChip;
        } else {this.startTemp = this.startTemp + this.rise}
      this.pidBottom.setTarget(
        this.startTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Number(this.pidBottom.update(this.tempChip).toFixed(2));
      this.pwm.outBottom (this.powerBottom);
    } else if (
      this.tempChip >= this.preHeatTemp &&
      this.tempChip <= this.liquidTemp
    ) {
      //2  stage - waitting
      this.rise = Number(
        (
          (this.liquidTemp - this.preHeatTemp) /
          (this.liquidTime - this.preHeatTime)
        ).toFixed(2)
      );
      this.startTemp = this.startTemp + this.rise
      this.pidBottom.setTarget(
        this.startTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Number(this.pidBottom.update(this.tempChip).toFixed(2));
      this.pwm.outBottom (this.powerBottom);
    } else if (this.tempChip >= this.liquidTemp && this.tempChip < this.peakTemp) {
      //3  stage - constant power for bottom heater and rise for maximum
      this.rise = Number(
        (
          (this.peakTemp - this.liquidTemp) /
          (this.peakTime - this.liquidTime)
        ).toFixed(2)
      );
      this.pidTop.setTarget(
        this.startTemp,
        this.PTop,
        this.ITop,
        this.DTop
      );
      this.startTemp = this.startTemp + this.rise;
      this.powerTop = Number(this.pidTop.update(this.tempChip).toFixed(2));
      this.pwm.outTop(this.powerTop);
    } else if (this.tempChip >= this.peakTemp) {
      this.pidTop.setTarget(
        this.peakTemp,
        this.PTop,
        this.ITop,
        this.DTop
      );
      this.powerTop = Number(this.pidTop.update(this.tempChip).toFixed(2));
      this.pwm.outTop(this.powerTop);
    }

    
  };

  async start ()  {
    this.preHeatTime = this.profilePbMinus[0][0];
    this.preHeatTemp = this.profilePbMinus[0][1];
    this.liquidTime = this.profilePbMinus[1][0];
    this.liquidTemp = this.profilePbMinus[1][1];
    this.peakTime = this.profilePbMinus[2][0];
    this.peakTemp = this.profilePbMinus[2][1];

    this.pidBottom = new PID({
      k_p: this.PBottom,
      k_i: this.IBottom,
      k_d: this.DBottom,
      dt: 1,
    });
    this.pidTop = new PID({
      k_p: this.PTop,
      k_i: this.ITop,
      k_d: this.DTop,
      dt: 1,
    });
    this.timerStopped = false;
    this.displayTitles();

	  while(this.timerStopped){
		  this.heat();
      await this.displayData();
		  await this.sleep(1000);
	  }

  };

  reset = () => {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.startTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  }

  pause = () => {
    this.timerStopped = true;
  }

  stop = () => {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  };


}
module.exports = PbMinus;