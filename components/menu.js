const ThermShow = require("./therm-show");
const Profil = require("./profil");
const ConstTemp = require("./constTemp");
const Dimmer = require("./dimmer.js");
const DisplayLCD = require("./displayLCD");
const Encoder = require("./encoder");
const PidMenu = require("./pidMenu");
const BaseComponent = require("./baseComponent");

class Menu extends BaseComponent {
  thermShow = new ThermShow();
  profil = new Profil(this);
  constTemp = new ConstTemp(this);
  dimmer = new Dimmer(this);
  displayLCD = new DisplayLCD();
  encoder = new Encoder();
  pidMenu = new PidMenu(this);

  constructor() {
    super();
    this.currMenu = "";
    this.currMenuLength = 1;
    this.arrow = 0;
  }

  async start(httpServer) {
    this.httpServer=httpServer;
    this.init();
  }

  async init() {
    await this.sleep(100);
    this.encoder.init();
    this.displayLCD.display(this.menuList.mainMenu, this.arrow);
    this.currMenu = "mainMenu";
    this.currMenuLength = this.menuList.mainMenu.type;

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
              await this.profil.init(this.httpServer);
              break;
            case 1: //>PIDset pressed
            this.currMenu = "pidMenu";
            this.removeListeners();
            await this.pidMenu.init();
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

        default:
          break;
      }
    });
  }

  removeListeners() {
    this.encoder.removeAllListeners("pressed");
    this.encoder.removeAllListeners("rotate");
    this.encoder.stop();
  }

}

module.exports = Menu;
