const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');
const Rotary = require('raspberrypi-rotary-encoder');





rotary.on("rotate", (delta) => {
	console.log("Rotation :"+delta);
});
rotary.on("pressed", () => {
	console.log("Rotary switch pressed");
});
rotary.on("released", () => {
	console.log("Rotary switch release");
});

class Menu {
    constructor () {
        this.lcd = new LCD(1, 0x27, 16, 2);
        this.lcd.beginSync();

        const CS = '4';
        const SCK = '24';
        const SO = ['25', '12'];
        const UNIT = 1;
        this.max6675 = new Max6675();
        this.max6675.setPin(CS, SCK, SO, UNIT);

        const pinClk = 13;
        const pinDt = 14;
        const pinSwitch = 12;
        this.rotary = new Rotary(pinClk, pinDt, pinSwitch);

        this.currMenu = null;
        this.arrow = 0;
    }
}

let startMenu = ["Hello!"];
let mainMenu = ["Pb-", "Pb+", "Const", "Dimmer", "T"];
let pbMinusMenu = ["Start", "Profile01", "Back"];
let pbPlusMenu = ["Start", "Profile01", "Back"];
let workPbMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
let stayPbMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "paus"];
let pausePbMenu = ["Pause", "Stop", "Back"];
let resumePbMenu = ["Resume", "Stop", "Back"];



this.rotary.on("rotate", (delta) => {
    switch (this.currMenu) {
        case workPbMenu:
            this.currMenu = pausePbMenu;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(mainMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(mainMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(mainMenu[2]);
            break;
        case stayPbMenu:
            this.currMenu = resumePbMenu;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(resumePbMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(resumePbMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(resumePbMenu[2]);
            break;
        case startMenu:
            break;
        case null:
            break;
        default:
            this.arrow = this.arrow + delta;
            if(this.arrow>this.currMenu.length-1) {
                this.arrow = 0;
            }
            switch (this.arrow){
                case 0:
                    this.lcd.setCursorSync(0, 0);
                    this.lcd.printSync(">");
                    this.lcd.setCursorSync(0, 1);
                    this.lcd.printSync(" ");
                    this.lcd.setCursorSync(7, 0);
                    this.lcd.printSync(" ");
                    this.lcd.setCursorSync(7, 1);
                    this.lcd.printSync(" ");
                    this.lcd.setCursorSync(13, 0);
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
                    this.lcd.setCursorSync(13, 0);
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
                    this.lcd.setCursorSync(13, 0);
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
                    this.lcd.setCursorSync(13, 0);
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
                    this.lcd.setCursorSync(13, 0);
                    this.lcd.printSync(">");
                break;
            }

    }
	console.log("Rotation :"+delta);
});

this.rotary.on("pressed", () => {
    switch (this.currMenu) {
        case null:
            this.currMenu = startMenu;
            this.arrow = 0;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(5, 0);
            this.lcd.printSync(startMenu[0]);
            break;
        case startMenu:
            this.currMenu = mainMenu;
            this.arrow = 0;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(mainMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(mainMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(mainMenu[2]);
            this.lcd.setCursorSync(8, 1);
            this.lcd.printSync(mainMenu[3]);
    
            this.lcd.setCursorSync(14, 0);
            this.lcd.printSync(mainMenu[4]);

        case mainMenu:
            switch (this.arrow){
                case 0:
                    this.currMenu = pbMinusMenu;
                    this.arrow = 0;
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(pbMinusMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(pbMinusMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(pbMinusMenu[2]);
                    break;
                case 1:
                    this.currMenu = pbPlusMenu;
                    this.arrow = 0;``
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(pbPlusMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(pbPlusMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(pbPlusMenu[2]);
                    break;
            }
            break;
    }
	console.log("Rotary switch pressed");
});




module.exports = Menu;