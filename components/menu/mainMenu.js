const TMenu = require("./tMenu");
const SMenu = require("./sMenu");
const Profil = require("./profil");
const ConstTemp = require("./constTemp");
const Dimmer = require("./dimmer.js");
const Encoder = require("../encoder");
const PidMenu = require("./pidMenu");
const BaseComponent = require("./baseComponent");

class Menu extends BaseComponent {
  tMenu = new TMenu();
  sMenu = new SMenu(this);
  profil = new Profil(this);
  constTemp = new ConstTemp(this);
  dimmer = new Dimmer(this);
  encoder = new Encoder();
  pidMenu = new PidMenu(this);

  constructor() {
    super();
    this.currMenu = "";
    this.currMenuLength = 1;
    this.arrow = 0;
  }

  async start(ioConnection) {
    this.ioConnection = ioConnection;
    this.init(0);
  }

  async init(arrow = 0) {
    this.arrow = arrow;
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
          this.displayLCD.moveArrow(this.menuList.mainMenu, this.arrow);
          break;
        case "tMenu":
          this.tMenu.stop();
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
              await this.profil.init(this.ioConnection);
              break;
            case 1: //>PIDset pressed
              this.currMenu = "pidMenu";
              this.removeListeners();
              await this.pidMenu.init(this.ioConnection);
              break;
            case 2: //>Const pressed
              this.currMenu = "constMenu";
              this.removeListeners();
              await this.constTemp.init(this.ioConnection);
              break;
            case 3: //>Dimmer pressed
              this.currMenu = "dimmer";
              this.removeListeners();
              await this.dimmer.init(this.ioConnection);
              break;
            case 4: //>T pressed
              this.arrow = 0;
              this.currMenu = "tMenu";
              this.tMenu.init(this.ioConnection);
              await this.tMenu.start(this.menuList.tMenu); //waiting for measuring process
              this.arrow = 4;
              this.displayLCD.display(this.menuList.mainMenu, this.arrow); //display mainMenu after this.therm.stop();
              this.currMenu = "mainMenu";
              this.currMenuLength = this.menuList.mainMenu.type;
              break;
            case 5: //>S pressed
              this.arrow = 0;
              this.currMenu = "sMenu";
              this.removeListeners();
              await this.sMenu.init();
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
