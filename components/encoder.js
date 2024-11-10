const rpio = require('rpio');
const EventEmitter = require('events');
const { POLL_LOW, POLL_HIGH } = require('rpio');
EventEmitter.defaultMaxListeners = 15;

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
		//rpio.msleep(10);
		if (rpio.read(this.pinS1) == 1 && rpio.read(this.pinS2) == 1) {
			this.emit("rotate", -1);
			this.i--;
			rpio.msleep(1);
		  } else if (rpio.read(this.pinS1)==1 && rpio.read(this.pinS2)==0) {
			this.emit("rotate", 1);
			this.i++;
			rpio.msleep(1);
		  }
	}
	
	#pollKey=()=> {
		rpio.msleep(20);
		this.emit("pressed");
	}

	init=()=> {
		rpio.poll(this.pinS1, this.#pollS1S2);
		rpio.poll(this.pinKey, this.#pollKey, POLL_LOW);
	}

	stop=()=> {
		rpio.poll(this.pinS1, null);
		rpio.poll(this.pinKey, null);
	};
	


}
module.exports = Encoder;
