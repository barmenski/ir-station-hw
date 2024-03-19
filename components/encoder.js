const rpio = require('rpio');
const EventEmitter = require('events');

class  Encoder extends EventEmitter {
	options = {
		gpiomem: false,
		mapping: 'physical',
		mock: undefined,
		close_on_exit: true
	  }
	pinS1 = 21;
	pinS2 = 23;
	pinKey = 19;
	i = 0
	constructor(){
		super();
		rpio.init(this.options);
		rpio.open(this.pinS1, rpio.INPUT, rpio.PULL_UP);
		rpio.open(this.pinS2, rpio.INPUT, rpio.PULL_UP);
		rpio.open(this.pinKey, rpio.INPUT, rpio.PULL_UP);
	}

	 #pollS1S2=() => {
		console.log(rpio.read(21), " ", rpio.read(23));
		if (rpio.read(this.pinS1) == 1 && rpio.read(this.pinS2) == 1) {
			this.emit("rotate", -1);
			this.i--;
			console.log(`cc ${this.i}`);
		  } else if (rpio.read(this.pinS1)==1 && rpio.read(this.pinS2)==0) {
			this.i++;
			console.log(`cw ${this.i}`);
			this.emit("rotate", 1);
		  }
	}
	
	#pollKey=()=> {
		console.log('Button pressed');
		this.emit("pressed");
		// rpio.poll(cbpin, null);
	}

	init() {
		rpio.poll(this.pinS1, this.#pollS1S2);
		rpio.poll(this.pinKey, this.#pollKey);
		console.log("encoder.js init();")
	}

	// stop() {
	// 	rpio.poll(this.pinS1, null);
	// 	rpio.poll(this.pinS2, null);
	// 	rpio.poll(this.pinKey, null);
	// 	rpio.exit();
	// };
	


}
module.exports = Encoder;
