const Max6675 = require("max6675-raspi");

class Thermometer {
  max6675 = new Max6675();

  constructor() {
    const CS = "4";
    const SCK = "24";
    const SO = ["25", "8"];
    const UNIT = 1;
    this.max6675.setPin(CS, SCK, SO, UNIT);
  }

  measure() {
    const { temp, unit } = this.max6675.readTemp();
    let tempChip = Math.round(Number(temp[0]));
    let tempBoard = Math.round(Number(temp[1]));
    let allTemp = [tempChip, tempBoard];
    return allTemp;
  }
}
module.exports = Thermometer;
