const DisplayLCD = require("../components/displayLCD");
const process = require("process");
const exec = require("child_process").exec;
const rpio = require("rpio");

let options = {
  gpiomem: false,
  mapping: "physical",
  mock: undefined,
  close_on_exit: true,
};
let button1 = 36;
let button2 = 38;
let button3 = 40;

rpio.init(options);
const displayLCD = new DisplayLCD();
displayLCD.clear();
rpio.msleep(200);
displayLCD.display({ name: "startMenu", type: 1, text1: "Hello!" });
rpio.open(button1, rpio.INPUT, rpio.PULL_UP);
rpio.open(button2, rpio.INPUT, rpio.PULL_UP);
rpio.open(button3, rpio.INPUT, rpio.PULL_UP);

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}

function pollcb1() {
  rpio.msleep(20);
  if (rpio.read(button1) == 0) {
    displayLCD.clear();
    displayLCD.display({ name: "startIrStation", type: 1, text1: "Start..." });
    execute("sudo systemctl start ir_station", function (callback) {
      console.log(callback);
    });
  }
}

function pollcb2() {
  rpio.msleep(20);
  if (rpio.read(button2) == 0) {
    displayLCD.clear();
    execute("sudo systemctl stop ir_station", function (callback) {
      console.log(callback);
    });
    displayLCD.display({ name: "stopIrStation", type: 1, text1: "Stopped" });
  }
}

function pollcb3() {
  rpio.msleep(20);
  if (rpio.read(button3) == 0) {
    displayLCD.clear();
    displayLCD.display({ name: "shutdown", type: 1, text1: "Shutdown" });
    execute("shutdown -h now", function (callback) {
      console.log(callback);
    });
  }
}
rpio.poll(button1, pollcb1);
rpio.poll(button2, pollcb2);
rpio.poll(button3, pollcb3);

function stop() {
  rpio.poll(button1, null);
  rpio.poll(button2, null);
  rpio.poll(button3, null);
}

process.on("exit", function () {
  stop();
  rpio.exit();
});
