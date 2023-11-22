const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");

class ConstTemp {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();

  constructor() { 
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.currTime = 0;
    this.rise = 0;
    this.timerStopped = true;
    this.hiddenData = false;

    this.PBottom = 40;
    this.IBottom = 0.05;
    this.DBottom = 80;

    this.PTop = 40;
    this.ITop = 0.05;
    this.DTop = 80;
   }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  heat = () => {
    this.currTime++;

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    if (this.tempBoard < this.targetTemp) {
      
      this.targetTemp = Number((this.tempChip + this.speed - 0)).toFixed(2);

      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempBoard))
      );

      this.pwm.updateBottom(this.powerBottom * 0.01);
    }
  };

  async start(menu) {
    this.speed = 1;
    this.targetTemp = 50;

    this.pidBottom = new PID({
      k_p: this.PBottom,
      k_i: this.IBottom,
      k_d: this.DBottom,
      dt: 1,
    });

    this.timerStopped = false;
    this.hiddenData = false;
    this.displayLCD.display(menu);

    while (!this.timerStopped) {
      this.heat();
      if(!this.hiddenData){
        this.displayLCD.displayPbMinusData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom
        );
      }

      await this.sleep(1000);
    }
  }

  reset = () => {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  };

  noDisplayData = () => {
    this.hiddenData = true;
  };

  stop = () => {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  };
};
module.exports = ConstTemp;