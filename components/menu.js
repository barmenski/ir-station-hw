const ThermShow = require("./therm-show");
const PbMinus = require("./pbMinus");
const ConstTemp = require("./constTemp");
const DisplayLCD = require("./displayLCD");

const Rotary = require("raspberrypi-rotary-encoder");

class Menu {
  rotary = new Rotary(13, 14, 12); //(pinClk, pinDt, pinSwitch);
  thermShow = new ThermShow();
  pbMinus = new PbMinus();
  constTemp = new ConstTemp();
  displayLCD = new DisplayLCD();

  //name of profile: max 6 symbols
  menuList = {
    startMenu: { name: "startMenu", type: "1", text1: "Hello!" },
    mainMenu: {
      name: "mainMenu",
      type: "5",
      text1: "Pb-",
      text2: "Pb+",
      text3: "Const",
      text4: "Dimmer",
      text5: "T",
    },
    pbMinusMenu: {
      name: "pbMinusMenu",
      type: "3",
      text1: "Start",
      text2: "Pr01",
      text3: "Back",
    },
    pbPlusMenu: {
      name: "pbPlusMenu",
      type: "3",
      text1: "Start",
      text2: "Pr01",
      text3: "Back",
    },
    workPbMinusMenu: {
      name: "workPbMinusMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "pt1",
      text6: "run",
    },
    stayPbMinusMenu: {
      name: "stayPbMinusMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "pt1",
      text6: "Zzz",
    },
    workPbPlusMenu: {
      name: "workPbPlusMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "pt1",
      text6: "run",
    },
    stayPbPlusMenu: {
      name: "stayPbPlusMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "pt1",
      text6: "Zzz",
    },
    pausePbMinusMenu: {
      name: "pausePbMinusMenu",
      type: "3",
      text1: "Pause",
      text2: "Stop",
      text3: "Back",
    },
    resumePbMinusMenu: {
      name: "resumePbMinusMenu",
      type: "3",
      text1: "Resume",
      text2: "Stop",
      text3: "Back",
    },
    pausePbPlusMenu: {
      name: "pausePbPlusMenu",
      type: "3",
      text1: "Pause",
      text2: "Stop",
      text3: "Back",
    },
    resumePbPlusMenu: {
      name: "resumePbPlusMenu",
      type: "3",
      text1: "Resume",
      text2: "Stop",
      text3: "Back",
    },
    constMenu: {
      name: "constMenu",
      type: "4",
      text1: "Start",
      text2: "t=",
      data1: this.ConstTargetTemp,
      text3: "Back",
      text4: "Spd=",
      data2: "1",
    },
    setTargetTemp: {
      name: "constMenu",
      type: "4",
      text1: "Start",
      text2: "t=",
      data1: this.ConstTargetTemp,
      text3: "Back",
      text4: "Spd=",
      data2: "1",
    },
    dimmerMenu: {
      name: "dimmerMenu",
      type: "4",
      text1: "Start",
      text2: "P=",
      data1: "000",
      text3: "Back",
      text4: "Dur=",
      data2: "000",
    },
    workConstMenu: {
      name: "workConstMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "200",
      text6: "1",
    },
    workDimmerMenu: {
      name: "workDimmerMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "120",
      text6: "*D",
    },
    stayDimmerMenu: {
      name: "stayDimmerMenu",
      type: "6",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "P=",
      data3: "000",
      text4: "P=",
      data4: "000",
      text5: "120",
      text6: "Zzz",
    },
    pauseConstMenu: {
      name: "pauseConstMenu",
      type: "2",
      text1: "Stop",
      text2: "Back",
    },
    pauseDimmerMenu: {
      name: "pauseDimmerMenu",
      type: "3",
      text1: "Pause",
      text2: "Stop",
      text3: "Back",
    },
    resumeDimmerMenu: {
      name: "resumeDimmerMenu",
      type: "3",
      text1: "Resume",
      text2: "Stop",
      text3: "Back",
    },
    thermMenu: {
      name: "thermMenu",
      type: "term",
      text1: "t=",
      data1: "000",
      text2: "t=",
      data2: "000",
      text3: "C",
      text4: "C",
    },
  };

