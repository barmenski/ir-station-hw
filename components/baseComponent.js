const fs = require("fs");
var path = require("path");

class BaseComponent {
    
    menuList = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/menuList.json"), (err, data) => data)
      );
      profilesList = JSON.parse(
        fs.readFileSync(path.join(__dirname, "/profilesList.json"), (err, data) => data)
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