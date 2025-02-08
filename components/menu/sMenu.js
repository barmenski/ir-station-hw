const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const os = require("os");

class SMenu extends BaseComponent {
  encoder = new Encoder();

  constructor(parent) {
    super();
    this.parent = parent;

    this.stage = "sMenu";
    this.allAddresses = [];
  }

  async init() {
    this.arrow = 0;
    this.encoder.init();
    this.currMenu = "sMenu";
    this.currMenuLength = this.menuList.sMenu.type;
    this.#getIp();
    if (this.allAddresses.length>1) {
      this.displayLCD.display(
        {
          name: "IP",
          type: 2,
          text1: this.allAddresses[0].address,
          text2: this.allAddresses[1].address,
        },
        this.arrow
      );
    } else {
      this.displayLCD.display(
        {
          name: "IP",
          type: 2,
          text1: this.allAddresses[0].address,
          text2: " ",
        },
        this.arrow
      );
    }

    this.encoder.on("rotate", async (delta) => {
      this.arrow = 0;
      this.#removeListeners();
      this.parent.init(5);
    });

    this.encoder.on("pressed", async () => {
      this.arrow = 0;
      this.#removeListeners();
      this.parent.init(5);
    });
  }

  #getIp() {
    // this.localIP = Object.values(os.networkInterfaces())
    //   .flat()
    //   .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

    // console.log("Локальный IP-адрес:", this.localIP);

    this.interfaces = os.networkInterfaces();

    for (const intrfce of Object.keys(this.interfaces)) {
      for (const iface of this.interfaces[intrfce]) {
        if (iface.family === "IPv4" && !iface.internal) {
          this.allAddresses.push({
            interface: intrfce,
            address: iface.address,
          });
        }
      }
    }

    console.log("Все IPv4 адреса:", this.allAddresses);
  }

  #removeListeners() {
    this.encoder.removeAllListeners("pressed");
    this.encoder.removeAllListeners("rotate");
    this.encoder.stop();
  }
}
module.exports = SMenu;
