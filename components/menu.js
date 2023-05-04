const LCD = require('raspberrypi-liquid-crystal');
const Max6675 = require('max6675-raspi');
const Rotary = require('raspberrypi-rotary-encoder');

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

        this.currMenu = [""];
        this.arrow = 0;
    }

    display1items = (menu)=>{
        this.currMenu = menu;
        this.arrow = 0;
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">");

        this.lcd.setCursorSync(5, 0);
        this.lcd.printSync(this.currMenu[1]);
    }

    display3items = (menu)=>{
        this.currMenu = menu;
        this.arrow = 0;
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">")

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(this.currMenu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(this.currMenu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(this.currMenu[3]);
    }

    display4items = (menu)=>{
        this.currMenu = menu;
        this.arrow = 0;
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">")

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(this.currMenu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(this.currMenu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(this.currMenu[3]);
        this.lcd.setCursorSync(8, 1);
        this.lcd.printSync(this.currMenu[4]);
    }

    display5items = (menu)=>{
        this.currMenu = menu;
        this.arrow = 0;
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">")

        this.lcd.setCursorSync(1, 0);
        this.lcd.printSync(this.currMenu[1]);
        this.lcd.setCursorSync(1, 1);
        this.lcd.printSync(this.currMenu[2]);

        this.lcd.setCursorSync(8, 0);
        this.lcd.printSync(this.currMenu[3]);
        this.lcd.setCursorSync(8, 1);
        this.lcd.printSync(this.currMenu[4]);

        this.lcd.setCursorSync(14, 0);
        this.lcd.printSync(this.currMenu[5]);
    }

    display6items = (menu)=>{
        this.currMenu = menu;
        this.arrow = 0;
        this.lcd.clearSync();
        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(">")

        this.lcd.setCursorSync(0, 0);
        this.lcd.printSync(this.currMenu[1]);
        this.lcd.setCursorSync(0, 1);
        this.lcd.printSync(this.currMenu[2]);

        this.lcd.setCursorSync(6, 0);
        this.lcd.printSync(this.currMenu[3]);
        this.lcd.setCursorSync(6, 1);
        this.lcd.printSync(this.currMenu[4]);

        this.lcd.setCursorSync(13, 0);
        this.lcd.printSync(this.currMenu[5]);
        this.lcd.setCursorSync(13, 1);
        this.lcd.printSync(this.currMenu[6]);
    }

    init = ()=>{
        let startMenu = ["startMenu", "Hello!"];
        let mainMenu = ["mainMenu", "Pb-", "Pb+", "Const", "Dimmer", "T"];
        let pbMinusMenu = ["pbMinusMenu", "Start", "Pr01", "Back"];//name of profile: max 6 symbols
        let pbPlusMenu = ["pbPlusMenu", "Start", "Pr01", "Back"];//name of profile: max 6 symbols
        let workPbMinusMenu = ["workPbMinus", "t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
        let stayPbMinusMenu = ["stayPbMinusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "Zzz"];
        let workPbPlusMenu = ["workPbPlusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
        let stayPbPlusMenu = ["stayPbPlusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "Zzz"];
        let pausePbMinusMenu = ["pausePbMinusMenu", "Pause", "Stop", "Back"];
        let resumePbMinusMenu = ["resumePbMinusMenu", "Resume", "Stop", "Back"];
        let pausePbPlusMenu = ["pausePbPlusMenu", "Pause", "Stop", "Back"];
        let resumePbPlusMenu = ["resumePbPlusMenu", "Resume", "Stop", "Back"];
        let constMenu = ["constMenu", "Start", "t=200", "Back", "Dur=120"];
        let dimmerMenu = ["dimmerMenu", "Start", "P=000%", "Back", "Dur=120"]
        let workConstMenu = ["workConstMenu", "t=000", "t=000", "P=000%", "P=000%", "120", "*C"];
        let workDimmerMenu = ["workDimmerMenu", "t=000", "t=000", "P=000%", "P=000%", "120", "*D"];
        let stayConstMenu = ["stayConstMenu", "t=000", "t=000", "P=000%", "P=000%", "200", "Zzz"];
        let stayDimmerMenu = ["stayDimmerMenu", "t=000", "t=000", "P=000%", "P=000%", "200", "Zzz"];
        let pauseConstMenu = ["pauseConstMenu", "Pause", "Stop", "Back"];
        let resumeConstMenu = ["resumeConstMenu", "Resume", "Stop", "Back"];
        let pauseDimmerMenu = ["pauseDimmerMenu", "Pause", "Stop", "Back"];
        let resumeDimmerMenu = ["resumeDimmerMenu", "Resume", "Stop", "Back"];
        let termMenu = ["termMenu", "t=000", "t=000", "C", "C"];

        this.rotary.on("rotate", (delta) => {
            switch (this.currMenu[0]) {
                case "":
                    this.display1items(startMenu);
                    break;
                case "startMenu":
                case "termMenu":
                    this.display5items(mainMenu);
                    break;
                case "workPbMinusMenu"://display pause menu
                    this.display3items(pausePbMinusMenu);
                    break;
                case "workPbPlusMenu"://display pause menu
                    this.display3items(pausePbPlusMenu);
                    break;
                case "workConstMenu"://display pause menu
                    this.display3items(pauseConstMenu);
                    break;
                case "workDimmerMenu"://display pause menu
                    this.display3items(pauseDimmerMenu);
                    break;
                case "stayPbMinusMenu"://display resume menu
                    this.display3items(resumePbMinusMenu);
                    break;
                case "stayPbPlusMenu"://display resume menu
                    this.display3items(resumePbPlusMenu);
                    break;
                case "stayConstMenu":
                    this.display3items(resumeConstMenu);
                    break;
                case "stayDimmerMenu":
                    this.display3items(resumeDimmerMenu);
                    break;
                default:
                    this.arrow = this.arrow + delta;
                    if(this.arrow>(this.currMenu.length-1)) {
                        this.arrow = 0;
                    }
                    if(this.arrow<0) {
                        this.arrow = this.currMenu.length-1;
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
            console.log("this.arrow :" + this.arrow + " this.currMenu[0]: " + this.currMenu[0]);
        });

        this.rotary.on("pressed", () => {
            switch (this.currMenu[0]) {
                case "":
                    this.display1items(startMenu);
                    break;
                case "startMenu":
                    this.display5items(mainMenu);
                    break;
                case "mainMenu":
                    switch (this.arrow){
                        case 0://>Pb- pressed
                            this.display3items(pbMinusMenu);
                            break;
                        case 1://>Pb+ pressed
                            this.display3items(pbPlusMenu);
                            break;
                        case 2://>Const pressed
                            this.display4items(constMenu);
                            break;
                        case 3://>Dimmer pressed
                            this.display4items(dimmerMenu);
                            break;
                        case 4://>T pressed
                            this.display4items(termMenu);
                            break;
                    }
                    break;
                    case "pbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.display6items(workPbMinusMenu);
                                break;
                            case 1://>Profile01 pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                            this.display5items(mainMenu);
                                break;
                        }
                        break;
                    case "pbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.display6items(workPbPlusMenu);
                                break;
                            case 1://>Profile01 pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                                this.display5items(mainMenu);
                                break;
                        }
                        break;
                    case "constMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.display6items(workConstMenu);
                                break;
                            case 1://>t=200 pressed
                                //temporary block
                                break;
                            case 2://>Dur=120 pressed
                                //temporary block
                                break;
                            case 3://>Back pressed
                                this.display5items(mainMenu);
                                break;
                        }
                        break;
                    case "dimmerMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.display6items(workDimmerMenu);
                                break;
                            case 1://>P=000% pressed
                                //temporary block
                                break;
                            case 2://>Dur=120 pressed
                                //temporary block
                                break;
                            case 3://>Back pressed
                                this.display5items(mainMenu);
                                break;
                        }
                        break;
                    case "pausePbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.display6items(stayPbMinusMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(workPbMinusMenu);
                                break;
                        }
                        break;
                    case "pausePbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.display6items(stayPbPlusMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(workPbPlusMenu);
                                break;
                        }
                        break;
                    case "pauseConstMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.display6items(stayConstMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(workConstMenu);
                                break;
                        }
                        break;
                    case "pauseDimmerMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.currMenu = stayDimmerMenu;
                                this.display6items(stayDimmerMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(workDimmerMenu);
                                break;
                        }
                        break;
                    case "resumePbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.display6items(workPbMinusMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(stayPbMinusMenu);
                                break;
                        }
                        break;
                    case "resumePbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.display6items(workPbPlusMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(stayPbPlusMenu);
                                break;
                        }
                        break;
                    case "resumeConstMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.display6items(workConstMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(stayConstMenu);
                                break;
                        }
                        break;
                    case "resumeDimmerMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.display6items(workDimmerMenu);
                                break;
                            case 1://>Stop pressed
                                this.display5items(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.display6items(stayDimmerMenu);
                                break;
                        }
                        break;
            }
	console.log("Rotary switch pressed. this.currMenu[0]: " + this.currMenu[0]+" .this: " + this.toString());
});

}
    }



module.exports = Menu;