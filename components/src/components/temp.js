// let maxPower = 3460; // W
// let maxTempRise = 7; // C/sec
// let oneCelSecTempRise = maxPower / maxTempRise; //692W -  power for 1 C/sec
// export class Temperature {
//   constructor(tempEnv = 25, tempChip = 25, tempBoard = 25) {
//     this.tempEnv = tempEnv;
//     this.tempChip = tempChip;
//     this.tempBoard = tempBoard;
//   }

//   getTempBoard = (powerTop, powerBottom) => {
//     let deltaTemp = Math.abs(Number((this.tempChip - this.tempEnv).toFixed(1)));

//     this.tempBoard = Number(
//       (
//         this.tempBoard -
//         deltaTemp * 0.05 +
//         (powerTop + powerBottom) / oneCelSecTempRise
//       ).toFixed(1)
//     );

//     return this.tempBoard;
//   };

//   getTempChip = (powerTop, powerBottom) => {
//     this.tempChip = this.tempBoard;
//     return this.tempChip;
//   };
// }
//_____________________________________new version_______________
//W = c * m * (t2 - t1) / time
//c=1470 W*sec/kg*°K
//W-power
//m-weight of object
//ro=1400 kg/1m3
//t2-t1 - change temperature
//time - time of change (1 sec)
//W * time / (c * m ) = t2-t1
//
export class Temperature {
  constructor(tempEnv = 25, tempChip = 25, tempBoard = 25) {
    this.tempEnv = tempEnv;
    this.tempChip = tempChip;
    this.tempBoard = tempBoard;
    this.tempCap = 1470; //1470 W*sec/kg*°K
    this.density = 1400; //1400 kg/1m3
  }

  getTempBoard = (powerTop, powerBottom, boardWidth, boardLength) => {
    let weight = Number(
      (((boardWidth * boardLength * 2) / 1000000000) * this.density).toFixed(2)
    );

    let deltaTemp = Number(
      (
        ((powerTop * 0.1 + powerBottom) * 0.5) /
        (this.tempCap * weight)
      ).toFixed(2)
    );

    if (this.tempBoard >= this.tempEnv) {
      this.tempBoard = Number((this.tempBoard - 0.7 + deltaTemp).toFixed(2));
    } else {
      this.tempBoard = this.tempEnv;
    }

    return this.tempBoard;
  };

  getTempChip = (powerTop, powerBottom, boardWidth, boardLength) => {
    let weight = Number(
      (((boardWidth * boardLength * 2) / 1000000000) * this.density).toFixed(2)
    );

    let deltaTemp = Number(
      (
        ((powerTop + powerBottom * 0.8) * 0.5) /
        (this.tempCap * weight)
      ).toFixed(2)
    );
    if (this.tempChip >= this.tempEnv) {
      this.tempChip = Number((this.tempChip - 0.7 + deltaTemp).toFixed(2));
    } else {
      this.tempChip = this.tempEnv;
    }
    return this.tempChip;
  };
}
