var rpio = require('rpio');

/*
 * Pulse an LED attached to P12 / GPIO18 5 times.
 */

var pin1 = 33;		/* P12/GPIO18 P32/GPIO12*/
var pin2 = 32;		/* P12/GPIO18 P32/GPIO12*/
var range = 1024;	/* LEDs can quickly hit max brightness, so only use */
var max = 128;		/*   the bottom 8th of a larger scale */
var clockdiv = 8;	/* Clock divider (PWM refresh rate), 8 == 2.4MHz */
var interval = 5;	/* setInterval timer, speed of pulses */
var times = 15;		/* How many times to pulse before exiting */

/*
 * Enable PWM on the chosen pin and set the clock and range.
 */
rpio.open(pin1, rpio.PWM);
rpio.open(pin2, rpio.PWM);
rpio.pwmSetClockDivider(clockdiv);
rpio.pwmSetRange(pin1, range);
rpio.pwmSetRange(pin2, range);

/*
 * Repeatedly pulse from low to high and back again until times runs out.
 */
var direction = 1;
var data = 0;
var pulse = setInterval(function() {
	rpio.pwmSetData(pin1, data);
    rpio.pwmSetData(pin2, data);
	if (data === 0) {
		direction = 1;
		if (times-- === 0) {
			clearInterval(pulse);
			rpio.open(pin1, rpio.INPUT);
            rpio.open(pin2, rpio.INPUT);
			return;
		}
	} else if (data === max) {
		direction = -1;
	}
	data += direction;
}, interval, data, direction, times);