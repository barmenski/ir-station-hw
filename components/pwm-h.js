const rpio = require("rpio");

class PWMH {
  pinUp = 33;
  pinDown = 32;
  range = 100; /* Max PWM */
  clockdiv = 8; /* Clock divider (PWM refresh rate), 8 == 2.4MHz */

  constructor() {
    rpio.open(this.pinUp, rpio.PWM);
    rpio.open(this.pinDown, rpio.PWM);
    rpio.pwmSetClockDivider(this.clockdiv);
    rpio.pwmSetRange(this.pinUp, this.range);
    rpio.pwmSetRange(this.pinDown, this.range);
  }

  updateTop(dutyCycle) {
    rpio.pwmSetData(this.pinUp, dutyCycle);
  }

  updateBottom(dutyCycle) {
    rpio.pwmSetData(this.pinDown, dutyCycle);
  }
}

module.exports = PWMH;
