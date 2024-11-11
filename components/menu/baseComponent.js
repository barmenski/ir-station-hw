const fs = require("fs");
var path = require("path");
const DisplayLCD = require("../displayLCD");
const Led = require("../led");

class BaseComponent {
  menuList = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/menuList.json"), (err, data) => data)
  );
  profilesList = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "/profilesList.json"),
      (err, data) => data
    )
  );
  pidSet = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/pidSet.json"), (err, data) => data)
  );
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  fs = fs;
  path = path;

  displayLCD = new DisplayLCD();
  led = new Led();

  constructor() {}
}
module.exports = BaseComponent;
