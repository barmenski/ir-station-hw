const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");
const BaseComponent = require("./baseComponent");
const Encoder = require("./encoder");
const Led = require("./led");

class PidMenu extends BaseComponent {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();
  encoder = new Encoder();
  led = new Led();

  constructor(parent) {
    super();

    this.pidBottom = null;
    this.pidTop = null;

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
    this.displayLCD.display(this.menuList.pidMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();
    this.currMenu = "pidMenu";
    this.currMenuLength = this.menuList.pidMenu.type;

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "setPTop": //calculate P for top heater
          let rawNumberPTop = Math.round(
            Number(this.menuList.pidTopMenu.data1 + delta)
          );
          if (rawNumberPTop >= 999) {
            this.menuList.pidTopMenu.data1 = 999;
          } else if (rawNumberPTop < 0) {
            this.menuList.pidTopMenu.data1 = 0;
          } else this.menuList.pidTopMenu.data1 = rawNumberPTop;
          this.displayLCD.show3digit(4, 0, this.menuList.pidTopMenu.data1);
          break;
        case "setITop": //calculate I for top heater
          let rawNumberITop = Number(
            parseFloat(this.menuList.pidTopMenu.data2) + delta * 0.01
          );
          rawNumberITop = rawNumberITop.toFixed(2);
          if (rawNumberITop >= 100) {
            this.menuList.pidTopMenu.data1 = 100;
          } else if (rawNumberITop < 0) {
            this.menuList.pidTopMenu.data1 = 0;
          } else this.menuList.pidTopMenu.data2 = rawNumberITop;
          this.displayLCD.show3digit(4, 1, this.menuList.pidTopMenu.data2);
          break;

        case "setDTop": //calculate P for top heater
          let rawNumberDTop = Math.round(
            Number(this.menuList.pidTopMenu.data3 + delta)
          );
          if (rawNumberDTop >= 999) {
            this.menuList.pidTopMenu.data1 = 999;
          } else if (rawNumberDTop < 0) {
            this.menuList.pidTopMenu.data1 = 0;
          } else this.menuList.pidTopMenu.data3 = rawNumberDTop;
          this.displayLCD.show3digit(4, 0, this.menuList.pidTopMenu.data3);
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
      }
    });

    this.encoder.on("pressed", async () => {
      switch (this.currMenu) {
        case "pidMenu":
          switch (this.arrow) {
            case 0: //>PIDtop pressed
              this.arrow = 0;
              this.currMenu = "pidTopMenu";
              this.displayLCD.display(this.menuList.pidTopMenu, this.arrow); //display pidTopMenu
              this.currMenuLength = this.menuList.pidTopMenu.type;
              break;
            case 1: //>PIDbot pressed
              this.arrow = 0;
              this.currMenu = "pidBottomMenu";
              this.displayLCD.display(this.menuList.pidBottomMenu, this.arrow); //display pidBottomMenu
              this.currMenuLength = this.menuList.pidBottomMenu.type;
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init();
              break;
          }
        case "setPTop":
        case "setITop":
        case "setDTop":
          this.displayLCD.setBlinkFlag(false);
          break;
        case "pidTopMenu":
          switch (this.arrow) {
            case 0: //>P= pressed
              await this.#setPTop();
              this.currMenu = "pidTopMenu";
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pidTopMenu, this.arrow); //display pidTopMenu
              this.currMenuLength = this.menuList.pidTopMenu.type;
              break;
            case 1: //>I= pressed
              await this.#setITop();
              this.currMenu = "pidTopMenu";
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pidTopMenu, this.arrow); //display pidTopMenu
              this.currMenuLength = this.menuList.pidTopMenu.type;
              break;
            case 2: //>D= pressed
              await this.#setDTop();
              this.currMenu = "pidTopMenu";
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pidTopMenu, this.arrow); //display pidTopMenu
              this.currMenuLength = this.menuList.pidTopMenu.type;
              break;
            case 3: //>Save pressed
              //write

              this.arrow = 0;
              this.displayLCD.display(this.menuList.pidMenu, this.arrow);
              break;
          }
          break;
        default:
      }
    });
  }

  #removeListeners() {
    this.encoder.removeAllListeners("pressed");
    this.encoder.removeAllListeners("rotate");
    this.encoder.stop();
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
    this.fs.writeFile(
      this.path.join(__dirname, "/pidSet.json"),
      JSON.stringify(this.pidSet),
      (err) => {
        if (err) console.log(err);
        else {
          console.log("pidSet.json written successfully");
        }
      }
    );
  }

  async #setPTop() {
    this.arrow = 1;
    this.currMenu = "setPTop";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(4, 0, this.menuList.pidTopMenu.data1);
    // this.menuList.workConstMenu.text5 = this.menuList.constMenu.data1;
    // this.menuList.pauseConstMenu.data1 = this.menuList.constMenu.data1;
    this.#writeData();
  }

  async #setITop() {
    this.arrow = 1;
    this.currMenu = "setITop";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(4, 1, this.menuList.pidTopMenu.data2);
    this.#writeData();
  }

  async #setDTop() {
    this.arrow = 1;
    this.currMenu = "setDTop";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(12, 0, this.menuList.pidTopMenu.data2);
    this.#writeData();
  }
}
module.exports = PidMenu;
