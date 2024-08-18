import { Temperature } from './temp.js';
import { Input_panel } from './input_panel.js';
import { Controller } from './pid_controller.js';

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.input_panel = new Input_panel();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.idealTemp = 25;
    this.tempBoard = 25;
    this.ctr = null;
    this.currTime = 0;
    this.stepPower = 10;
    this.delta = 0;
    this.rise = 0;
    this.timerStopped = true;

    this.preHeatTime = 0;
    this.preHeatTrmp = 0;
    this.waitTime = 0;
    this.waitTemp = 0;
    this.reflowTime = 0;
    this.reflowTemp = 0;
  }

  init = () => {
    this.timer = document.querySelector('.timer');
  };

  getTemperature = () => {
    this.tempBoard = this.temperature.getTempBoard(
      this.powerTop,
      this.powerBottom,
      this.input_panel.boardWidth,
      this.input_panel.boardLength
    );
    this.tempChip = this.temperature.getTempChip(
      this.powerTop,
      this.powerBottom,
      this.input_panel.boardWidth,
      this.input_panel.boardLength
    );
  };

  heat = () => {
    window.refresh();
    this.timer.innerHTML = `${this.currTime} s`;
    this.currTime++;

    switch (this.input_panel.mode) {
      case 'pb+':
      case 'pb-':
        if (this.input_panel.mode === 'pb+') {
          this.preHeatTime = this.input_panel.profilePb[0][0];
          this.preHeatTemp = this.input_panel.profilePb[0][1];
          this.waitTime = this.input_panel.profilePb[1][0];
          this.waitTemp = this.input_panel.profilePb[1][1];
          this.reflowTime = this.input_panel.profilePb[2][0];
          this.reflowTemp = this.input_panel.profilePb[2][1];
        } else if (this.input_panel.mode === 'pb-') {
          this.preHeatTime = this.input_panel.profilePbFree[0][0];
          this.preHeatTemp = this.input_panel.profilePbFree[0][1];
          this.waitTime = this.input_panel.profilePbFree[1][0];
          this.waitTemp = this.input_panel.profilePbFree[1][1];
          this.reflowTime = this.input_panel.profilePbFree[2][0];
          this.reflowTemp = this.input_panel.profilePbFree[2][1];
        }

        if (this.tempChip < this.preHeatTemp) {
          //----------------------------------1 stage - prepare Heat
          this.rise = Number(
            ((this.preHeatTemp - 25) / (this.preHeatTime - 0)).toFixed(2)
          );
          let prevTemp = this.tempChip;
          this.getTemperature();
          this.delta = Number((this.tempChip - prevTemp).toFixed(2));
          this.ctr.setTarget(
            this.idealTemp,
            this.input_panel.k_p,
            this.input_panel.k_i,
            this.input_panel.k_d
          );
          this.idealTemp = this.idealTemp + this.rise;
          this.powerBottom = Number(this.ctr.update(this.tempChip).toFixed(2));
        } else if (
          this.tempChip >= this.preHeatTemp &&
          this.tempChip <= this.waitTemp
        ) {
          //----------------------------------2  stage - waitting
          this.rise = Number(
            (
              (this.waitTemp - this.preHeatTemp) /
              (this.waitTime - this.preHeatTime)
            ).toFixed(2)
          );
          let prevTemp = this.tempChip;
          this.getTemperature();
          this.delta = Number((this.tempChip - prevTemp).toFixed(2));
          this.ctr.setTarget(
            this.idealTemp,
            this.input_panel.k_p,
            this.input_panel.k_i,
            this.input_panel.k_d
          );
          this.idealTemp = this.idealTemp + this.rise;
          this.powerBottom = Number(this.ctr.update(this.tempChip).toFixed(2));
        } else if (this.tempChip > this.waitTemp) {
          this.input_panel.set_mode('pb const-pow');
        }
        break;
      case 'pb const-pow':
        //----------------------------------3  stage - constant power for bottom heater and rise for maximum
        if (this.tempChip >= this.waitTemp && this.tempChip < this.reflowTemp) {
          this.rise = Number(
            (
              (this.reflowTemp - this.waitTemp) /
              (this.reflowTime - this.waitTime)
            ).toFixed(2)
          );
          let prevTemp = this.tempChip;
          this.getTemperature();
          this.delta = Number((this.tempChip - prevTemp).toFixed(2));
          this.ctr.setTarget(
            this.idealTemp,
            this.input_panel.k_p,
            this.input_panel.k_i,
            this.input_panel.k_d
          );
          this.idealTemp = this.idealTemp + this.rise;
          this.powerTop = Number(this.ctr.update(this.tempChip).toFixed(2));
        } else if (this.tempChip >= this.reflowTemp) {
          this.ctr.setTarget(
            this.reflowTemp,
            this.input_panel.k_p,
            this.input_panel.k_i,
            this.input_panel.k_d
          );
          this.powerTop = Number(this.ctr.update(this.tempChip).toFixed(2));
          this.powerBottom = 197;
          this.getTemperature();
        }
        break;
      case 'heaters off':
        this.powerBottom = 0;
        this.powerTop = 0;
        this.getTemperature();
        break;
      case 'const-pow':
        this.powerBottom = this.input_panel.constPow;
        this.getTemperature();
        break;
      case 'const-temp':
        this.ctr.setTarget(
          this.input_panel.constTemp,
          this.input_panel.k_p,
          this.input_panel.k_i,
          this.input_panel.k_d
        );
        let prevTemp = this.tempChip;
        this.getTemperature();
        this.delta = Number((this.tempChip - prevTemp).toFixed(2));
        this.powerBottom = Number(this.ctr.update(this.tempChip)).toFixed(2);
        break;
    }
  };

  start = () => {
    this.init();
    this.input_panel.init();
    this.ctr = new Controller({
      k_p: this.input_panel.k_p,
      k_i: this.input_panel.k_i,
      k_d: this.input_panel.k_d,
      dt: 1,
    });

    this.timerStopped = false;
    this.timerFunc = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped
          ? console.log('Timer is stopped.')
          : this.timerFunc2();
      }, 1000 / this.input_panel.speed);
    };

    this.timerFunc2 = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped ? console.log('Timer is stopped.') : this.timerFunc();
      }, 1000 / this.input_panel.speed);
    };

    this.timerFunc();
  };

  stop = () => {
    this.timerStopped = true;
  };
}
