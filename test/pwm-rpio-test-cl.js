var rpio = require('rpio');

class PWMH {
pin1 = 32;		/* P12/GPIO18 P32/GPIO12*/
pin2 = 33;		/* P12/GPIO18 P32/GPIO12*/
range = 1024;	/* LEDs can quickly hit max brightness, so only use */
	/*   the bottom 8th of a larger scale */
clockdiv = 8;	/* Clock divider (PWM refresh rate), 8 == 2.4MHz */

constructor () {
}
init() {
	rpio.open(this.pin1, rpio.PWM);
	rpio.open(this.pin2, rpio.PWM);
	rpio.pwmSetClockDivider(this.clockdiv);
	rpio.pwmSetRange(this.pin1, this.range);
	rpio.pwmSetRange(this.pin2, this.range);
	

}
update(data1, data2) {
	rpio.pwmSetData(this.pin1, data1);
	rpio.pwmSetData(this.pin2, data2);
}

stop() {
	rpio.open(this.pin1, rpio.INPUT);
	rpio.open(this.pin2, rpio.INPUT);
}


}

module.exports = PWMH;