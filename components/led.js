const EventEmitter = require("events");
const rpio = require("rpio");
const process = require("process");

class Encoder extends EventEmitter {
  options = {
    gpiomem: false,
    mapping: "physical",
    mock: undefined,
    close_on_exit: true,
  };
  led1 = 35;
  led2 = 37;

  constructor() {
    super();
    rpio.init(this.options);

    rpio.open(this.led1, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.led2, rpio.OUTPUT, rpio.LOW);
  }

  greenLed=(flag)=> {
    if (flag===true) {
      rpio.write(this.led1, rpio.HIGH);
      rpio.write(this.led2, rpio.LOW);
    } else {
      rpio.write(this.led1, rpio.LOW);
    }
  }

  redLed=(flag)=> {
    if (flag===true) {
      rpio.write(this.led2, rpio.HIGH);
      rpio.write(this.led1, rpio.LOW);
    } else {
      rpio.write(this.led2, rpio.LOW);
    }
  }

  stop=()=> {
    rpio.close(this.led1, rpio.PIN_RESET);
    rpio.close(this.led2, rpio.PIN_RESET);
  }

}
module.exports = Encoder;
process.on('exit', function() {
  /* Insert any custom cleanup code here. */
  rpio.close(this.led1, rpio.PIN_RESET);
  rpio.close(this.led2, rpio.PIN_RESET);
  rpio.exit();
})