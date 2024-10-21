const Thermometer = require("../thermometer");
const DisplayLCD = require("../displayLCD");
const PID = require("../pid.js");
const PWM = require("../pwm.js");
const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const Led = require("../led");
const ServerHttp = require("../server");

class Profil extends BaseComponent {
  displayLCD = new DisplayLCD();
  thermometer = new Thermometer();
  serverHttp = new ServerHttp();
  pwm = new PWM();
  encoder = new Encoder();
  led = new Led();

  constructor(parent) {
    super();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.powerTopMax = 350;
    this.powerBottomMax = 3420;
    this.prevTempChip = 0;
    this.prevTempBoard = 0;
    this.tempChip = 25;
    this.targetTemp = 25;
    this.targetSpeed1 = 1;
    this.targetSpeed2 = 1;
    this.targetSpeed3 = 1;
    this.stage = 0;
    this.measuredSpeedTop = 0;
    this.tempBoard = 25;
    this.pidBottom = null;
    this.pidTop = null;
    this.startTime = 0;
    this.startTimeHeat = 0;
    this.prevTime = 0;
    this.currTime = 0;
    this.duration = 0;
    this.durationHeat = 0;
    this.targetSpeed = 0;
    this.timerStopped = true;
    this.hiddenData = false;
    this.io = null;

    this.preHeatTime = 0;
    this.preHeatTemp = 0;
    this.liquidTime = 0;
    this.liquidTemp = 0;
    this.peakTime = 0;
    this.peakTemp = 0;

    this.PBottom = this.pidSet.pidBottom.k_p;
    this.IBottom = this.pidSet.pidBottom.k_i;
    this.DBottom = this.pidSet.pidBottom.k_d;

    this.PTop = this.pidSet.pidTop.k_p;
    this.ITop = this.pidSet.pidTop.k_i;
    this.DTop = this.pidSet.pidTop.k_d;
    this.parent = parent;

    this.period = 1000; //ms

    this.peakAchiv = false;

    this.currProfile = {
      name: "pr-001",
      status: "current",
      temp1: 160,
      time1: 120,
      temp2: 219,
      time2: 210,
      temp3: 250,
      time3: 240,
    };

    this.selectProfile = {};

    this.namesProfile = [];
  }

