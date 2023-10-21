const raspi = require('raspi');
const pwm = require('raspi-soft-pwm');

class PWM {

  constructor(){
    this.outTop = new pwm.SoftPWM('GPIO12');
    this.outBottom = new pwm.SoftPWM('GPIO13');
  }

  init () {
    raspi.init(() => {
      this.outTop.write(0); // 0% Duty Cycle
      this.outBottom.write(0); // 0% Duty Cycle
    });
  }

  updateTop (dutyCycle) {
    raspi.init(() => {
      this.outTop.write(dutyCycle);
    });
  }

  updateBottom (dutyCycle) {
    raspi.init(() => {
      this.outBottom.write(dutyCycle);
    });
  }

}


//install raspi, raspi-soft-pwm on raspberry pi before work here

module.exports = PWM;