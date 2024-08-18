import { Station } from './components/station.js';
import { Graph } from './components/graph.js';
import { Station_image } from './components/station_img.js';

const station_image = new Station_image();
station_image.init();
window.station = new Station();

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

window.temp_graph = new Graph(TEMP_CANVAS, 'Chip temp.');
window.power_top_graph = new Graph(POWER_TOP_CANVAS, 'Power top');
window.power_bottom_graph = new Graph(POWER_BOTTOM_CANVAS, 'Power bottom');
window.station.input_panel.init();

START_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  window.station.start();
});
CANCEL_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  window.station.timerStopped = true;
});

OFF_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  window.station.input_panel.set_mode('heaters off');
});

window.refresh = () => {
  TOP_POWER.innerHTML = `${window.station.powerTop}`;
  BOTTOM_POWER.innerHTML = `${window.station.powerBottom}`;
  CHIP_TEMP.innerHTML = `${Math.round(window.station.tempChip)}`;
  BOARD_TEMP.innerHTML = `${Math.round(window.station.tempBoard)}`;
  MODE.innerHTML = `Mode: ${window.station.input_panel.mode}`;
  window.temp_graph.drawGraph(
    window.station.currTime * 0.5,
    -0.25 * window.station.tempChip
  );
  window.power_top_graph.drawGraph(
    window.station.currTime * 0.5,
    -0.1 * window.station.powerTop
  );
  window.power_bottom_graph.drawGraph(
    window.station.currTime * 0.5,
    -0.1 * window.station.powerBottom
  );
};
