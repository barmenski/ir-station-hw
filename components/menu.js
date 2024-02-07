const ThermShow = require("./therm-show");
const PbMinus = require("./pbMinus");
const ConstTemp = require("./constTemp");
const DisplayLCD = require("./displayLCD");
const BaseComponent = require("./baseComponent");

// const fs = require("fs");
// var path = require("path");

class Menu extends BaseComponent{
  thermShow = new ThermShow();
  pbMinus = new PbMinus();
  constTemp = new ConstTemp();
  displayLCD = new DisplayLCD();

constructor() {
    super();
    this.currMenu = "";
    this.currMenuLength = 1;
    this.arrow = 0;
  }

  async init () {
    this.displayLCD.display(this.menuList.startMenu, this.arrow);
    this.currMenu = "startMenu";
    await this.sleep(2000);
    this.displayLCD.display(this.menuList.mainMenu, this.arrow);
    this.currMenu = "mainMenu";
    this.currMenuLength=this.menuList.mainMenu.type;

    // this.rotary.on("rotate", async (delta) => {
    //   switch (this.currMenu) {
    //     case "startMenu":
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.mainMenu, this.arrow);
    //       this.currMenu = "mainMenu";
    //       break;
    //     case "workPbMinusMenu": //display pause menu
    //       this.pbMinus.pause();
    //       //start constant temp mode
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.pausePbMinusMenu, this.arrow);
    //       this.currMenu = "pausePbMinusMenu";
    //       break;
    //     case "workPbPlusMenu": //display pause menu
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.pausePbPlusMenu, this.arrow);
    //       this.currMenu = "pausePbPlusMenu";
    //       break;
    //     case "workConstMenu": //display pause menu
    //       this.constTemp.displayData(false);
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.pauseConstMenu, this.arrow);
    //       this.currMenu = "pauseConstMenu";
    //       break;
    //     case "setTargetTemp": //display setTargetTemp
    //       this.menuList.constMenu.data1 = this.menuList.constMenu.data1 + delta;
    //       this.displayLCD.show3digit(3, 1, this.menuList.constMenu.data1);
    //       break;
    //     case "workDimmerMenu": //display pause menu
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.pauseDimmerMenu, this.arrow);
    //       this.currMenu = "pauseDimmerMenu";
    //       break;
    //     case "stayPbMinusMenu": //display resume menu
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.resumePbMinusMenu, this.arrow);
    //       this.currMenu = "resumePbMinusMenu";
    //       break;
    //     case "stayPbPlusMenu": //display resume menu
    //       this.displayLCD.display(this.menuList.resumePbPlusMenu);
    //       this.currMenu = "resumePbPlusMenu";
    //       this.arrow = 0;
    //       break;
    //     case "stayDimmerMenu":
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.resumeDimmerMenu, this.arrow);
    //       this.currMenu = "resumeDimmerMenu";
    //       break;
    //     case "thermMenu":
    //       this.thermShow.stop();
    //       break;
    //     default:
    //       this.arrow = this.arrow + delta;
    //       if (this.arrow > this.currMenu.length - 2) {
    //         this.arrow = 0;
    //       }
    //       if (this.arrow < 0) {
    //         this.arrow = this.currMenu.length - 2;
    //       }

    //       this.displayLCD.moveArrow(this.arrow);
    //   }
    // });
    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "mainMenu":
              this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 2) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 2;
          }

          this.displayLCD.moveArrow(this.arrow);
          break;
          default:
            console.log("this.currmenu (main.js): "+this.currMenu)+" "+this.arrow;
      }
    });

    this.rotary.on("pressed", async () => {
      switch (this.currMenu) {
        case "mainMenu":
          switch (this.arrow) {
            case 0: //>Pb- pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pbMinusMenu, this.arrow);
              this.currMenu = "pbMinusMenu";
              this.currMenuLength=this.menuList.pbMinusMenu.type;
              break;
            case 1: //>Pb+ pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pbPlusMenu, this.arrow);
              this.currMenu = "pbPlusMenu";
              this.currMenuLength=this.menuList.pbPlusMenu.type;
              break;
            case 2: //>Const pressed
              this.currMenu = "constMenu";
              await this.constTemp.init();
              this.currMenu = "mainMenu";
              break;
            case 3: //>Dimmer pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.dimmerMenu, this.arrow);
              this.currMenu = "dimmerMenu";
              this.currMenuLength=this.menuList.dimmerMenu.type;
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
      //   case "pbMinusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Start pressed
      //         this.arrow = 0;
      //         this.currMenu = "workPbMinusMenu";
      //         await this.pbMinus.start(
      //           this.menuList.workPbMinusMenu,
      //           this.arrow
      //         );
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.pbMinus.stop();
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 1: //>Profile01 pressed
      //         //temporary block
      //         break;
      //       case 2: //>Back pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //     }
      //     break;
      //   case "pbPlusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Start pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
      //         this.currMenu = "workPbPlusMenu";
      //         break;
      //       case 1: //>Profile01 pressed
      //         //temporary block
      //         break;
      //       case 2: //>Back pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //     }
      //     break;
      //   case "dimmerMenu":
      //     switch (this.arrow) {
      //       case 0: //>Start pressed
      //         this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
      //         this.currMenu = "workDimmerMenu";
      //         break;
      //       case 1: //>P=000% pressed
      //         //temporary block
      //         break;
      //       case 2: //>Back pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 3: //>Dur=120 pressed
      //         //temporary block
      //         break;
      //     }
      //     break;
      //   case "pausePbMinusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Pause pressed
      //         this.displayLCD.display(
      //           this.menuList.stayPbMinusMenu,
      //           this.arrow
      //         );
      //         this.currMenu = "stayPbMinusMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.pbMinus.stop();
      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(
      //           this.menuList.workPbMinusMenu,
      //           this.arrow
      //         );
      //         this.currMenu = "workPbMinusMenu";
      //         break;
      //     }
      //     break;
      //   case "pausePbPlusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Pause pressed
      //         this.displayLCD.display(this.menuList.stayPbPlusMenu, this.arrow);
      //         this.currMenu = "stayPbPlusMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
      //         this.currMenu = "workPbPlusMenu";
      //         break;
      //     }
      //     break;

      //   case "pauseDimmerMenu":
      //     switch (this.arrow) {
      //       case 0: //>Pause pressed
      //         this.displayLCD.display(this.menuList.stayDimmerMenu, this.arrow);
      //         this.currMenu = "stayDimmerMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";

      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
      //         this.currMenu = "workDimmerMenu";
      //         break;
      //     }
      //     break;
      //   case "resumePbMinusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Resume pressed
      //         this.displayLCD.display(
      //           this.menuList.workPbMinusMenu,
      //           this.arrow
      //         );
      //         this.currMenu = "workPbMinusMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(
      //           this.menuList.stayPbMinusMenu,
      //           this.arrow
      //         );
      //         this.currMenu = "stayPbMinusMenu";
      //         break;
      //     }
      //     break;
      //   case "resumePbPlusMenu":
      //     switch (this.arrow) {
      //       case 0: //>Resume pressed
      //         this.displayLCD.display(this.menuList.workPbPlusMenu, this.arrow);
      //         this.currMenu = "workPbMinusMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(this.menuList.stayPbPlusMenu, this.arrow);
      //         this.currMenu = "stayPbPlusMenu";
      //         break;
      //     }
      //     break;

      //   case "resumeDimmerMenu":
      //     switch (this.arrow) {
      //       case 0: //>Resume pressed
      //         this.displayLCD.display(this.menuList.workDimmerMenu, this.arrow);
      //         this.currMenu = "workDimmerMenu";
      //         break;
      //       case 1: //>Stop pressed
      //         this.arrow = 0;
      //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
      //         this.currMenu = "mainMenu";
      //         break;
      //       case 2: //>Back pressed
      //         this.displayLCD.display(this.menuList.stayDimmerMenu, this.arrow);
      //         this.currMenu = "stayDimmerMenu";
      //         break;
      //     }
      //     break;
        default:
          break;
      }
      console.log(
        "Rotary switch pressed. this.currMenu: " +
          this.currMenu + " menu.js"
      );
    });
  };
}

module.exports = Menu;
