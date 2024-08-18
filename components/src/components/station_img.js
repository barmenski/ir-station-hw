export class Station_image {
  constructor() {
    this.wrapper_station = document.querySelector('.wrapper-station');
  }

  init = () => {
    this.wrapper_station.innerHTML = `
  <img class="station-image" src="./assets/images/ir-station-model.svg" alt="IR-station image"/>
  
  <div class="top-heater">
    <p class="top-heater-text">
      <span class="top-heater-power">-</span>&nbspW
    </p>
  </div>
  
  <div class="chip">
    <p class="chip-text"><span class="chip-temp">-</span>&nbsp&#176C</p>
  </div>
  
  <div class="board">
    <p class="board-text"><span class="board-temp">-</span>&nbsp&#176C</p>
  </div>
  
  <div class="bottom-heater">
    <p class="bottom-heater-text">
      <span class="bottom-heater-power">-</span>&nbspW
    </p>
  </div>
  
  <div class="timer">0 s</div>
  <div class="show-mode">Mode:</div>
    `;
  };
}
