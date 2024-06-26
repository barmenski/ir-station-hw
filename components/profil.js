const Thermometer = require("./thermometer");
const DisplayLCD = require("./displayLCD");
const PID = require("./pid.js");
const PWM = require("./pwm.js");
const BaseComponent = require("./baseComponent");
const Encoder = require("./encoder");

class Profil extends BaseComponent {
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
    this.hiddenData = false;

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

  async init() {
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
              await this.start(this.menuList, this.arrow);
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
              this.parent.init();
              break;
            default:
          }
          break;
        case "pauseProfileMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.arrow = 0;
              this.currMenu = "stayProfileMenu";
              this.currMenuLength = this.menuList.stayProfileMenu.type;
              this.displayLCD.display(
                this.menuList.stayProfileMenu,
                this.arrow
              );
              this.pause();
              break;
            case 1: //>Stop pressed
              this.stop();
              break;
            case 2: //>Back pressed
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
    this.selectProfile.temp1=this.menuList.editProfileMenu.data1;
    this.selectProfile.time1=this.menuList.editProfileMenu.data2;
    this.selectProfile.temp2=this.menuList.editProfileMenu.data3;
    this.selectProfile.time2=this.menuList.editProfileMenu.data4;
    this.selectProfile.temp3=this.menuList.editProfileMenu.data5;
    this.selectProfile.time3=this.menuList.editProfileMenu.data6;
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
        this.displayLCD.displayProfilData(
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
module.exports = Profil;