  async init(ioConnection) {
    this.io = ioConnection;
    this.arrow = 0;
    this.displayLCD.display(this.menuList.profileMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();

    this.#pullData();
    this.currMenu = "profileMenu";
    this.currMenuLength = this.menuList.profileMenu.type;

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "workProfileMenu": //display pause menu (PAUSE STOP BACK)
          this.hiddenData = true;
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseProfileMenu, this.arrow);
          this.currMenu = "pauseProfileMenu";
          this.currMenuLength = this.menuList.pauseProfileMenu.type;
          break;
        case "setProfileData": //calculate setProfileData
          switch (this.arrow) {
            case 0:
              this.menuList.editProfileMenu.data1 =
                this.menuList.editProfileMenu.data1 + delta;
              this.displayLCD.show3digit(
                2,
                0,
                this.menuList.editProfileMenu.data1
              );
              break;
            case 1:
              this.menuList.editProfileMenu.data2 =
                this.menuList.editProfileMenu.data2 + delta;
              this.displayLCD.show3digit(
                2,
                1,
                this.menuList.editProfileMenu.data2
              );
              break;
            case 2:
              this.menuList.editProfileMenu.data3 =
                this.menuList.editProfileMenu.data3 + delta;
              this.displayLCD.show3digit(
                7,
                0,
                this.menuList.editProfileMenu.data3
              );
              break;
            case 3:
              this.menuList.editProfileMenu.data4 =
                this.menuList.editProfileMenu.data4 + delta;
              this.displayLCD.show3digit(
                7,
                1,
                this.menuList.editProfileMenu.data4
              );
              break;
            case 4:
              this.menuList.editProfileMenu.data5 =
                this.menuList.editProfileMenu.data5 + delta;
              this.displayLCD.show3digit(
                12,
                0,
                this.menuList.editProfileMenu.data5
              );
              break;
            case 5:
              this.menuList.editProfileMenu.data6 =
                this.menuList.editProfileMenu.data6 + delta;
              this.displayLCD.show3digit(
                12,
                1,
                this.menuList.editProfileMenu.data6
              );
              break;
            default:
          }
          break;

        case "editProfileMenu": //for not standart menu
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 1) {
            this.arrow = 0; //rotate over number of menu → return to profileMenu
            this.currMenu = "profileMenu";
            this.currMenuLength = this.menuList.profileMenu.type;
            this.displayLCD.display(this.menuList.profileMenu, 0);
          } else if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 1; //rotate over number of menu → return to profileMenu
            this.currMenu = "profileMenu";
            this.displayLCD.display(this.menuList.profileMenu, 0);
            this.currMenuLength = this.menuList.profileMenu.type;
          } else this.displayLCD.editProfileMoveArrow(this.arrow);
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
        case "profileMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.arrow = 0;
              this.currMenu = "workProfileMenu";
              this.#pullData();
              await this.start(this.menuList);
              this.arrow = 2;
              this.displayLCD.display(this.menuList.profileMenu, this.arrow); //display profileMenu after this.constTemp.stop();
              this.currMenu = "profileMenu";
              this.currMenuLength = this.menuList.profileMenu.type;
              break;
            case 1: //>Pr-001 pressed
              this.arrow = 0;
              this.currMenu = "profilesMenu";
              this.currMenuLength = this.menuList.profilesMenu.type;
              this.displayLCD.display(this.menuList.profilesMenu, this.arrow);
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init(0);
              break;
            default:
          }
          break;
        case "pauseProfileMenu":
          switch (this.arrow) {
            case 0: //>Stop pressed
              this.stop();
              break;
            case 1: //>Back pressed
              this.displayLCD.display(
                this.menuList.workProfileMenu,
                this.arrow
              );
              this.hiddenData = false;
              this.currMenu = "workProfileMenu";
              this.currMenuLength = this.menuList.workProfileMenu.type;
              break;
            default:
          }
          break;
        case "profilesMenu":
          switch (this.arrow) {
            case 0: //1th profile
              this.arrow = 0;
              this.currMenu = "applyProfileMenu";
              this.currMenuLength = this.menuList.applyProfileMenu.type;
              this.selectProfile = this.profilesList.find(
                (item) => item.name === this.namesProfile[0]
              );
              this.displayLCD.display(
                this.menuList.applyProfileMenu,
                this.arrow
              );

              break;
            case 1: //2th profile
              this.arrow = 0;
              this.currMenu = "applyProfileMenu";
              this.currMenuLength = this.menuList.applyProfileMenu.type;
              this.selectProfile = this.profilesList.find(
                (item) => item.name === this.namesProfile[1]
              );
              this.displayLCD.display(
                this.menuList.applyProfileMenu,
                this.arrow
              );
              break;
            case 2: //3th profile
              this.arrow = 0;
              this.currMenu = "applyProfileMenu";
              this.currMenuLength = this.menuList.applyProfileMenu.type;
              this.selectProfile = this.profilesList.find(
                (item) => item.name === this.namesProfile[2]
              );
              this.displayLCD.display(
                this.menuList.applyProfileMenu,
                this.arrow
              );
              break;
            case 3: //4th profile
              this.arrow = 0;
              this.currMenu = "applyProfileMenu";
              this.currMenuLength = this.menuList.applyProfileMenu.type;
              this.selectProfile = this.profilesList.find(
                (item) => item.name === this.namesProfile[3]
              );
              this.displayLCD.display(
                this.menuList.applyProfileMenu,
                this.arrow
              );
              break;
            default:
          }
          break;
        case "applyProfileMenu":
          switch (this.arrow) {
            case 0: //Apply pressed
              this.arrow = 0;
              this.currProfile = this.selectProfile;
              let index = this.profilesList.findIndex(
                (item) => item.name === this.currProfile.name
              );
              this.profilesList[index].status = "current";
              this.profilesList.forEach((item) => {
                if (item.name != this.currProfile.name) {
                  item.status = "rezerv";
                }
              });
              this.#pullData();
              this.currMenu = "profileMenu";
              this.currMenuLength = this.menuList.profileMenu.type;
              this.displayLCD.display(this.menuList.profileMenu, this.arrow);
              break;
            case 1: //Edit pressed
              this.arrow = 0;
              this.#pullData();
              this.currMenu = "editProfileMenu";
              this.currMenuLength = this.menuList.editProfileMenu.type;
              this.displayLCD.displayEditTitles(
                this.menuList.editProfileMenu,
                0
              );
              this.displayLCD.displayEditData(this.menuList.editProfileMenu, 0);
              break;
            case 2: //Back pressed
              this.arrow = 0;
              this.currMenu = "profileMenu";
              this.currMenuLength = this.menuList.profileMenu.type;
              this.displayLCD.display(this.menuList.profileMenu, this.arrow);
              break;
            default:
          }
          break;
        case "editProfileMenu":
          switch (this.arrow) {
            case 0:
              await this.#setProfileData(
                2,
                0,
                this.menuList.editProfileMenu.data1
              );
              break;
            case 1:
              await this.#setProfileData(
                2,
                1,
                this.menuList.editProfileMenu.data2
              );
              break;
            case 2:
              await this.#setProfileData(
                7,
                0,
                this.menuList.editProfileMenu.data3
              );
              break;
            case 3:
              await this.#setProfileData(
                7,
                1,
                this.menuList.editProfileMenu.data4
              );
              break;
            case 4:
              await this.#setProfileData(
                12,
                0,
                this.menuList.editProfileMenu.data5
              );
              break;
            case 5:
              await this.#setProfileData(
                12,
                1,
                this.menuList.editProfileMenu.data6
              );
              break;
            default:
          }
          break;
        case "setProfileData":
          this.displayLCD.setBlinkFlag(false);
          break;
        default:
      }
    });
  }

  #pullData() {
    this.currProfile = this.profilesList.find(
      (item) => item.status === "current"
    );
    this.menuList.profileMenu.text2 = this.currProfile.name;

    this.menuList.editProfileMenu.data1 = this.selectProfile.temp1;
    this.menuList.editProfileMenu.data2 = this.selectProfile.time1;
    this.menuList.editProfileMenu.data3 = this.selectProfile.temp2;
    this.menuList.editProfileMenu.data4 = this.selectProfile.time2;
    this.menuList.editProfileMenu.data5 = this.selectProfile.temp3;
    this.menuList.editProfileMenu.data6 = this.selectProfile.time3;

    this.namesProfile = this.profilesList.map((item) => item.name);

    this.menuList.profilesMenu.text1 = this.namesProfile[0];
    this.menuList.profilesMenu.text2 = this.namesProfile[1];
    this.menuList.profilesMenu.text3 = this.namesProfile[2];
    this.menuList.profilesMenu.text4 = this.namesProfile[3];
    this.#writeData();
  }

  #pushData() {
    this.selectProfile.temp1 = this.menuList.editProfileMenu.data1;
    this.selectProfile.time1 = this.menuList.editProfileMenu.data2;
    this.selectProfile.temp2 = this.menuList.editProfileMenu.data3;
    this.selectProfile.time2 = this.menuList.editProfileMenu.data4;
    this.selectProfile.temp3 = this.menuList.editProfileMenu.data5;
    this.selectProfile.time3 = this.menuList.editProfileMenu.data6;
    let index = this.profilesList.findIndex(
      (item) => item.name === this.selectProfile.name
    );
    this.profilesList[index] = this.selectProfile;
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
      this.path.join(__dirname, "/profilesList.json"),
      JSON.stringify(this.profilesList),
      (err) => {
        if (err) console.log(err);
        else {
          console.log("profilesList.json written successfully");
        }
      }
    );
  }

  async #setProfileData(col, row, data) {
    this.currMenu = "setProfileData";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(col, row, data);
    this.#pushData();
    this.#writeData();
    this.currMenu = "editProfileMenu";
    this.displayLCD.displayEditData(this.menuList.editProfileMenu, this.arrow);
  }

  #measureSpeed() {
    this.measuredSpeedTop = Number(
      ((this.tempChip - this.prevTempChip) / this.measuredTime).toFixed(2)
    );
    console.log(
      "\n CHIP \n"+
      "this.tempChip: " +
        this.tempChip +
        " || " +
        "this.prevTempChip: " +
        this.prevTempChip 
    );
    if (this.measuredSpeedTop <= 0) {
      this.measuredSpeedTop = 0.00001;
    }
    console.log("this.measuredSpeedTop: " + this.measuredSpeedTop + "\n--------------");

    this.measuredSpeedBottom = Number(
      ((this.tempBoard - this.prevTempBoard) / this.measuredTime).toFixed(2)
    );
    console.log(
      "\n BOARD \n"+
      "this.tempBoard: " +
        this.tempBoard +
        " || " +
        "this.prevTempBoard: " +
        this.prevTempBoard
    );
    if (this.measuredSpeedBottom <= 0) {
      this.measuredSpeedBottom = 0.00001;
    }
    console.log("this.measuredSpeedBottom: " + this.measuredSpeedBottom + "\n--------------");
  }

  #heat() {
    try {
      if (this.startTime === 0) {
        this.startTime = Date.now();
      } //ms

      let allTemp = this.thermometer.measure();
      this.tempChip = allTemp[0];
      this.tempBoard = allTemp[1];

      this.currTime = Date.now(); //ms

      if (this.prevTime===0){
        this.measuredTime = 1;
      } else {
        this.measuredTime = Number(
          ((this.currTime - this.prevTime) / 1000).toFixed(2)
        ); //s
      }

      this.duration = Number(
        ((this.currTime - this.startTime) / 1000).toFixed(2)
      ); //s
      this.durationHeat = Number(
        ((this.currTime - this.startTimeHeat) / 1000).toFixed(2)
      ); //s

      this.#measureSpeed();

      //BOTTOM HEATER

      if (this.tempBoard < this.preHeatTemp && this.peakAchiv === false) {
        //1 stage - prepare Heat (bottom heater ON; top heater ON)
        this.stage = 1;
        this.led.greenLed(true);
        let targetSpeedBottom1 = 1;

        this.targetTempBoard = Number(
          this.tempBoard + targetSpeedBottom1 * this.measuredTime
        ).toFixed(2);
        console.log("1 stage: targetTempBoard " + this.targetTempBoard);
        this.pidBottom.setTarget(
          this.targetTempBoard,
          this.PBottom,
          this.IBottom,
          this.DBottom
        ); //set target for PID (regulation by rising of temperature)
        this.powerBottom = Math.round(
          Number(this.pidBottom.update(this.tempBoard))
        ); //calculate power from PID
      } else if (
        this.tempBoard >= this.preHeatTemp &&
        this.tempBoard < this.liquidTemp &&
        this.peakAchiv === false &&
        this.stage!=3
      ) {
        //2  stage - waitting (bottom heater ON; top heater ON)
        if (this.startTimeHeat === 0) {
          this.startTimeHeat = Date.now();
        }; //ms
        this.stage = 2;

        let targetSpeedBottom2 = 0.8;
        this.targetTempBoard = Number(
          this.tempBoard + targetSpeedBottom2 * this.measuredTime
        ).toFixed(2);
        console.log("2 stage: targetTempBoard " + this.targetTempBoard);
        this.pidBottom.setTarget(
          this.targetTempBoard,
          this.PBottom,
          this.IBottom,
          this.DBottom
        );
        this.powerBottom = Math.round(
          Number(this.pidBottom.update(this.tempBoard))
        );
      } else if (
        this.tempBoard >= this.liquidTemp && this.peakAchiv === false
      ) {
        //3  stage - constant power for bottom heater and rise for maximum
        //                              (bottom heater ON; top heater ON)
        this.stage = 3;
        this.pidBottom.setTarget(
          this.liquidTemp,
          this.PBottom,
          this.IBottom,
          this.DBottom
        );
        
        this.powerBottom = Math.round(
          Number(this.pidBottom.update(this.tempBoard))
        );
        //this.powerBottom = 0;

        console.log("3 stage: this.liquidTemp " + this.liquidTemp);
      } else {
        this.stage = 4;
        this.led.greenLed(false);
        this.led.redLed(true);
        this.powerBottom = 0;
      }
      //TOP HEATER
      if (this.tempChip < this.preHeatTemp && this.peakAchiv === false) {
        //1 stage - prepare Heat (bottom heater ON; top heater OFF)

        this.pidTop.setTarget(
          this.targetTempBoard, //targetTempBoard !!!
          this.PTop,
          this.ITop,
          this.DTop
        );
        this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      } else if (
        this.tempChip >= this.preHeatTemp &&
        this.tempChip < this.liquidTemp &&
        this.peakAchiv === false
      ) {
        //2  stage - waitting (bottom heater ON; top heater ON)
        this.pidTop.setTarget(
          this.targetTempBoard, //targetTempBoard !!!
          this.PTop,
          this.ITop,
          this.DTop
        );
        this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      } else if (
        this.tempChip >= this.liquidTemp &&
        this.tempChip < this.peakTemp &&
        this.peakAchiv === false
      ) {
        //3  stage - constant power for bottom heater and rise for maximum
        //                              (bottom heater ON; top heater ON)
        let targetSpeedTop3 = 1.43;
        this.targetTempChip = Number(
          this.tempChip + targetSpeedTop3 * this.measuredTime
        ).toFixed(2);
        this.pidTop.setTarget(
          this.targetTempChip,
          this.PTop,
          this.ITop,
          this.DTop
        );
        this.powerTop = Math.round(Number(this.pidTop.update(this.tempChip)));
      } else if (this.tempChip >= this.peakTemp) {
        this.peakAchiv = true;
        this.powerTop = 0;
      } else {
        this.powerTop = 0;
      }

      this.prevTempChip = this.tempChip;
      this.prevTempBoard = this.tempBoard;
      this.prevTime = this.currTime;
      this.pwm.update(this.powerTop, this.powerBottom); //send calculated power to output
    } catch (err) {
      this.stop();
      console.log(err);
    }
  }

  async start(menuList) {
    this.pwm.init();

    this.preHeatTime = this.currProfile.time1;
    this.preHeatTemp = this.currProfile.temp1;
    this.liquidTime = this.currProfile.time2;
    this.liquidTemp = this.currProfile.temp2;
    this.peakTime = this.currProfile.time3;
    this.peakTemp = this.currProfile.temp3;

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
    this.hiddenData = false;
    this.displayLCD.display(menuList.workProfileMenu);

    while (!this.timerStopped) {
      this.#heat();
      if (!this.hiddenData) {
        let data = {
          tempChip: this.tempChip,
          tempBoard: this.tempBoard,
          powerTop: this.powerTop,
          powerBottom: this.powerBottom,
          stage: this.stage,
          duration: this.duration,
        };
        this.displayLCD.displayProfilData(
          this.tempChip,
          this.tempBoard,
          this.powerTop,
          this.powerBottom,
          this.stage,
          this.duration
        );
        this.serverHttp.send(this.io, data);
      }
      await this.sleep(this.period);
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
    this.targetSpeed = 0;
    this.stage = 0;
  }

  pause() {
    this.timerStopped = true;
  }

  stop() {
    this.timerStopped = true;
    this.reset();
    this.led.greenLed(false);
    this.led.redLed(false);
    this.currTime = 0;
    this.startTime = 0;
    this.duration = 0;
    this.pwm.stop();
    this.peakAchiv = false;
    console.log("Heating stopped.");
  }
}
module.exports = Profil;
