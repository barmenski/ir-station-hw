const DisplayLCD = require("../displayLCD");
const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const Led = require("../led");

class SMenu extends BaseComponent {
  displayLCD = new DisplayLCD();
  encoder = new Encoder();
  led = new Led();

  constructor(parent) {
    super();
    this.parent = parent;
    this.timerStopped = true;
    this.hiddenData = false;

    this.stage = "sMenu";
  }

  async init() {
    this.arrow = 0;
    this.displayLCD.display(this.menuList.sMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();
    this.currMenu = "sMenu";
    this.currMenuLength = this.menuList.sMenu.type;

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {

        case "setTargetIP": //calculate targetTemp
          let rawNumberBottom = Math.round(
            Number(this.menuList.constMenu.data2 + delta)
          );
          if (rawNumberBottom >= 9) {
            this.menuList.constMenu.data2 = 0;
          } else if (rawNumberBottom < 0) {
            this.menuList.constMenu.data2 = 0;
          } else this.menuList.constMenu.data2 = rawNumberBottom;

          this.displayLCD.show3digit(4, 1, this.menuList.constMenu.data2);
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
    // execute("sudo systemctl start ir_station", function (callback) {
    //   console.log(callback);
    // });

    this.encoder.on("pressed", async () => {
      switch (this.currMenu) {
        case "sMenu":
          switch (this.arrow) {
            case 0: //>Restore pressed

              break;
            case 1: //>192.168.000.100 pressed
              await this.#setTargetIP();
              this.currMenu = "sMenu";
              this.displayLCD.display(this.menuList.sMenu, this.arrow);
              this.currMenuLength = this.menuList.sMenu.type;
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init(5);
              break;

          }
        case "setTargetTemp":
        case "setTargetSpeed":
          this.displayLCD.setBlinkFlag(false);
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

  async #setTargetIP() {
    this.arrow = 1;
    this.currMenu = "setTargetIP";
    this.displayLCD.setBlinkFlag(true);
    await this.displayLCD.blink3digit(4, 1, this.menuList.constMenu.data2);
    this.targetTemp = this.menuList.constMenu.data2;
    this.menuList.workConstMenu.text5 = this.menuList.constMenu.data2;
    this.menuList.pauseConstMenu.data2 = this.menuList.constMenu.data2;
    this.#writeData();
  }

}
module.exports = SMenu;
