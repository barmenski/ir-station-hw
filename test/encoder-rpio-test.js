const rpio = require('rpio');

const pinS1 = 21;
const pinS2 = 23;
const pinKey = 19;
var i = 0;
const options = {
	gpiomem: false,
	mapping: 'physical',
	mock: undefined,
	close_on_exit: true
  }
rpio.init(this.options);
rpio.open(pinS1, rpio.INPUT, rpio.PULL_UP);
rpio.open(pinS2, rpio.INPUT, rpio.PULL_UP);
rpio.open(pinKey, rpio.INPUT, rpio.PULL_UP);

function pollcb(pin) {
	var state = rpio.read(pin);
	//console.log('Button event on P', pin, state);
	console.log(rpio.read(pinS1), " ", rpio.read(pinS2));
	if (rpio.read(pinS1) == 1 && rpio.read(pinS2) == 1) {
		i--;
		console.log(`cc ${i}`);
	  } else if (rpio.read(pinS1)==1 && rpio.read(pinS2)==0) {
		i++
		console.log(`cw ${i}`);
	  }
	// rpio.poll(cbpin, null);
}

function pollbtn(pin) {
	var state = rpio.read(pin);
	console.log('Button event on P', pin, state);
	// rpio.poll(cbpin, null);
}

rpio.poll(pinS1, pollcb);
//rpio.poll(pinS2, pollcb);
rpio.poll(pinKey, pollbtn);

// rotary.on("rotate", (delta) => {
// 	console.log("Rotation :"+delta);
// });
// rotary.on("pressed", () => {
// 	console.log("Rotary switch pressed");
// });
// rotary.on("released", () => {
// 	console.log("Rotary switch release");
// });
process.on('exit', function() {
	/* Insert any custom cleanup code here. */
	rpio.exit();
});