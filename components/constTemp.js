const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");
const BaseComponent = require("./baseComponent");

class ConstTemp extends BaseComponent {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  pwm = new PWM();

  constructor(parent) {
    super();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.tempChip = 25;
    this.targetTemp = 50;
    this.speed = 1;
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
    this.displayLCD.display(this.menuList.constMenu, this.arrow);
    await this.sleep(100);
    this.currMenu = "constMenu";
    this.currMenuLength = this.menuList.constMenu.type;

    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "workConstMenu": //display pause menu
          this.hiddenData = true;
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
          this.currMenu = "pauseConstMenu";
          this.currMenuLength = this.menuList.pauseConstMenu.type;
          break;
        case "setTargetTemp": //calculate targetTemp
          this.menuList.constMenu.data1 = this.menuList.constMenu.data1 + delta;
          this.displayLCD.show3digit(3, 1, this.menuList.constMenu.data1);
          break;
        case "setTargetSpeed": //calculate targetSpeed
          this.menuList.constMenu.data2 = parseFloat(this.menuList.constMenu.data2) + delta*0.1;
          this.menuList.constMenu.data2 = Number(this.menuList.constMenu.data2.toFixed(1));
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

    this.rotary.on("pressed", async () => {
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
              this.arrow = 1;
              this.currMenu = "setTargetTemp";
              this.displayLCD.setBlinkFlag(true);
              await this.displayLCD.blink3digit(
                3,
                1,
                this.menuList.constMenu.data1
              );
              this.menuList.workConstMenu.text5=this.menuList.constMenu.data1;
              this.writeData();
              this.currMenu = "constMenu";
              this.currMenuLength = this.menuList.constMenu.type;
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.removeListeners();
              this.parent.init();
              break;
            case 3: //>Spd=1C/s pressed
              this.arrow = 0;
              this.currMenu = "setTargetSpeed";
              this.displayLCD.setBlinkFlag(true);
              await this.displayLCD.blink3digit(
                12,
                1,
                this.menuList.constMenu.data2
              );
              this.menuList.workConstMenu.text6=this.menuList.constMenu.data2;
              this.writeData();
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              this.currMenuLength = this.menuList.constMenu.type;
              this.currMenu = "constMenu";
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
            case 1: //>Back pressed
              this.displayLCD.display(this.menuList.workConstMenu, this.arrow);
              this.hiddenData = false;
              this.currMenu = "workConstMenu";
              this.currMenuLength = this.menuList.workConstMenu.type;
              break;
          }
          break;
        default:
      };
    });
  }

  removeListeners() {
    this.rotary.removeAllListeners("pressed");
    this.rotary.removeAllListeners("rotate");
  }

  writeData() {
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

  heat() {
    this.currTime++;

    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];

    if (this.tempBoard < this.targetTemp) {
      this.targetTemp = Number(this.tempChip + this.speed - 0).toFixed(2);

      this.pidBottom.setTarget(
        this.targetTemp,
        this.PBottom,
        this.IBottom,
        this.DBottom
      );
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempBoard))
      );

      this.pwm.updateBottom(this.powerBottom * 0.01);
    }
  }

  async start(menuList) {
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
      this.heat();
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

  reset = () => {
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetTemp = null;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.rise = 0;
  };

  stop = () => {
    this.timerStopped = true;
    this.currTime = 0;
    this.reset();
  };
}
module.exports = ConstTemp;
