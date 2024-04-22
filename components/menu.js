const ThermShow = require("./therm-show");
const Profil = require("./profil");
const ConstTemp = require("./constTemp");
const Dimmer = require("./dimmer.js");
const DisplayLCD = require("./displayLCD");
const Encoder = require("./encoder");
const BaseComponent = require("./baseComponent");

class Menu extends BaseComponent {
  thermShow = new ThermShow();
  profil = new Profil();
  constTemp = new ConstTemp(this);
  dimmer = new Dimmer(this);
  displayLCD = new DisplayLCD();
  encoder = new Encoder();

  constructor() {
    super();
    this.currMenu = "";
    this.currMenuLength = 1;
    this.arrow = 0;
  }

  async start() {
    this.displayLCD.display(this.menuList.startMenu, this.arrow);
    this.currMenu = "startMenu";
    await this.sleep(2000);
    console.log("menu.js before this.init();");
    this.init();
    
  }

  async init() {
    await this.sleep(100);
    this.encoder.init();
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
    //     case "workprofilMenu": //display pause menu
    //       this.pbMinus.pause();
    //       //start constant temp mode
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.pauseprofilMenu, this.arrow);
    //       this.currMenu = "pauseprofilMenu";
    //       break;


    //     case "stayprofilMenu": //display resume menu
    //       this.arrow = 0;
    //       this.displayLCD.display(this.menuList.resumeprofilMenu, this.arrow);
    //       this.currMenu = "resumeprofilMenu";
    //       break;


    this.encoder.on("rotate", async (delta) => {
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

    this.encoder.on("pressed", async () => {
      switch (this.currMenu) {
        case "mainMenu":
          switch (this.arrow) {
            case 0: //>Profil pressed
              this.currMenu = "profilMenu";
              this.removeListeners();
              await this.profil.init();
              break;
            case 1: //>PIDset pressed
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
        //   case "profilMenu":
        //     switch (this.arrow) {
        //       case 0: //>Start pressed
        //         this.arrow = 0;
        //         this.currMenu = "workprofilMenu";
        //         await this.pbMinus.start(
        //           this.menuList.workprofilMenu,
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

        //   case "pauseprofilMenu":
        //     switch (this.arrow) {
        //       case 0: //>Pause pressed
        //         this.displayLCD.display(
        //           this.menuList.stayprofilMenu,
        //           this.arrow
        //         );
        //         this.currMenu = "stayprofilMenu";
        //         break;
        //       case 1: //>Stop pressed
        //         this.pbMinus.stop();
        //         break;
        //       case 2: //>Back pressed
        //         this.displayLCD.display(
        //           this.menuList.workprofilMenu,
        //           this.arrow
        //         );
        //         this.currMenu = "workprofilMenu";
        //         break;
        //     }
        //     break;

        //   case "resumeprofilMenu":
        //     switch (this.arrow) {
        //       case 0: //>Resume pressed
        //         this.displayLCD.display(
        //           this.menuList.workprofilMenu,
        //           this.arrow
        //         );
        //         this.currMenu = "workprofilMenu";
        //         break;
        //       case 1: //>Stop pressed
        //         this.arrow = 0;
        //         this.displayLCD.display(this.menuList.mainMenu, this.arrow);
        //         this.currMenu = "mainMenu";
        //         break;
        //       case 2: //>Back pressed
        //         this.displayLCD.display(
        //           this.menuList.stayprofilMenu,
        //           this.arrow
        //         );
        //         this.currMenu = "stayprofilMenu";
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
    this.encoder.removeAllListeners("pressed");
    this.encoder.removeAllListeners("rotate");
    this.encoder.stop();
  }

}

module.exports = Menu;
