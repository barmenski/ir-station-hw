const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");

class ConstTemp {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();

  constructor() { 

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
    this.displayLCD.display(menu);

    while (!this.timerStopped) {
      this.heat();
      this.displayLCD.displayPbMinusData(
        this.tempChip,
        this.tempBoard,
        this.powerTop,
        this.powerBottom
      );
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

  pause = () => {
    this.timerStopped = true;
  };

  stop = () => {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  };
};
module.exports = ConstTemp;