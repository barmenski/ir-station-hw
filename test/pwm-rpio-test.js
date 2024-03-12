const PWMH = require("../components/pwm-h");

pwm = new PWMH();

function heatTop(power) {
  this.pwm.updateTop(power);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function init () {
  heatTop(10);
  console.log(" this.pwm.updateTop(10)");
  await sleep(10000);
  heatTop(520);
  console.log(" this.pwm.updateTop(520)");
  await sleep(10000);
  heatTop(920);
  console.log(" this.pwm.updateTop(920)");
  await sleep(10000);
};

init();