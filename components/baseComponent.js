const Rotary = require("raspberrypi-rotary-encoder");
const fs = require("fs");
var path = require("path");

class BaseComponent {
    rotary = new Rotary(13, 14, 12); //(pinClk, pinDt, pinSwitch);
    menuList = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/menuList.json"), (err, data) => data)
      );
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    fs = fs;
    path = path;
    
    constructor() {

    }
  }
  module.exports = BaseComponent;