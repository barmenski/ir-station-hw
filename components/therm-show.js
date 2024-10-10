const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const ServerHttp = require("./server");

class ThermShow {
  thermometer = new Thermometer();
  displayLCD = new DisplayLCD();
  serverHttp = new ServerHttp();
  
  constructor() {
    this.active = false;
    this.cycle = false;
    this.startTime = 0;
    this.currTime = 0;
    this.duration = 0;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  init(ioConnection) {
    this.io = ioConnection;
  }

  async measure() {
    while (this.cycle) {
      let allTemp = this.thermometer.measure();
      this.tempChip = allTemp[0];
      this.tempBoard = allTemp[1];

      this.displayLCD.displayThermData(this.tempChip, this.tempBoard);
      if (this.startTime === 0) {
        this.startTime = Date.now();
      } //ms
      this.currTime = Date.now(); //ms
      this.duration = Number(
        ((this.currTime - this.startTime) / 1000).toFixed(2)
      ); //s
      let data = {
        tempChip: this.tempChip,
        tempBoard: this.tempBoard,
        powerTop: 0,
        powerBottom: 0,
        stage: "thermometer",
        duration: this.duration
      };
    
      this.serverHttp.send(this.io, data);

      await this.sleep(1000);
    }
    return "display stopped";
  }




  stop() {
    this.cycle = false;
  }

  async start(menu) {
    if (!this.active) {
      this.active = true;
      this.cycle = true;

      this.displayLCD.displayThermTitles(menu);
      
      await this.measure();
      this.active = false;
      return "measure is stopped";
    } else return "measure is running";
  }
}
module.exports = ThermShow;
