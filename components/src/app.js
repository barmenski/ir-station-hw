//import { Station } from './components/station.js';
import { Graph } from './components/graph.js';
import { Station_image } from './components/station_img.js';
//import { Input_panel } from "./components//input_panel.js";
import "./components//socket.io.js";

const station_image = new Station_image();
station_image.init();
// window.station = new Station();
// window.station.init();

const socket = io();
var powerTop = 0;
var powerBottom = 0;
var tempChip = 25;
var tempBoard = 25;
var stage = 0;
var duration = 0;



const TOP_POWER = document.querySelector('.top-heater-power');
const BOTTOM_POWER = document.querySelector('.bottom-heater-power');
const CHIP_TEMP = document.querySelector('.chip-temp');
const BOARD_TEMP = document.querySelector('.board-temp');
const MODE = document.querySelector('.show-mode');

const TEMP_CANVAS = document.querySelector('.temp-canvas');
const POWER_CANVAS = document.querySelector('.power-canvas');

window.temp_graph = new Graph(TEMP_CANVAS, 'Chip temp.', 'Board temp.', 50);
window.power_graph = new Graph(POWER_CANVAS, 'Power top', 'Power bottom', 25);
//window.power_bottom_graph = new Graph(POWER_BOTTOM_CANVAS, 'Power bottom');
//window.station.input_panel.init();


  const timer = document.querySelector(".timer");

  socket.on("connect", () => {
    console.log("Socket client: " + socket.id);
  });
  socket.on("data", (data) => {

    ({ tempChip, tempBoard, powerTop, powerBottom, stage, duration } = data);

    window.refresh();
  });

window.refresh = () => {
  timer.innerHTML = `${Math.round(duration)} s`;
  TOP_POWER.innerHTML = `${powerTop}`;
  BOTTOM_POWER.innerHTML = `${powerBottom}`;
  CHIP_TEMP.innerHTML = `${Math.round(tempChip)}`;
  BOARD_TEMP.innerHTML = `${Math.round(tempBoard)}`;
  MODE.innerHTML = `Stage: ${stage}`;
  window.temp_graph.drawGraph(
    duration * 1,
    -0.5 * tempChip, -0.5 * tempBoard
  );
  window.power_graph.drawGraph(
    duration * 1,
    -1 *powerTop, -1 *powerBottom
  );

};
