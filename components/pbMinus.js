const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");
const BaseComponent = require("./baseComponent");
const Encoder = require("./encoder");

class PbMinus extends BaseComponent {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();
  encoder = new Encoder();

  constructor(parent) {
    super();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.currTime = 0;
    this.rise = 0;
    this.timerStopped = true;

    this.preHeatTime = 0;
    this.preHeatTemp = 0;
    this.liquidTime = 0;
    this.liquidTemp = 0;
    this.peakTime = 0;
    this.peakTemp = 0;

    this.PBottom = 40;
    this.IBottom = 0.05;
    this.DBottom = 80;

    this.PTop = 40;
    this.ITop = 0.05;
    this.DTop = 80;

    this.parent = parent;

    this.profilePbMinus = [
      [120, 160],
      [210, 219],
      [240, 250],
    ];
    //[time sec, temp C],
    //[time sec, temp C],
    //[time sec, temp C]
  }
  async init() {
    this.arrow = 0;
    this.displayLCD.display(this.menuList.pbMinusMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();
    this.currMenu = "pbMinusMenu";
    this.currMenuLength = this.menuList.pbMinusMenu.type;

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "workPbMinusMenu": //display pause menu
          this.hiddenData = true;
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
          this.currMenu = "pausePbMinusMenu";
          this.currMenuLength = this.menuList.pauseConstMenu.type;
          break;
        case "setTargetTemp": //calculate targetTemp
          this.menuList.constMenu.data1 = this.menuList.constMenu.data1 + delta;
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
          console.log(
            "this.currmenu (constTemp.js): " + this.currMenu + " " + this.arrow
          );
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
    this.currTime++;

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    if (this.tempChip < this.preHeatTemp) {
      //1 stage - prepare Heat (bottom heater ON; top heater OFF)
      this.rise = Number(
        ((this.preHeatTemp - this.tempChip) / (this.preHeatTime - 0)).toFixed(2)
      );

      if (this.targetTemp === null) {
        this.targetTemp = this.tempChip;
      } else {
        this.targetTemp = Number((this.targetTemp + this.rise).toFixed(2));
      }
      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.targetTemp))
      );

      this.pwm.update(0, this.powerBottom);
    } else if (
      this.tempChip >= this.preHeatTemp &&
      this.tempChip <= this.liquidTemp
    ) {
      //2  stage - waitting (bottom heater ON; top heater OFF)
      this.rise = Number(
        (
          (this.liquidTemp - this.preHeatTemp) /
          (this.liquidTime - this.preHeatTime)
        ).toFixed(2)
      );
      this.targetTemp = this.targetTemp + this.rise;
      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempChip))
      );
      this.pwm.update(0, this.powerBottom);
    } else if (
      this.tempChip >= this.liquidTemp &&
      this.tempChip < this.peakTemp
    ) {
      //3  stage - constant power for bottom heater and rise for maximum
      //                              (bottom heater ON; top heater ON)
      this.rise = Number(
        (
          (this.peakTemp - this.liquidTemp) /
          (this.peakTime - this.liquidTime)
        ).toFixed(2)
      );
      this.pidTop.setTarget(this.targetTemp, this.PTop, this.ITop, this.DTop);
      this.targetTemp = this.targetTemp + this.rise;
      this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      this.pwm.update(this.powerTop, this.powerBottom);
    } else if (this.tempChip >= this.peakTemp) {
      this.pidTop.setTarget(this.peakTemp, this.PTop, this.ITop, this.DTop);
      this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      this.pwm.update(this.powerTop, this.powerBottom);
    }
  }

  async start(menu) {
    this.pwm.init();
    this.preHeatTime = this.profilePbMinus[0][0];
    this.preHeatTemp = this.profilePbMinus[0][1];
    this.liquidTime = this.profilePbMinus[1][0];
    this.liquidTemp = this.profilePbMinus[1][1];
    this.peakTime = this.profilePbMinus[2][0];
    this.peakTemp = this.profilePbMinus[2][1];

    this.pidBottom = new PID({
      k_p: this.PBottom,
      k_i: this.IBottom,
      k_d: this.DBottom,
      dt: 1,
    });
    this.pidTop = new PID({
      k_p: this.PTop,
      k_i: this.ITop,
      k_d: this.DTop,
      dt: 1,
    });
    this.timerStopped = false;
    this.displayLCD.display(menuList.workPbMinusMenu);

    while (!this.timerStopped) {
      this.#heat();
      this.displayLCD.displayPbMinusData(
        this.tempChip,
        this.tempBoard,
        this.powerTop,
        this.powerBottom
      );
      await this.sleep(1000);
    }
  }

  reset() {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  }

  pause() {
    this.timerStopped = true;
  }

  stop() {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  }
}
module.exports = PbMinus;
