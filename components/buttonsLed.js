const Menu = require("./menu");
const EventEmitter = require("events");
const process = require("process");
const rpio = require("rpio");
const { POLL_LOW, POLL_HIGH } = require("rpio");

class Encoder extends EventEmitter {
  options = {
    gpiomem: false,
    mapping: "physical",
    mock: undefined,
    close_on_exit: true,
  };
  button1 = 36;
  button2 = 38;
  button3 = 40;
  led1 = 35;
  led2 = 37;

  menu = new Menu();

  constructor() {
    super();
    rpio.init(this.options);

    rpio.open(this.button1, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.button2, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.button3, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.led1, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.led2, rpio.OUTPUT, rpio.LOW);
  }

  pollcb1=()=> {
    rpio.msleep(20);
    if (rpio.read(this.button1) == 0) {
      console.log("b1");
      //menu.start();
      rpio.write(this.led2, rpio.HIGH);
    } else {
      rpio.write(this.led2, rpio.LOW);
    }
  }

  pollcb2=()=> {
    rpio.msleep(20);
    if (rpio.read(this.button2) == 0) {
      console.log("b2");
      //menu.start();
      rpio.write(this.led1, rpio.HIGH);
    } else {
      rpio.write(this.led1, rpio.LOW);
    }
  }

  pollcb3=()=> {
    rpio.msleep(20);
    if (rpio.read(this.button3) == 0) {
      console.log("b3");
      //menu.start();
      rpio.write(this.led1, rpio.HIGH);
      rpio.write(this.led2, rpio.HIGH);
    } else {
      rpio.write(this.led1, rpio.LOW);
      rpio.write(this.led2, rpio.LOW);
    }
  }

  init = () => {
    rpio.poll(this.button1, pollcb1);
    rpio.poll(this.button2, pollcb2);
    rpio.poll(this.button3, pollcb3);
  };

  stop=()=> {
    rpio.poll(this.button1, null);
    rpio.poll(this.button2, null);
    rpio.poll(this.button3, null);
    rpio.close(this.led1, rpio.PIN_RESET);
    rpio.close(this.led2, rpio.PIN_RESET);
  }
}
module.exports = Encoder;