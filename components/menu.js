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

  constructor() {
    this.currMenu = [""];
    this.arrow = 0;
  }

  init = () => {
    let startMenu = ["startMenu", "Hello!"];
    let mainMenu = ["mainMenu", "Pb-", "Pb+", "Const", "Dimmer", "T"];
    let pbMinusMenu = ["pbMinusMenu", "Start", "Pr01", "Back"]; //name of profile: max 6 symbols
    let pbPlusMenu = ["pbPlusMenu", "Start", "Pr01", "Back"]; //name of profile: max 6 symbols
    let workPbMinusMenu = [
      "workPbMinusMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "pt1",
      "run",
    ];
    let stayPbMinusMenu = [
      "stayPbMinusMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "pt1",
      "Zzz",
    ];
    let workPbPlusMenu = [
      "workPbPlusMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "pt1",
      "run",
    ];
    let stayPbPlusMenu = [
      "stayPbPlusMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "pt1",
      "Zzz",
    ];
    let pausePbMinusMenu = ["pausePbMinusMenu", "Pause", "Stop", "Back"];
    let resumePbMinusMenu = ["resumePbMinusMenu", "Resume", "Stop", "Back"];
    let pausePbPlusMenu = ["pausePbPlusMenu", "Pause", "Stop", "Back"];
    let resumePbPlusMenu = ["resumePbPlusMenu", "Resume", "Stop", "Back"];
    let constMenu = ["constMenu", "Start", "t=200", "Back", "Spd=1C/s"];
    let setTargetTemp = ["setTargetTemp", "Start", "t=200", "Back", "Spd=1C/s"];
    let setSpeed = ["setTargetTemp", "Start", "t=200", "Back", "Spd=1C/s"];
    let dimmerMenu = ["dimmerMenu", "Start", "P=000%", "Back", "Dur=120"];
    let workConstMenu = [
      "workConstMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "200",
      "1",
    ];
    let workDimmerMenu = [
      "workDimmerMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "120",
      "*D",
    ];

    let stayDimmerMenu = [
      "stayDimmerMenu",
      "t=000",
      "t=000",
      "P=000%",
      "P=000%",
      "200",
      "Zzz",
    ];
    let pauseConstMenu = ["pauseConstMenu", "Stop", "Back"];

    let pauseDimmerMenu = ["pauseDimmerMenu", "Pause", "Stop", "Back"];
    let resumeDimmerMenu = ["resumeDimmerMenu", "Resume", "Stop", "Back"];
    let thermMenu = ["thermMenu", "t=000", "t=000", "C", "C"];

    this.ConstTargetTemp = this.constTemp.targetTemp;

    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu[0]) {
        case "":
          this.displayLCD.display(startMenu);
          this.currMenu = startMenu;
          break;
        case "startMenu":
          this.displayLCD.display(mainMenu);
          this.currMenu = mainMenu;
          this.arrow = 0;
          break;
        case "workPbMinusMenu": //display pause menu
          this.pbMinus.pause();
          //start constant temp mode
          this.displayLCD.display(pausePbMinusMenu);
          this.currMenu = pausePbMinusMenu;
          this.arrow = 0;
          break;
        case "workPbPlusMenu": //display pause menu ["pauseConstMenu", "Pause", "Stop", "Back"];
          this.displayLCD.display(pausePbPlusMenu);
          this.currMenu = pausePbPlusMenu;
          this.arrow = 0;
          break;
        case "workConstMenu": //display pause menu
          this.constTemp.displayData(false);
          this.displayLCD.display(pauseConstMenu);
          this.currMenu = pauseConstMenu;
          this.arrow = 0;
          break;
        case "setTargetTemp": //display setTargetTemp
          this.ConstTargetTemp = this.ConstTargetTemp + delta;
          this.constTemp.setTargetTemp(this.ConstTargetTemp);
          break;
        case "workDimmerMenu": //display pause menu
          this.displayLCD.display(pauseDimmerMenu);
          this.currMenu = pauseDimmerMenu;
          this.arrow = 0;
          break;
        case "stayPbMinusMenu": //display resume menu
          this.displayLCD.display(resumePbMinusMenu);
          this.currMenu = resumePbMinusMenu;
          this.arrow = 0;
          break;
        case "stayPbPlusMenu": //display resume menu
          this.displayLCD.display(resumePbPlusMenu);
          this.currMenu = resumePbPlusMenu;
          this.arrow = 0;
          break;
        case "stayDimmerMenu":
          this.displayLCD.display(resumeDimmerMenu);
          this.currMenu = resumeDimmerMenu;
          this.arrow = 0;
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
      switch (this.currMenu[0]) {
        case "":
          this.displayLCD.display(startMenu);
          this.currMenu = startMenu;
          this.arrow = 0;
          break;
        case "startMenu":
          this.displayLCD.display(mainMenu);
          this.currMenu = mainMenu;
          this.arrow = 0;
          break;
        case "mainMenu":
          switch (this.arrow) {
            case 0: //>Pb- pressed
              this.displayLCD.display(pbMinusMenu);
              this.currMenu = pbMinusMenu;
              this.arrow = 0;
              break;
            case 1: //>Pb+ pressed
              this.displayLCD.display(pbPlusMenu);
              this.currMenu = pbPlusMenu;
              this.arrow = 0;
              break;
            case 2: //>Const pressed
              this.displayLCD.display(constMenu);
              this.currMenu = constMenu;
              this.arrow = 0;
              break;
            case 3: //>Dimmer pressed
              this.displayLCD.display(dimmerMenu);
              this.currMenu = dimmerMenu;
              this.arrow = 0;
              break;
            case 4: //>T pressed
              this.currMenu = thermMenu;
              await this.thermShow.start(thermMenu); //waiting for measuring process
              this.displayLCD.display(mainMenu); //display mainMenu after this.therm.stop();
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
          }
          break;
        case "pbMinusMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              //this.displayLCD.display(workPbMinusMenu);
              this.currMenu = workPbMinusMenu;
              await this.pbMinus.start(workPbMinusMenu);
              this.displayLCD.display(mainMenu); //display mainMenu after this.pbMinus.stop();
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 1: //>Profile01 pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
          }
          break;
        case "pbPlusMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.displayLCD.display(workPbPlusMenu);
              this.currMenu = workPbPlusMenu;
              this.arrow = 0;
              break;
            case 1: //>Profile01 pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
          }
          break;
        case "constMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.currMenu = workConstMenu;
              await this.constTemp.start(workConstMenu);
              this.displayLCD.display(mainMenu); //display mainMenu after this.constTemp.stop();
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 1: //>t=200 pressed
              this.currMenu = setTargetTemp;
              this.displayLCD.setBlinkFlag(true);
              await this.displayLCD.blink3digit(3, 1);
              this.displayLCD.display(constMenu);
              this.arrow = 1;
              this.currMenu = constMenu;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 3: //>Spd=1C/s pressed
              this.currMenu = setSpeed;
              this.constTemp.setSpeed("begin");
              this.displayLCD.display(constMenu);
              this.currMenu = constMenu;
              this.arrow = 3;
              break;
          }
          break;
        case "setTargetTemp":
          switch(this.arrow) {
            case 1: 
              this.displayLCD.setBlinkFlag(false);
          }
        case "dimmerMenu":
          switch (this.arrow) {
            case 0: //>Start pressed
              this.displayLCD.display(workDimmerMenu);
              this.currMenu = workDimmerMenu;
              break;
            case 1: //>P=000% pressed
              //temporary block
              break;
            case 2: //>Back pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 3: //>Dur=120 pressed
              //temporary block
              break;
          }
          break;
        case "pausePbMinusMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(stayPbMinusMenu);
              this.currMenu = stayPbMinusMenu;
              break;
            case 1: //>Stop pressed
              this.pbMinus.stop();
              break;
            case 2: //>Back pressed
              this.displayLCD.display(workPbMinusMenu);
              this.currMenu = workPbMinusMenu;
              break;
          }
          break;
        case "pausePbPlusMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(stayPbPlusMenu);
              this.currMenu = stayPbPlusMenu;
              break;
            case 1: //>Stop pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(workPbPlusMenu);
              this.currMenu = workPbPlusMenu;
              break;
          }
          break;
        case "pauseConstMenu":
          switch (this.arrow) {
            case 0: //>Stop pressed
              this.constTemp.stop();
              break;
            case 1: //>Back pressed
              this.displayLCD.display(workConstMenu);
              this.constTemp.displayData(true);
              this.currMenu = workConstMenu;
              break;
          }
          break;
        case "pauseDimmerMenu":
          switch (this.arrow) {
            case 0: //>Pause pressed
              this.displayLCD.display(stayDimmerMenu);
              this.currMenu = stayDimmerMenu;
              break;
            case 1: //>Stop pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(workDimmerMenu);
              this.currMenu = workDimmerMenu;
              break;
          }
          break;
        case "resumePbMinusMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(workPbMinusMenu);
              this.currMenu = workPbMinusMenu;
              break;
            case 1: //>Stop pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(stayPbMinusMenu);
              this.currMenu = stayPbMinusMenu;
              break;
          }
          break;
        case "resumePbPlusMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(workPbPlusMenu);
              this.currMenu = workPbMinusMenu;
              break;
            case 1: //>Stop pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(stayPbPlusMenu);
              this.currMenu = stayPbPlusMenu;
              break;
          }
          break;

        case "resumeDimmerMenu":
          switch (this.arrow) {
            case 0: //>Resume pressed
              this.displayLCD.display(workDimmerMenu);
              this.currMenu = workDimmerMenu;
              break;
            case 1: //>Stop pressed
              this.displayLCD.display(mainMenu);
              this.currMenu = mainMenu;
              this.arrow = 0;
              break;
            case 2: //>Back pressed
              this.displayLCD.display(stayDimmerMenu);
              this.currMenu = stayDimmerMenu;
              break;
          }
          break;
        default:
          break;
      }
      console.log(
        "Rotary switch pressed. this.currMenu[0]: " +
          this.currMenu[0] +
          " .this: " +
          this.toString()
      );
    });
  };
}

module.exports = Menu;
