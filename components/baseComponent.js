//const Rotary = require("raspberrypi-rotary-encoder");
// const Rotary = require("./encoder");
const fs = require("fs");
var path = require("path");

class BaseComponent {
    // rotary = new Rotary();
    // rotaryInited = false;
    
    menuList = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/menuList.json"), (err, data) => data)
      );
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    fs = fs;
    path = path;
    
    constructor() {
    //   console.log("rotaryInited =", this.rotaryInited);
    //   if (!this.rotaryInited) {
    //     this.rotary.init();
    //     this.rotaryInited = true;
    //   } 
    }


  }
  module.exports = BaseComponent;