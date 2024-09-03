//import { Station } from './components/station.js';
import { Graph } from './components/graph.js';
import { Station_image } from './components/station_img.js';
import { Input_panel } from "./components//input_panel.js";
import "./components//socket.io.js";

const station_image = new Station_image();
station_image.init();
// window.station = new Station();
// window.station.init();

const input_panel = new Input_panel();
const socket = io();
var powerTop = 0;
var powerBottom = 0;
var tempChip = 25;
var tempBoard = 25;
var stage = 0;
var duration = 0;

const START_BTN = document.querySelector('.form-control-start_btn');
const CANCEL_BTN = document.querySelector('.form-control-cancel_btn');
const OFF_BTN = document.querySelector('.form-control-off_btn');

const TOP_POWER = document.querySelector('.top-heater-power');
const BOTTOM_POWER = document.querySelector('.bottom-heater-power');
const CHIP_TEMP = document.querySelector('.chip-temp');
const BOARD_TEMP = document.querySelector('.board-temp');
const MODE = document.querySelector('.show-mode');

const TEMP_CANVAS = document.querySelector('.temp-canvas');
const POWER_TOP_CANVAS = document.querySelector('.power-top-canvas');
const POWER_BOTTOM_CANVAS = document.querySelector('.power-bottom-canvas');

window.temp_graph = new Graph(TEMP_CANVAS, 'Chip temp.', 'Board temp.');
window.power_top_graph = new Graph(POWER_TOP_CANVAS, 'Power top', 'Power bottom');
//window.power_bottom_graph = new Graph(POWER_BOTTOM_CANVAS, 'Power bottom');
//window.station.input_panel.init();
input_panel.init();

START_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  //window.station.start();
});
CANCEL_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  //window.station.timerStopped = true;
});

OFF_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  //window.station.input_panel.set_mode('heaters off');
});


  const timer = document.querySelector(".timer");

  socket.on("connect", () => {
    console.log("Socket client: " + socket.id);
  });
  socket.on("data", (data) => {

    ({ tempChip, tempBoard, powerTop, powerBottom, stage, duration } = data);

    window.refresh();
  });

window.refresh = () => {
  timer.innerHTML = `${duration} s`;
  TOP_POWER.innerHTML = `${powerTop}`;
  BOTTOM_POWER.innerHTML = `${powerBottom}`;
  CHIP_TEMP.innerHTML = `${Math.round(tempChip)}`;
  BOARD_TEMP.innerHTML = `${Math.round(tempBoard)}`;
  MODE.innerHTML = `Mode: ${input_panel.mode} Stage: ${stage}`;
  window.temp_graph.drawGraph(
    duration * 0.5,
    -0.25 * tempChip, -0.25 * tempBoard
  );
  window.power_top_graph.drawGraph(
    duration * 0.5,
    -0.1 *powerTop, -0.1 *powerBottom, 
  );
  // window.power_bottom_graph.drawGraph(
  //   duration * 0.5,
  //   -0.1 * powerBottom
  // );
};
