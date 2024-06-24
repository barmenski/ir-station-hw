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
    this.displayLCD.display(this.menuList.constMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();
    this.currMenu = "constMenu";
    this.currMenuLength = this.menuList.constMenu.type;

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "workConstMenu": //display pause menu
          this.hiddenData = true;
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
          this.currMenu = "pauseConstMenu";
          this.currMenuLength = this.menuList.pauseConstMenu.type;
          break;
        case "setTargetTemp": //calculate targetTemp
          let rawNumberBottom = Math.round(
            Number(this.menuList.constMenu.data1 + delta)
          );
          if (rawNumberBottom >= 300) {
            this.menuList.constMenu.data1 = 300;
          } else if (rawNumberBottom < 0) {
            this.menuList.constMenu.data1 = 0;
          } else this.menuList.constMenu.data1 = rawNumberBottom;
          // this.menuList.constMenu.data1 = Math.round(
          //   Number(this.menuList.constMenu.data1 + delta)
          // );
          this.displayLCD.show3digit(4, 1, this.menuList.constMenu.data1);
          break;
        case "setTargetSpeed": //calculate targetSpeed
          this.menuList.constMenu.data2 =
            parseFloat(this.menuList.constMenu.data2) + delta * 0.1;
          this.menuList.constMenu.data2 = Number(
            this.menuList.constMenu.data2.toFixed(1)
          );
          this.displayLCD.show3digit(12, 1, this.menuList.constMenu.data2);
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
        case "constMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.arrow = 0;
              this.currMenu = "workConstMenu";
              await this.start(this.menuList, this.arrow);
              this.arrow = 2;
              this.displayLCD.display(this.menuList.constMenu, this.arrow); //display constMenu after this.constTemp.stop();
              this.currMenu = "constMenu";
              this.currMenuLength = this.menuList.constMenu.type;
              break;
            case 1: //>t=200 pressed
              await this.#setTargetTemp();
              this.currMenu = "constMenu";
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              this.currMenuLength = this.menuList.constMenu.type;
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init();
              break;
            case 3: //>Spd=1C/s pressed
              await this.#setTargetSpeed();
              this.currMenu = "constMenu";
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              this.currMenuLength = this.menuList.constMenu.type;
              break;
          }
        case "setTargetTemp":
        case "setTargetSpeed":
          this.displayLCD.setBlinkFlag(false);
          break;
        case "pauseConstMenu":
          switch (this.arrow) {
            case 0: //>Stop pressed
              this.stop();
              break;
            case 1: //>t=200 pressed
              await this.#setTargetTemp();
              this.currMenu = "pauseConstMenu";
              this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
              this.currMenuLength = this.menuList.pauseConstMenu.type;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.workConstMenu, this.arrow);
              this.hiddenData = false;
              this.currMenu = "workConstMenu";
              this.currMenuLength = this.menuList.workConstMenu.type;
              break;
            case 3:
              await this.#setTargetSpeed();
              this.currMenu = "pauseConstMenu";
              this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
              this.currMenuLength = this.menuList.pauseConstMenu.type;
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
  }

  async #setTargetTemp() {
    this.arrow = 1;
    this.currMenu = "setTargetTemp";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(4, 1, this.menuList.constMenu.data1);
    this.menuList.workConstMenu.text5 = this.menuList.constMenu.data1;
    this.menuList.pauseConstMenu.data1 = this.menuList.constMenu.data1;
    this.#writeData();
  }

  async #setTargetSpeed() {
    this.arrow = 3;
    this.currMenu = "setTargetSpeed";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(12, 1, this.menuList.constMenu.data2);
    this.targetSpeed = this.menuList.constMenu.data2;
    this.menuList.workConstMenu.text6 = this.menuList.constMenu.data2;
    this.menuList.pauseConstMenu.data2 = this.menuList.constMenu.data2;
    this.#writeData();
  }

  #heat() {

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    if (this.tempBoard < this.menuList.constMenu.data1) {
      this.led.greenLed(true);
      this.targetTemp = Number(
        this.tempBoard + this.targetSpeed * (this.period / 1000)
      ).toFixed(2);

      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      ); //set target for PID
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempBoard))
      ); //calculate power from PID
      this.pwm.update(this.powerTop, this.powerBottom); //send calculated power to output
    } else {
      this.led.redLed(true);
      // this.pidBottom.setTarget(
      //   this.menuList.constMenu.data1,
      //   this.PBottom,
      //   this.IBottom,
      //   this.DBottom
      // ); //set target for PID
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempBoard))
      ); //calculate power from PID

      this.pwm.update(this.powerTop, this.powerBottom); //send calculated power to output
    }
  }

  //0.7 c/s period = 2 => 0.7*2; period = 0.5 => 0.7*0.5

  async start(menuList) {
    this.pwm.init();
    this.pidBottom = new PID({
      k_p: this.PBottom,
      k_i: this.IBottom,
      k_d: this.DBottom,
      dt: 1,
    });

    this.timerStopped = false;
    this.hiddenData = false;
    this.targetTemp = menuList.constMenu.data1;
    this.displayLCD.display(menuList.workConstMenu);

    while (!this.timerStopped) {
      this.#heat();
      if (!this.hiddenData) {
        this.displayLCD.displayProfilData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom
        );
      }
      await this.sleep(this.period);
    }

        while (!this.timerStopped) {
      this.#heat();
      if (!this.hiddenData) {
        this.displayLCD.displayProfilData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom
        );
      }
      await this.sleep(this.period);
    }
  }

  reset() {
    this.led.greenLed(false);
    this.tempChip = 25;
    this.targetTemp = 25;

    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  }

  stop() {
    this.led.greenLed(false);
    this.led.stop();
    this.timerStopped = true;
    this.currTime = 0;
    this.pwm.stop();
    this.reset();
  }
}
module.exports = PidMenu;
