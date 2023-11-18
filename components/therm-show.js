const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");

class ThermShow {
  thermometer = new Thermometer();
  displayLCD = new DisplayLCD();
  constructor() {
    this.active = false;
    this.cycle = false;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async measure() {
    while (this.cycle) {
      let allTemp = this.thermometer.measure();
      let tempChip = allTemp[0];
      let tempBoard = allTemp[1];

      this.displayLCD.displayThermData(tempChip, tempBoard);

      await this.sleep(1000);
    }
    return "display stopped";
  }

  stop() {
    this.cycle = false;
  }

  async start(menu) {
    if (!this.active) {
      console.log("measure");
      this.active = true;
      this.cycle = true;

      this.displayLCD.displayThermTitles(menu);

      await this.measure();
      this.active = false;
      console.log("measure stopped");
      return "measure is stopped";
    } else return "measure is running";
  }
}
module.exports = ThermShow;
