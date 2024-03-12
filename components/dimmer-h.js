const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PWMH = require("./pwm-h.js");
const BaseComponent = require("./baseComponent");

class Dimmer extends BaseComponent {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWMH();

  constructor(parent) {
    super();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = this.menuList.constMenu.data1;
    this.targetSpeed = this.menuList.constMenu.data2;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.currTime = 0;
    this.rise = 0;
    this.timerStopped = true;
    this.hiddenData = false;

    this.PBottom = 40;
    this.IBottom = 0.05;
    this.DBottom = 80;

    this.PTop = 40;
    this.ITop = 0.05;
    this.DTop = 80;
    this.parent = parent;
  }

  async init() {
    this.arrow = 0;
    this.displayLCD.display(this.menuList.dimmerMenu, this.arrow);
    await this.sleep(100);
    this.currMenu = "dimmerMenu";
    this.currMenuLength = this.menuList.dimmerMenu.type;

    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "workDimmerMenu": //display pause menu
          this.hiddenData = true;
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseDimmerMenu, this.arrow);
          this.currMenu = "pauseDimmerMenu";
          this.currMenuLength = this.menuList.pauseDimmerMenu.type;
          break;
        case "setPowerTop": //calculate Power Top heater
          this.menuList.dimmerMenu.data1 = Math.round(Number(this.menuList.dimmerMenu.data1 + delta));
          this.displayLCD.show3digit(4, 1, this.menuList.dimmerMenu.data1);
          break;
        case "setPowerBottom": //calculate Power Bottom heater
          this.menuList.dimmerMenu.data2 = Math.round(Number(this.menuList.dimmerMenu.data2 + delta));
          this.displayLCD.show3digit(12, 1, this.menuList.dimmerMenu.data2);
          break;
        default:
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 1) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 1;
          }

          this.displayLCD.moveArrow(this.arrow);
          console.log(
            "this.currmenu (dimmer.js): " + this.currMenu + " " + this.arrow
          );
      }
    });

    this.rotary.on("pressed", async () => {
      switch (this.currMenu) {
        case "dimmerMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.arrow = 0;
              this.currMenu = "workDimmerMenu";
              await this.start(this.menuList, this.arrow);
              this.arrow = 2;
              this.displayLCD.display(this.menuList.dimmerMenu, this.arrow); //display constMenu after this.constTemp.stop();
              this.currMenu = "dimmerMenu";
              this.currMenuLength = this.menuList.dimmerMenu.type;
              break;
            case 1: //>t=200 pressed
              await this.#setPowerTop();
              this.currMenu = "dimmerMenu";
              this.displayLCD.display(this.menuList.dimmerMenu, this.arrow);
              this.currMenuLength = this.menuList.dimmerMenu.type;
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init();
              break;
            case 3: //>Spd=1C/s pressed
              await this.#setPowerBottom();
              this.currMenu = "dimmerMenu";
              this.displayLCD.display(this.menuList.dimmerMenu, this.arrow);
              this.currMenuLength = this.menuList.dimmerMenu.type;
              break;
          }
        case "setPowerTop":
        case "setPowerBottom":
          this.displayLCD.setBlinkFlag(false);
          break;
        case "pauseDimmerMenu":
          switch (this.arrow) {
            case 0: //>Stop pressed
              this.stop();
              break;
            case 1: //>t=200 pressed
              await this.#setPowerTop();
              this.currMenu = "pauseDimmerMenu";
              this.displayLCD.display(this.menuList.pauseDimmerMenu, this.arrow);
              this.currMenuLength = this.menuList.pauseDimmerMenu.type;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
              this.hiddenData = false;
              this.currMenu = "workDimmerMenu";
              this.currMenuLength = this.menuList.workDimmerMenu.type;
              break;
            case 3:
              await this.#setPowerBottom();
              this.currMenu = "pauseDimmerMenu";
              this.displayLCD.display(this.menuList.pauseDimmerMenu, this.arrow);
              this.currMenuLength = this.menuList.pauseDimmerMenu.type;
              break;
          }
          break;
        default:
      }
    });
  }

  #removeListeners() {
    this.rotary.removeAllListeners("pressed");
    this.rotary.removeAllListeners("rotate");
  }

  #writeData() {
    this.fs.writeFile(
      this.path.join(__dirname, "/menuList.json"),
      JSON.stringify(this.menuList),
      (err) => {
        if (err) console.log(err);
        else {
          console.log("menuList.json written successfully");
        }
      }
    );
  }

  async #setPowerTop() {
    this.arrow = 1;
    this.currMenu = "setPowerTop";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(4, 1, this.menuList.dimmerMenu.data1);
    this.powerTop = this.menuList.dimmerMenu.data1;
    this.menuList.workDimmerMenu.text5 = this.menuList.dimmerMenu.data1;
    this.menuList.pauseDimmerMenu.data1 = this.menuList.dimmerMenu.data1;
    this.#writeData();
  }

  async #setPowerBottom() {
    this.arrow = 3;
    this.currMenu = "setPowerBottom";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(12, 1, this.menuList.dimmerMenu.data2);
    this.powerBottom = this.menuList.dimmerMenu.data2;
    this.menuList.workDimmerMenu.text6 = this.menuList.dimmerMenu.data2;
    this.menuList.pauseDimmerMenu.data2 = this.menuList.dimmerMenu.data2;
    this.#writeData();
  }

  #heat() {

    this.currTime++;

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    this.pwm.updateTop(this.powerTop*0.01);
    this.pwm.updateBottom(this.powerBottom*0.01);

    console.log("this.powerTop =" + this.powerTop + " this.powerBottom =" + this.powerBottom);
  }

  async start(menuList) {

    this.timerStopped = false;
    this.hiddenData = false;
    this.targetTemp = menuList.constMenu.data1;
    this.displayLCD.display(menuList.workDimmerMenu);

    while (!this.timerStopped) {
      this.#heat();
      if (!this.hiddenData) {
        this.displayLCD.displayPbMinusData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom
        );
      }

      await this.sleep(1000);
    }
  }

  reset() {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTemp = 25;

    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  }

  stop() {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  }
}
module.exports = Dimmer;
