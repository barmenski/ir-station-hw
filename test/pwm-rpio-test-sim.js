var rpio = require('rpio');

var pin1 = 12;		/* P12/GPIO18 P32/GPIO12*/
var pin2 = 32;		/* P12/GPIO18 P32/GPIO12*/
var range = 1024;	/* LEDs can quickly hit max brightness, so only use */
	/*   the bottom 8th of a larger scale */
var clockdiv = 8;	/* Clock divider (PWM refresh rate), 8 == 2.4MHz */

function start () {
	rpio.open(pin1, rpio.PWM);
	rpio.open(pin2, rpio.PWM);
	rpio.pwmSetClockDivider(clockdiv);
	rpio.pwmSetRange(pin1, range);
	rpio.pwmSetRange(pin2, range);
	
	var data = 500;
	rpio.pwmSetData(pin1, data);
	rpio.pwmSetData(pin2, data);
}

function stop() {
	rpio.open(pin1, rpio.INPUT);
	rpio.open(pin2, rpio.INPUT);
}
start();
setTimeout(stop,15000);

process.on('exit', function() {
	/* Insert any custom cleanup code here. */
	rpio.open(pin1, rpio.INPUT);
	rpio.open(pin2, rpio.INPUT);
	rpio.exit();
})

