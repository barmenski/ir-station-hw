const INPUT_TEMP_RANGE = document.querySelector(
  "input[name='manual-set-temp']"
);
const OUTPUT_TEMP_RANGE = document.querySelector(
  "output[name='manual-set-temp']"
);
const INPUT_SPEED_RANGE = document.querySelector(
  "input[name='manual-set-speed']"
);
const OUTPUT_SPEED_RANGE = document.querySelector(
  "OUTput[name='manual-set-speed']"
);
const INPUT_POWER_RANGE = document.querySelector(
  "input[name='manual-set-pow']"
);
const OUTPUT_POWER_RANGE = document.querySelector(
  "OUTput[name='manual-set-pow']"
);

const K_P = document.querySelector('.pid-p');

const K_I = document.querySelector('.pid-i');

const K_D = document.querySelector('.pid-d');

export class Input_panel {
  constructor() {
    this.mode = 'pb-';
    this.constTemp = 0;
    this.constPow = 0;
    this.speed = 1;
    this.boardWidth = 150;
    this.boardLength = 200;
    this.k_p = 40;
    this.k_i = 0.05;
    this.k_d = 80;
    this.profilePb = [
      [130, 150],
      [210, 183],
      [240, 220],
    ];
    this.profilePbFree = [
      [120, 160],
      [210, 219],
      [240, 250],
    ];
  }

  init = () => {
    if (document.getElementById('pb-').checked) {
      this.mode = document.getElementById('pb-').value;
    } else if (document.getElementById('pb+').checked) {
      this.mode = document.getElementById('pb+').value;
    } else if (document.getElementById('const-temp').checked) {
      this.mode = document.getElementById('const-temp').value;
    } else if (document.getElementById('const-pow').checked) {
      this.mode = document.getElementById('const-pow').value;
    }

    if (this.mode === 'const-pow') {
      this.constPow = document.getElementById('const-pow-set').value;
    }

    if (this.mode === 'const-temp') {
      this.constTemp = document.getElementById('const-temp-set').value;
    }

    if (document.querySelector('.width-board').value) {
      this.boardWidth = document.querySelector('.width-board').value;
    } else this.boardWidth = 150;

    if (document.querySelector('.length-board').value) {
      this.boardLength = document.querySelector('.length-board').value;
    } else this.boardLength = 200;

    INPUT_TEMP_RANGE.addEventListener('input', (event) => {
      event.preventDefault();
      OUTPUT_TEMP_RANGE.innerHTML = `${INPUT_TEMP_RANGE.value}`;
      this.constTemp = Number(INPUT_TEMP_RANGE.value);
      document.getElementById('const-temp').checked = true;
    });

    INPUT_POWER_RANGE.addEventListener('input', (event) => {
      event.preventDefault();
      OUTPUT_POWER_RANGE.innerHTML = `${INPUT_POWER_RANGE.value}`;
      this.constPow = Number(INPUT_POWER_RANGE.value);
      document.getElementById('const-pow').checked = true;
    });

    INPUT_SPEED_RANGE.addEventListener('input', (event) => {
      event.preventDefault();
      OUTPUT_SPEED_RANGE.innerHTML = `${INPUT_SPEED_RANGE.value}`;
      this.speed = Number(INPUT_SPEED_RANGE.value);
    });

    K_P.addEventListener('input', (event) => {
      event.preventDefault();
      this.k_p = Number(K_P.value);
      console.log('this.k_p: ' + this.k_p);
    });
    K_I.addEventListener('input', (event) => {
      event.preventDefault();
      this.k_i = Number(K_I.value);
      console.log('this.k_i: ' + this.k_i);
    });
    K_D.addEventListener('input', (event) => {
      event.preventDefault();
      this.k_d = Number(K_D.value);
      console.log('this.k_d: ' + this.k_d);
    });
  };

  set_mode = (mode) => {
    this.mode = mode;
  };
}
