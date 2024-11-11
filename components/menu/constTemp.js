const Thermometer = require("../thermometer");
const PID = require("../pid.js");
const PWM = require("../pwm.js");
const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const ServerHttp = require("../server");

class ConstTemp extends BaseComponent {
  thermometer = new Thermometer();
  pwm = new PWM();
  encoder = new Encoder();
  serverHttp = new ServerHttp();

  constructor(parent) {
    super();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.targetTempBoard = this.menuList.constMenu.data2;
    this.targetSpeedBoard = this.menuList.constMenu.data4;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.timerStopped = true;
    this.hiddenData = false;

    this.PBottom = this.pidSet.pidBottom.k_p;
    this.IBottom = this.pidSet.pidBottom.k_i;
    this.DBottom = this.pidSet.pidBottom.k_d;

    this.PTop = this.pidSet.pidTop.k_p;
    this.ITop = this.pidSet.pidTop.k_i;
    this.DTop = this.pidSet.pidTop.k_d;
    this.parent = parent;

    this.period = 1000; //ms

    this.startTime = 0;
    this.duration = 0;
    this.stage = "constTemp";
  }

  async init(ioConnection) {
    this.io = ioConnection;
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
            Number(this.menuList.constMenu.data2 + delta)
          );
          if (rawNumberBottom >= 300) {
            this.menuList.constMenu.data2 = 300;
          } else if (rawNumberBottom < 0) {
            this.menuList.constMenu.data2 = 0;
          } else this.menuList.constMenu.data2 = rawNumberBottom;

          this.displayLCD.show3digit(4, 1, this.menuList.constMenu.data2);
          break;
        case "setTargetSpeed": //calculate targetSpeed
          this.menuList.constMenu.data4 =
            parseFloat(this.menuList.constMenu.data4) + delta * 0.1;
          this.menuList.constMenu.data4 = Number(
            this.menuList.constMenu.data4.toFixed(1)
          );
          this.displayLCD.show3digit(12, 1, this.menuList.constMenu.data4);
          break;
        default:
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 1) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 1;
          }

          this.displayLCD.moveArrow(this.menuList.constMenu,this.arrow);
          break;
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
              this.parent.init(2);
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
            case 3: //>Spd=1C/s pressed
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
    await this.displayLCD.blink3digit(4, 1, this.menuList.constMenu.data2);
    this.targetTempBoard = this.menuList.constMenu.data2;
    this.menuList.workConstMenu.text5 = this.menuList.constMenu.data2;
    this.menuList.pauseConstMenu.data2 = this.menuList.constMenu.data2;
    this.#writeData();
  }

  async #setTargetSpeed() {
    this.arrow = 3;
    this.currMenu = "setTargetSpeed";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(12, 1, this.menuList.constMenu.data4);
    this.targetSpeedBoard = this.menuList.constMenu.data4;
    this.menuList.workConstMenu.text6 = this.menuList.constMenu.data4;
    this.menuList.pauseConstMenu.data4 = this.menuList.constMenu.data4;
    this.#writeData();
  }

  #heat() {
    try {
    let allTemp = this.thermometer.measure();
    this.tempChip = allTemp[0];
    this.tempBoard = allTemp[1];
    if (this.startTime === 0) {
      this.startTime = Date.now();
    } //ms
    this.currTime = Date.now(); //ms
    this.duration = Number(
      ((this.currTime - this.startTime) / 1000).toFixed(2)
    ); //s

    if (this.tempBoard < this.menuList.constMenu.data2) {
      this.led.greenLed(true);
      this.targetTempBoard = Number(
        this.tempBoard + this.targetSpeedBoard * (this.period / 1000)
      ).toFixed(2);

      this.pidBottom.setTarget(
        this.targetTempBoard,
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
      this.powerBottom = Math.round(
        Number(this.pidBottom.update(this.tempBoard))
      ); //calculate power from PID

      this.pwm.update(this.powerTop, this.powerBottom); //send calculated power to output
    }

    this.prevTime = this.currTime;
  } catch (err) {
    this.stop();
    console.log(err);
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

    this.pidBottom = new PID({
      k_p: this.PBottom,
      k_i: this.IBottom,
      k_d: this.DBottom,
      dt: 1,
    });

    this.timerStopped = false;
    this.hiddenData = false;
    this.targetTempBoard = menuList.constMenu.data2;
    this.displayLCD.display(menuList.workConstMenu);

    while (!this.timerStopped) {
      this.#heat();
      if (!this.hiddenData) {
        let data = {
          tempChip: this.tempChip,
          tempBoard: this.tempBoard,
          powerTop: this.powerTop,
          powerBottom: this.powerBottom,
          stage: this.stage,
          duration: this.duration
        };
        this.displayLCD.displayProfilData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom,
          this.menuList.constMenu.data2,
          this.menuList.constMenu.data4
        );
        this.serverHttp.send(this.io, data);
      }
      await this.sleep(this.period);
    }

    // while (!this.timerStopped) {
    //   this.#heat();
    //   if (!this.hiddenData) {
    //     this.displayLCD.displayProfilData(
    //       this.tempChip,
    //       this.tempBoard,
    //       this.powerTop,
    //       this.powerBottom
    //     );
    //   }
    //   await this.sleep(this.period);
    // }
  }

  reset() {
    this.tempChip = 25;
    this.targetTempBoard = 25;

    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
  }

  stop() {
    this.led.greenLed(false);
    this.led.redLed(false);
    this.timerStopped = true;
    this.currTime = 0;
    this.pwm.stop();
    this.reset();
  }
}
module.exports = ConstTemp;
