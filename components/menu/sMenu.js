const BaseComponent = require("./baseComponent");
const Encoder = require("../encoder");
const os = require("os");

class SMenu extends BaseComponent {
  encoder = new Encoder();

  constructor(parent) {
    super();
    this.parent = parent;

    this.stage = "sMenu";
  }

  async init() {
    this.arrow = 0;
    this.encoder.init();
    this.currMenu = "sMenu";
    this.currMenuLength = this.menuList.sMenu.type;
    this.#getIp();
    this.displayLCD.display(
      { name: "IP", type: 2, text1: this.localIP, text2: " " },
      this.arrow
    );

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
    this.localIP = Object.values(os.networkInterfaces())
      .flat()
      .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

    console.log("Локальный IP-адрес:", this.localIP);
  }

  #removeListeners() {
    this.encoder.removeAllListeners("pressed");
    this.encoder.removeAllListeners("rotate");
    this.encoder.stop();
  }
}
module.exports = SMenu;
