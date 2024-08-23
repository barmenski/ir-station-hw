import { Temperature } from "./temp.js";
import { Input_panel } from "./input_panel.js";
import "./socket.io.js";

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.input_panel = new Input_panel();
    this.socket = io();
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.idealTemp = 25;
    this.tempBoard = 25;
    this.ctr = null;
    this.currTime = 0;
    this.stepPower = 10;
    this.delta = 0;
    this.rise = 0;
    this.timerStopped = true;

    this.preHeatTime = 0;
    this.preHeatTrmp = 0;
    this.waitTime = 0;
    this.waitTemp = 0;
    this.reflowTime = 0;
    this.reflowTemp = 0;
  }

  init = () => {
    this.timer = document.querySelector(".timer");

    this.socket.on("message", (message) =>
      console.log("Message from server: ", message)
    );
  };

  getTemperature = () => {
    this.tempBoard = this.temperature.getTempBoard(
      this.powerTop,
      this.powerBottom,
      this.input_panel.boardWidth,
      this.input_panel.boardLength
    );
    this.tempChip = this.temperature.getTempChip(
      this.powerTop,
      this.powerBottom,
      this.input_panel.boardWidth,
      this.input_panel.boardLength
    );
  };

  heat = () => {
    window.refresh();
    this.timer.innerHTML = `${this.currTime} s`;
    this.currTime++;

    switch (this.input_panel.mode) {
      case "pb+":
      case "pb-":
        if (this.input_panel.mode === "pb+") {
          this.preHeatTime = this.input_panel.profilePb[0][0];
          this.preHeatTemp = this.input_panel.profilePb[0][1];
          this.waitTime = this.input_panel.profilePb[1][0];
          this.waitTemp = this.input_panel.profilePb[1][1];
          this.reflowTime = this.input_panel.profilePb[2][0];
          this.reflowTemp = this.input_panel.profilePb[2][1];
        } else if (this.input_panel.mode === "pb-") {
          this.preHeatTime = this.input_panel.profilePbFree[0][0];
          this.preHeatTemp = this.input_panel.profilePbFree[0][1];
          this.waitTime = this.input_panel.profilePbFree[1][0];
          this.waitTemp = this.input_panel.profilePbFree[1][1];
          this.reflowTime = this.input_panel.profilePbFree[2][0];
          this.reflowTemp = this.input_panel.profilePbFree[2][1];
        }

        break;
      case "pb const-pow":
      case "heaters off":
        break;
      case "const-pow":
        break;
      case "const-temp":
        break;
    }
  };

  start = () => {
    this.init();
    this.input_panel.init();
  };

  stop = () => {};
}
