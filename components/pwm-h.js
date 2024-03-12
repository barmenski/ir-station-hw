//const raspi = require('raspi');
//const pwm = require('raspi-pwm');
const rpio = require('rpio');

class PWMH {

pin1 = 32;           /* P32/GPIO12 */
pin2 = 33;           /* P33/GPIO13 */
range = 1024;       /* LEDs can quickly hit max brightness, so only use */
max = 128;          /*   the bottom 8th of a larger scale */
clockdiv = 8;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */
interval = 5;       /* setInterval timer, speed of pulses */
times = 5;          /* How many times to pulse before exiting */

  constructor(){
    // this.outTop = new pwm.PWM('GPIO12');
    // this.outBottom = new pwm.PWM('GPIO13');
    rpio.open(this.pin1, rpio.PWM);
    rpio.open(this.pin2, rpio.PWM);
    rpio.pwmSetClockDivider(this.clockdiv);
    rpio.pwmSetRange(this.pin1, this.range);
    rpio.pwmSetRange(this.pin2, this.range);
  }

 
  updateTop (dutyCycle) {
      rpio.pwmSetData(this.pin1, dutyCycle);
  }

  updateBottom (dutyCycle) {
    rpio.pwmSetData(this.pin2, dutyCycle);
  }










}


module.exports = PWMH;