  constructor() {
    this.currMenu = "";
    this.arrow = 0;
  }

  init = () => {
    this.ConstTargetTemp = this.constTemp.getTargetTemp();
    this.displayLCD.display(this.menuList.startMenu, this.arrow);
    this.currMenu = "startMenu";

    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "startMenu":
          this.arrow = 0;
          this.displayLCD.display(this.menuList.mainMenu, this.arrow);
          this.currMenu = "mainMenu";
          break;
        case "workPbMinusMenu": //display pause menu
          this.pbMinus.pause();
          //start constant temp mode
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pausePbMinusMenu, this.arrow);
          this.currMenu = "pausePbMinusMenu";
          break;
        case "workPbPlusMenu": //display pause menu
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pausePbPlusMenu, this.arrow);
          this.currMenu = "pausePbPlusMenu";
          break;
        case "workConstMenu": //display pause menu
          this.constTemp.displayData(false);
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
          this.currMenu = "pauseConstMenu";
          break;
        case "setTargetTemp": //display setTargetTemp
          this.ConstTargetTemp = this.ConstTargetTemp + delta;
          this.constTemp.setTargetTemp(this.ConstTargetTemp);
          this.displayLCD.setTargetTemp(this.ConstTargetTemp);
          this.displayLCD.show3digit(3, 1);
          break;
        case "workDimmerMenu": //display pause menu
          this.arrow = 0;
          this.displayLCD.display(this.menuList.pauseDimmerMenu, this.arrow);
          this.currMenu = "pauseDimmerMenu";
          break;
        case "stayPbMinusMenu": //display resume menu
          this.arrow = 0;
          this.displayLCD.display(this.menuList.resumePbMinusMenu, this.arrow);
          this.currMenu = "resumePbMinusMenu";
          break;
        case "stayPbPlusMenu": //display resume menu
          this.displayLCD.display(this.menuList.resumePbPlusMenu);
          this.currMenu = "resumePbPlusMenu";
          this.arrow = 0;
          break;
        case "stayDimmerMenu":
          this.arrow = 0;
          this.displayLCD.display(this.menuList.resumeDimmerMenu, this.arrow);
          this.currMenu = "resumeDimmerMenu";
          break;
        case "thermMenu":
          this.thermShow.stop();
          break;
        default:
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenu.length - 2) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenu.length - 2;
          }

          this.displayLCD.moveArrow(this.arrow);
      }
    });

    this.rotary.on("pressed", async () => {
      switch (this.currMenu) {
        case "startMenu":
          this.arrow = 0;
          this.displayLCD.display(this.menuList.mainMenu, this.arrow);
          this.currMenu = "mainMenu";
          break;
        case "mainMenu":
          switch (this.arrow) {
            case 0: //>Pb- pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pbMinusMenu, this.arrow);
              this.currMenu = "pbMinusMenu";
              break;
            case 1: //>Pb+ pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pbPlusMenu, this.arrow);
              this.currMenu = "pbPlusMenu";
              break;
            case 2: //>Const pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              this.currMenu = "constMenu";
              break;
            case 3: //>Dimmer pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.dimmerMenu, this.arrow);
              this.currMenu = "dimmerMenu";
              break;
            case 4: //>T pressed
              this.arrow = 0;
              this.currMenu = "thermMenu";
              await this.thermShow.start(this.menuList.thermMenu, this.arrow); //waiting for measuring process
              this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.therm.stop();
              this.currMenu = "mainMenu";
              break;
          }
          break;
        case "pbMinusMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              //this.displayLCD.display(workPbMinusMenu);
              this.arrow = 0;
              this.currMenu = "workPbMinusMenu";
              await this.pbMinus.start(
                this.menuList.workPbMinusMenu,
                this.arrow
              );
              this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.pbMinus.stop();
              this.currMenu = "mainMenu";
              break;
            case 1: //>Profile01 pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
          }
          break;
        case "pbPlusMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
              this.currMenu = "workPbPlusMenu";
              break;
            case 1: //>Profile01 pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
          }
          break;
        case "constMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.arrow = 0;
              this.currMenu = "workConstMenu";
              await this.constTemp.start(this.menuList.workConstMenu, this.arrow);
              this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.constTemp.stop();
              this.currMenu = "mainMenu";
              break;
            case 1: //>t=200 pressed
              this.arrow = 1;
              this.currMenu = "setTargetTemp";
              this.displayLCD.setBlinkFlag(true);
              await this.displayLCD.blink3digit(3, 1);
              //this.arrow = 1; arrow position need add to .display(constMenu, 1)
              this.currMenu = "constMenu";
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 3: //>Spd=1C/s pressed
              this.arrow = 0;
              this.currMenu = "setSpeed";
              this.constTemp.setSpeed("begin");
              this.displayLCD.display(this.menuList.constMenu, this.arrow);
              this.currMenu = "constMenu";
              //this.arrow = 3;
              break;
          }
          break;
        case "setTargetTemp":
          this.displayLCD.setBlinkFlag(false);
          break;
        case "dimmerMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
              this.currMenu = "workDimmerMenu";
              break;
            case 1: //>P=000% pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 3: //>Dur=120 pressed
              //temporary block
              break;
          }
          break;
        case "pausePbMinusMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(
                this.menuList.stayPbMinusMenu,
                this.arrow
              );
              this.currMenu = "stayPbMinusMenu";
              break;
            case 1: //>Stop pressed
              this.pbMinus.stop();
              break;
            case 2: //>Back pressed
              this.displayLCD.display(
                this.menuList.workPbMinusMenu,
                this.arrow
              );
              this.currMenu = "workPbMinusMenu";
              break;
          }
          break;
        case "pausePbPlusMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(this.menuList.stayPbPlusMenu, this.arrow);
              this.currMenu = "stayPbPlusMenu";
              break;
            case 1: //>Stop pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
              this.currMenu = "workPbPlusMenu";
              break;
          }
          break;
        case "pauseConstMenu":
          switch (this.arrow) {
            case 0: //>Stop pressed
              this.constTemp.stop();
              break;
            case 1: //>Back pressed
              this.displayLCD.display(this.menuList.workConstMenu, this.arrow);
              this.constTemp.displayData(true);
              this.currMenu = "workConstMenu";
              break;
          }
          break;
        case "pauseDimmerMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(this.menuList.stayDimmerMenu, this.arrow);
              this.currMenu = "stayDimmerMenu";
              break;
            case 1: //>Stop pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";

              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
              this.currMenu = "workDimmerMenu";
              break;
          }
          break;
        case "resumePbMinusMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(
                this.menuList.workPbMinusMenu,
                this.arrow
              );
              this.currMenu = "workPbMinusMenu";
              break;
            case 1: //>Stop pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 2: //>Back pressed
              this.displayLCD.display(
                this.menuList.stayPbMinusMenu,
                this.arrow
              );
              this.currMenu = "stayPbMinusMenu";
              break;
          }
          break;
        case "resumePbPlusMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
              this.currMenu = "workPbMinusMenu";
              break;
            case 1: //>Stop pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.stayPbPlusMenu, this.arrow);
              this.currMenu = "stayPbPlusMenu";
              break;
          }
          break;

        case "resumeDimmerMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
              this.currMenu = "workDimmerMenu";
              break;
            case 1: //>Stop pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow);
              this.currMenu = "mainMenu";
              break;
            case 2: //>Back pressed
              this.displayLCD.display(this.menuList.stayDimmerMenu, this.arrow);
              this.currMenu = "stayDimmerMenu";
              break;
          }
          break;
        default:
          break;
      }
      console.log(
        "Rotary switch pressed. this.currMenu: " +
          this.currMenu +
          " .this: " +
          this.toString()
      );
    });
  };
}

module.exports = Menu;
