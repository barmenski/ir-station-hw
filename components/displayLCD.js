const LCD = require('raspberrypi-liquid-crystal');

class DisplayLCD {
    lcd = new LCD(1, 0x27, 16, 2);
    
    constructor () {
        this.lcd.beginSync();
        this.lcd.clearSync();
    }

    #display1items = (menu)=>{
        this.lcd.clearSync();
        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(menu[1]);
    }

    #display3items = (menu)=>{
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(menu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(menu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(menu[3]);
    }

    #display4items = (menu)=>{
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(menu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(menu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(menu[3]);
        this.lcd.setCursorSync(8, 1);
        this.lcd.printSync(menu[4]);
    }

    #display5items = (menu)=>{
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(menu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(menu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(menu[3]);
        this.lcd.setCursorSync(8, 1);
        this.lcd.printSync(menu[4]);

        this.lcd.setCursorSync(15, 0);
        this.lcd.printSync(menu[5]);
    }

    #display6items = (menu)=>{
        this.lcd.clearSync();

        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(menu[1]);
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(menu[2]);

        this.lcd.setCursorSync(6, 0);
        this.lcd.printSync(menu[3]);
        this.lcd.setCursorSync(6, 1);
        this.lcd.printSync(menu[4]);

        this.lcd.setCursorSync(13, 0);
        this.lcd.printSync(menu[5]);
        this.lcd.setCursorSync(13, 1);
        this.lcd.printSync(menu[6]);
    }

    moveArrow (position){
        switch (position){
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

    display (menu) {
        switch (menu.length-1) {
            case 1:
                this.#display1items(menu);
                break;
            case 3:
                this.#display3items(menu);
                break;
            case 4:
                this.#display4items(menu);
                break;
            case 5:
                this.#display5items(menu);
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