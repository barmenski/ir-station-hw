const LCD = require("raspberrypi-liquid-crystal");

class DisplayLCD {
  lcd = new LCD(1, 0x27, 16, 2);
  constTemp = 0;

  constructor() {
    this.lcd.beginSync();
    this.lcd.clearSync();
    this.blinkFlag = false;
    this.lcd
      .createCharSync(0, [0x1f, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f]) // ▊
      .createCharSync(1, [0x0, 0x8, 0xc, 0xe, 0xc, 0x8, 0x0, 0x0]); // >
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  clear = () => {
    this.lcd.clearSync();
  };

  #display1items = (menu) => {
    this.lcd.clearSync();
    this.lcd.setCursorSync(5, 0);
    this.lcd.printSync(menu.text1);
  };

  #display2items = (menu, arrow) => {
    this.lcd.clearSync();
    this.moveArrow(arrow);

    this.lcd.setCursorSync(1, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(1, 1);
    this.lcd.printSync(menu.text2);
  };

  #display3items = (menu, arrow) => {
    this.lcd.clearSync();
    this.moveArrow(arrow);

    this.lcd.setCursorSync(1, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(1, 1);
    this.lcd.printSync(menu.text2);

    this.lcd.setCursorSync(8, 0);
    this.lcd.printSync(menu.text3);
  };

  #display4items = (menu, arrow) => {
    this.lcd.clearSync();
    this.moveArrow(arrow);

    this.lcd.setCursorSync(1, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(1, 1);
    this.lcd.printSync(menu.text2);

    if (typeof menu.data1 !== "undefined") {
      this.lcd.setCursorSync(4, 0);
      this.lcd.printSync(menu.data1);
    }

    if (typeof menu.data2 !== "undefined") {
      this.lcd.setCursorSync(4, 1);
      this.lcd.printSync(menu.data2);
    }
    if (typeof menu.data3 !== "undefined") {
      this.lcd.setCursorSync(12, 0);
      this.lcd.printSync(menu.data3);
    }
    if (typeof menu.data4 !== "undefined") {
      this.lcd.setCursorSync(12, 1);
      this.lcd.printSync(menu.data4);
    }

    this.lcd.setCursorSync(8, 0);
    this.lcd.printSync(menu.text3);
    this.lcd.setCursorSync(8, 1);
    this.lcd.printSync(menu.text4);
  };

  #display5items = (menu, arrow) => {
    this.lcd.clearSync();
    this.moveArrow(arrow);

    this.lcd.setCursorSync(1, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(1, 1);
    this.lcd.printSync(menu.text2);

    this.lcd.setCursorSync(8, 0);
    this.lcd.printSync(menu.text3);
    this.lcd.setCursorSync(8, 1);
    this.lcd.printSync(menu.text4);

    this.lcd.setCursorSync(15, 0);
    this.lcd.printSync(menu.text5);
  };

  #display6items = (menu) => {
    this.lcd.clearSync();

    this.lcd.setCursorSync(0, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(0, 1);
    this.lcd.printSync(menu.text2);

    this.lcd.setCursorSync(6, 0);
    this.lcd.printSync(menu.text3);
    this.lcd.setCursorSync(6, 1);
    this.lcd.printSync(menu.text4);

    this.lcd.setCursorSync(13, 0);
    this.lcd.printSync(menu.text5);
    this.lcd.setCursorSync(13, 1);
    this.lcd.printSync(menu.text6);
  };

