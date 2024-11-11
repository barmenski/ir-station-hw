const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const exec = require("child_process").exec;

class SMenu extends BaseComponent {
  encoder = new Encoder();

  constructor(parent) {
    super();
    this.parent = parent;
    this.timerStopped = true;
    this.hiddenData = false;
    this.partOfIP = 0;
    this.IPinArray = [];

    this.stage = "sMenu";
  }

  async init() {
    this.arrow = 0;
    this.displayLCD.display(this.menuList.sMenu, this.arrow);
    await this.sleep(100);
    this.encoder.init();
    this.currMenu = "sMenu";
    this.currMenuLength = this.menuList.sMenu.type;
    this.IPinArray = this.menuList.sMenu.text2
      .split(".")
      .map((item) => Number(item));

    this.encoder.on("rotate", async (delta) => {
      switch (this.currMenu) {
        case "setTargetIP0": //calculate the first tree digits of IP
          let rawIP0 = Math.round(Number(this.IPinArray[0] + delta));
          if (rawIP0 >= 255) {
            this.IPinArray[0] = 0;
          } else if (rawIP0 < 0) {
            this.IPinArray[0] = 0;
          } else this.IPinArray[0] = rawIP0;

          this.displayLCD.show3digit(1, 1, this.IPinArray[0]);
          break;

        case "setTargetIP1": //calculate the second tree digits of IP
          let rawIP1 = Math.round(Number(this.IPinArray[1] + delta));
          if (rawIP1 >= 255) {
            this.IPinArray[1] = 0;
          } else if (rawIP1 < 0) {
            this.IPinArray[1] = 0;
          } else this.IPinArray[1] = rawIP1;

          this.displayLCD.show3digit(5, 1, this.IPinArray[1]);
          break;

        case "setTargetIP2": //calculate the third tree digits of IP
          let rawIP2 = Math.round(Number(this.IPinArray[2] + delta));
          if (rawIP2 >= 255) {
            this.IPinArray[2] = 0;
          } else if (rawIP2 < 0) {
            this.IPinArray[2] = 0;
          } else this.IPinArray[2] = rawIP2;

          this.displayLCD.show3digit(9, 1, this.IPinArray[2]);
          break;
        case "setTargetIP3": //calculate the third tree digits of IP
          let rawIP3 = Math.round(Number(this.IPinArray[3] + delta));
          if (rawIP3 >= 255) {
            this.IPinArray[3] = 0;
          } else if (rawIP3 < 0) {
            this.IPinArray[3] = 0;
          } else this.IPinArray[3] = rawIP3;

          this.displayLCD.show3digit(13, 1, this.IPinArray[3]);
          break;
        default:
          this.arrow = this.arrow + delta;
          if (this.arrow > this.currMenuLength - 1) {
            this.arrow = 0;
          }
          if (this.arrow < 0) {
            this.arrow = this.currMenuLength - 1;
          }

          this.displayLCD.moveArrow(this.menuList.sMenu, this.arrow);
          break;
      }
    });

    this.encoder.on("pressed", async () => {
      switch (this.currMenu) {
        case "sMenu":
          switch (this.arrow) {
            case 0: //>Apply pressed
              let stringComand1 =
                "sudo ifconfig wlan0 " +
                this.menuList.sMenu.text2 +
                " netmask 255.255.255.0";

              this.#execute(stringComand1, function (callback) {
                console.log(callback);
              });

              let stringComand2 =
                "sudo route add default gw 192.168.67.240 wlan0";

              this.#execute(stringComand2, function (callback) {
                console.log(callback);
              });
              this.displayLCD.display(
                { name: "applied", type: 1, text1: "Applied." },
                this.arrow
              );
              await this.sleep(700);
              this.currMenu = "sMenu";
              this.displayLCD.display(this.menuList.sMenu, this.arrow);
              this.currMenuLength = this.menuList.sMenu.type;

              break;
            case 1: //>192.168.000.100 pressed
              if (this.partOfIP < 4) {
                await this.#setTargetIP(this.partOfIP);
                this.partOfIP++;
                this.currMenu = "sMenu";
                this.displayLCD.display(this.menuList.sMenu, this.arrow);
                this.currMenuLength = this.menuList.sMenu.type;
              } else this.partOfIP = 0;
              break;
            case 2: //>Back pressed
              this.arrow = 0;
              this.#removeListeners();
              this.parent.init(5);
              break;
          }
          break;
        case "setTargetIP0":
        case "setTargetIP1":
        case "setTargetIP2":
        case "setTargetIP3":
          this.displayLCD.setBlinkFlag(false);
          break;
        default:
      }
    });
  }

  #execute(command, callback) {
    exec(command, function (error, stdout, stderr) {
      callback(stdout);
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

  async #setTargetIP(partOfIP) {
    this.arrow = 1;

    this.displayLCD.setBlinkFlag(true);
    switch (partOfIP) {
      case 0:
        this.currMenu = "setTargetIP0";
        await this.displayLCD.blink3digit(1, 1, this.IPinArray[0]);
        break;
      case 1:
        this.currMenu = "setTargetIP1";
        await this.displayLCD.blink3digit(5, 1, this.IPinArray[1]);
        break;
      case 2:
        this.currMenu = "setTargetIP2";
        await this.displayLCD.blink3digit(9, 1, this.IPinArray[2]);
        break;
      case 3:
        this.currMenu = "setTargetIP3";
        await this.displayLCD.blink3digit(13, 1, this.IPinArray[3]);
        break;
      default:
    }

    this.menuList.sMenu.text2 = this.IPinArray.join(".");
    this.#writeData();
  }
}
module.exports = SMenu;
