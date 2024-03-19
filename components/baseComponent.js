//const Rotary = require("raspberrypi-rotary-encoder");
const Rotary = require("./encoder");
const fs = require("fs");
var path = require("path");

class BaseComponent {
    rotary = new Rotary();

    menuList = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/menuList.json"), (err, data) => data)
      );
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    fs = fs;
    path = path;
    
    constructor() {
      //this.rotary.init();
    }
  }
  module.exports = BaseComponent;