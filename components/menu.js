const ThermShow = require("./therm-show");
const PbMinus = require("./pbMinus");
const ConstTemp = require("./constTemp");
const Dimmer = require("./dimmer.js");
//const Dimmer = require("./dimmer-h.js");
const DisplayLCD = require("./displayLCD");
const BaseComponent = require("./baseComponent");

class Menu extends BaseComponent {
  thermShow = new ThermShow();
  pbMinus = new PbMinus();
  constTemp = new ConstTemp(this);
  dimmer = new Dimmer(this);
  displayLCD = new DisplayLCD();

  constructor() {
    super();
    // this.rotary.init();
    this.currMenu = "";
    this.currMenuLength = 1;
    this.arrow = 0;
  }

  async start() {
    this.displayLCD.display(this.menuList.startMenu, this.arrow);
    this.currMenu = "startMenu";
    await this.sleep(2000);
    console.log("menu.js before this.init();");
    this.rotary.init();
    this.init();
    
  }

  async init() {
    await this.sleep(100);
    this.displayLCD.display(this.menuList.mainMenu, this.arrow);
    this.currMenu = "mainMenu";
    this.currMenuLength = this.menuList.mainMenu.type;

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

    this.rotary.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "mainMenu":
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 1) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 1;
          }
          this.displayLCD.moveArrow(this.arrow);
          console.log(
            "this.currmenu (main.js): " + this.currMenu + " " + this.arrow
          );
          break;
        case "thermMenu":
          this.thermShow.stop();
          break;
        default:
          break;
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
              this.currMenuLength = this.menuList.pbMinusMenu.type;
              break;
            case 1: //>Pb+ pressed
              this.arrow = 0;
              this.displayLCD.display(this.menuList.pbPlusMenu, this.arrow);
              this.currMenu = "pbPlusMenu";
              this.currMenuLength = this.menuList.pbPlusMenu.type;
              break;
            case 2: //>Const pressed
              this.currMenu = "constMenu";
              this.removeListeners();
              await this.constTemp.init();
              break;
            case 3: //>Dimmer pressed
              this.currMenu = "dimmer";
              this.removeListeners();
              await this.dimmer.init();
              break;
            case 4: //>T pressed
              this.arrow = 0;
              this.currMenu = "thermMenu";
              await this.thermShow.start(this.menuList.thermMenu, this.arrow); //waiting for measuring process
              this.arrow = 4;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.therm.stop();
              this.currMenu = "mainMenu";
              this.currMenuLength = this.menuList.mainMenu.type;
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

        default:
          break;
      }
      console.log(
        "Rotary switch pressed. this.currMenu: " + this.currMenu + " menu.js"
      );
    });
    console.log("menu.js end of  this.init();");
  }

  removeListeners() {
    this.rotary.removeAllListeners("pressed");
    this.rotary.removeAllListeners("rotate");
  }

}

module.exports = Menu;