  displayThermTitles = (menu) => {
    this.lcd.clearSync();
    this.lcd.setCursorSync(0, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(0, 1);
    this.lcd.printSync(menu.text2);

    this.lcd.setCursorSync(2, 0);
    this.lcd.printSync(menu.data1);
    this.lcd.setCursorSync(2, 1);
    this.lcd.printSync(menu.data2);

    this.lcd.setCursorSync(6, 0);
    this.lcd.printSync(menu.text3);
    this.lcd.setCursorSync(6, 1);
    this.lcd.printSync(menu.text4);
  };

  displayThermData = (tempChip, tempBoard) => {
    if (tempChip < 1000 && tempChip > 99) {
      this.lcd.setCursorSync(2, 0);
      this.lcd.printSync(tempChip);
    } else if (tempChip < 10) {
      this.lcd.setCursorSync(4, 0);
      this.lcd.printSync(tempChip);
    } else {
      this.lcd.setCursorSync(3, 0);
      this.lcd.printSync(tempChip);
    }

    if (tempChip < 1000 && tempBoard > 99) {
      this.lcd.setCursorSync(2, 1);
      this.lcd.printSync(tempBoard);
    } else if (tempChip < 10) {
      this.lcd.setCursorSync(4, 1);
      this.lcd.printSync(tempBoard);
    } else {
      this.lcd.setCursorSync(3, 1);
      this.lcd.printSync(tempBoard);
    }
  };

  displayProfilData = (tempChip, tempBoard, powerTop, powerBottom) => {
    this.lcd.setCursorSync(2, 0);
    this.lcd.printSync("    ");
    this.lcd.setCursorSync(3, 0);
    this.lcd.printSync(tempChip);

    this.lcd.setCursorSync(2, 1);
    this.lcd.printSync("    ");
    this.lcd.setCursorSync(3, 1);
    this.lcd.printSync(tempBoard);

    this.lcd.setCursorSync(8, 0);
    this.lcd.printSync("   ");
    this.lcd.setCursorSync(8, 0);
    this.lcd.printSync(powerTop);

    this.lcd.setCursorSync(8, 1);
    this.lcd.printSync("   ");
    this.lcd.setCursorSync(8, 1);
    this.lcd.printSync(powerBottom);

    //t=000 P=000% pt1
    //  ↑↑↑   ↑↑↑
    //t=000 P=000% run
    //  ↑↑↑   ↑↑↑
  };

  displayEditTitles = (menu, arrow) => {
    this.editProfileMoveArrow(arrow);
    this.lcd.clearSync();
    this.lcd.setCursorSync(1, 0);
    this.lcd.printSync(menu.text1);
    this.lcd.setCursorSync(6, 0);
    this.lcd.printSync(menu.text2);
    this.lcd.setCursorSync(11, 0);
    this.lcd.printSync(menu.text3);

    this.lcd.setCursorSync(1, 1);
    this.lcd.printSync(menu.text4);
    this.lcd.setCursorSync(6, 1);
    this.lcd.printSync(menu.text5);
    this.lcd.setCursorSync(11, 1);
    this.lcd.printSync(menu.text6);

    this.lcd.setCursorSync(15, 0);
    this.lcd.printSync(menu.text7);
    this.lcd.setCursorSync(15, 1);
    this.lcd.printSync(menu.text8);
  };

  displayEditData = (menu, arrow) => {
    this.editProfileMoveArrow(arrow);
    this.lcd.setCursorSync(2, 0);
    this.lcd.printSync(menu.data1);
    this.lcd.setCursorSync(7, 0);
    this.lcd.printSync(menu.data3);
    this.lcd.setCursorSync(12, 0);
    this.lcd.printSync(menu.data5);

    this.lcd.setCursorSync(2, 1);
    this.lcd.printSync(menu.data2);
    this.lcd.setCursorSync(7, 1);
    this.lcd.printSync(menu.data4);
    this.lcd.setCursorSync(12, 1);
    this.lcd.printSync(menu.data6);
  };

  setBlinkFlag(phrase) {
    this.blinkFlag = phrase;
  }

  show3digit(col, row, digit) {
    this.constTemp = digit;
    this.lcd.setCursorSync(col, row);
    this.lcd.printSync(digit);
  }

  async blink3digit(col, row, digit) {
    this.constTemp = digit;
    while (this.blinkFlag) {
      this.lcd.setCursorSync(col, row);
      this.lcd.printSync(LCD.getChar(0));
      this.lcd.setCursorSync(col + 1, row);
      this.lcd.printSync(LCD.getChar(0));
      this.lcd.setCursorSync(col + 2, row);
      this.lcd.printSync(LCD.getChar(0));
      await this.sleep(200);
      this.show3digit(col, row, this.constTemp);
      await this.sleep(800);
    }
  }

  moveArrow(position) {
    switch (position) {
      case 0:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(" ");
        break;
      case 1:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(7, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(" ");
        break;
      case 2:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 0);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(7, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(" ");
        break;
      case 3:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 1);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(" ");
        break;
      case 4:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(7, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(">");
        break;
    }
  }

  editProfileMoveArrow(position) {
    switch (position) {
      case 0:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(" ");
        break;
      case 1:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(" ");
        break;
      case 2:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(" ");
        break;
      case 3:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(" ");
        break;
      case 4:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(">");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(" ");
        break;
      case 5:
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(5, 1);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 0);
        this.lcd.printSync(" ");
        this.lcd.setCursorSync(10, 1);
        this.lcd.printSync(">");
        break;
    }
  }

  display(menu, arrow) {
    console.log("menu.name " + menu.name);
    switch (menu.type) {
      case 1:
        this.#display1items(menu);
        break;
      case 2:
        this.#display2items(menu, arrow);
        break;
      case 3:
        this.#display3items(menu, arrow);
        break;
      case 4:
        this.#display4items(menu, arrow);
        break;
      case 5:
        this.#display5items(menu, arrow);
        break;
      case 6:
        this.#display6items(menu);
        break;
      default:
        break;
    }
  }
}
module.exports = DisplayLCD;
