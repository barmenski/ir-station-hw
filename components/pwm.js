const rpio = require("rpio");

class PWM {
  pinTop = 33;// pwm1
  pinBottom = 32; // pwm0
  range = 100; /* Max PWM */
  clockdiv = 2048; /* Clock divider (PWM refresh rate), 8 == 2.4MHz 64=3khz 128=1.5khz 256=750hz*/

  constructor() {

  }

  init() {
    rpio.open(this.pinTop, rpio.PWM);
    rpio.open(this.pinBottom, rpio.PWM);
    rpio.pwmSetClockDivider(this.clockdiv);
    rpio.pwmSetRange(this.pinTop, this.range);
    rpio.pwmSetRange(this.pinBottom, this.range);
  }

  update(dutyCycle1, dutyCycle2) {
    rpio.pwmSetData(this.pinTop, dutyCycle1);
    rpio.pwmSetData(this.pinBottom, dutyCycle2);
  }

  stop(){
    rpio.open(this.pinTop, rpio.INPUT);
    rpio.open(this.pinBottom, rpio.INPUT);
  }
}

module.exports = PWM;
