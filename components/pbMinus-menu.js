const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");

class PbMinus {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();

  constructor() {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetTemp = null;
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

  heat = () => {
    this.currTime++;

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    if (this.tempChip < this.preHeatTemp) {
      //1 stage - prepare Heat (bottom heater ON; top heater OFF)
      this.rise = Number(
        ((this.preHeatTemp - this.tempChip) / (this.preHeatTime - 0)).toFixed(
          2
        )
      );

      if (this.targetTemp === null) {
        this.targetTemp = this.tempChip;
      } else {
        this.targetTemp = this.targetTemp + this.rise;
      }
      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.targetTemp))
      );
      this.pwm.updateBottom(this.powerBottom*0.01);
    } else if (
      this.tempChip >= this.preHeatTemp &&
      this.tempChip <= this.liquidTemp
    ) {
      //2  stage - waitting (bottom heater ON; top heater OFF)
      this.rise = Number(
        (
          (this.liquidTemp - this.preHeatTemp) /
          (this.liquidTime - this.preHeatTime)
        ).toFixed(2)
      );
      this.targetTemp = this.targetTemp + this.rise;
      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempChip))
      );
      this.pwm.updateBottom(this.powerBottom*0.01);
    } else if (
      this.tempChip >= this.liquidTemp &&
      this.tempChip < this.peakTemp
    ) {
      //3  stage - constant power for bottom heater and rise for maximum 
      //                              (bottom heater ON; top heater ON)
      this.rise = Number(
        (
          (this.peakTemp - this.liquidTemp) /
          (this.peakTime - this.liquidTime)
        ).toFixed(2)
      );
      this.pidTop.setTarget(this.targetTemp, this.PTop, this.ITop, this.DTop);
      this.targetTemp = this.targetTemp + this.rise;
      this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      this.pwm.updateTop(this.powerTop*0.01);
    } else if (this.tempChip >= this.peakTemp) {
      this.pidTop.setTarget(this.peakTemp, this.PTop, this.ITop, this.DTop);
      this.powerTop = Math.round(
        Number(this.pidTop.update(this.tempChip))
      );
      this.pwm.updateTop(this.powerTop*0.01);
    }
  };

  async start(menu) {
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
    this.displayLCD.display(menu);

    while (!this.timerStopped) {
      this.heat();
      this.displayLCD.displayPbMinusmData(
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
}
module.exports = PbMinus;
