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

        // const pinClk = 13;
        // const pinDt = 14;
        // const pinSwitch = 12;
        // this.rotary = new Rotary(pinClk, pinDt, pinSwitch);

        this.currMenu = [];
        this.currMenuName = "";
        this.arrow = 0;
    }
}

let startMenu = ["Hello!"];
let mainMenu = ["Pb-", "Pb+", "Const", "Dimmer", "T"];
let pbMinusMenu = ["Start", "Profile01", "Back"];
let pbPlusMenu = ["Start", "Profile01", "Back"];
let workPbMinusMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
let stayPbMinusMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "paus"];
let workPbPlusMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
let stayPbPlusMenu = ["t=000", "t=000", "P=000%", "P=000%", "pt1", "paus"];
let pausePbMinusMenu = ["Pause", "Stop", "Back"];
let resumePbMinusMenu = ["Resume", "Stop", "Back"];
let pausePbPlusMenu = ["Pause", "Stop", "Back"];
let resumePbPlusMenu = ["Resume", "Stop", "Back"];
let constMenu = ["Start", "t=200", "Back", "Dur=120"];
let dimmerMenu = ["Start", "P=000%", "Back", "Dur=120"]
let workConstMenu = ["t=000", "t=000", "P=000%", "P=000%", "120", "*C"];
let workDimmerMenu = ["t=000", "t=000", "P=000%", "P=000%", "120", "*D"];
let stayConstMenu = ["t=000", "t=000", "P=000%", "P=000%", "200", "paus"];
let stayDimmerMenu = ["t=000", "t=000", "P=000%", "P=000%", "200", "paus"];
let pauseConstMenu = ["Pause", "Stop", "Back"];
let resumeConstMenu = ["Resume", "Stop", "Back"];
let pauseDimmerMenu = ["Pause", "Stop", "Back"];
let resumeDimmerMenu = ["Resume", "Stop", "Back"];

const pinClk = 13;
const pinDt = 14;
const pinSwitch = 12;
this.rotary = new Rotary(pinClk, pinDt, pinSwitch);

this.rotary.on("rotate", (delta) => {
    switch (this.currMenuName) {
        case "":
            this.currMenu = startMenu;
            this.currMenuName = "startMenu";
            this.arrow = 0;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(5, 0);
            this.lcd.printSync(this.currMenu[0]);
            break;
        case "startMenu":
            break;
        case "workPbMinusMenu"://display pause menu
            this.currMenu = pausePbMinusMenu;
            this.currMenuName = "pausePbMinusMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "workPbPlusMenu"://display pause menu
            this.currMenu = pausePbPlusMenu;
            this.currMenuName = "pausePbPlusMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "workConstMenu"://display pause menu
            this.currMenu = pauseConstMenu;
            this.currMenuName = "pauseConstMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "workDimmerMenu"://display pause menu
            this.currMenu = pauseDimmerMenu;
            this.currMenuName = "pauseDimmerMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "stayPbMinusMenu"://display resume menu
            this.currMenu = resumePbMinusMenu;
            this.currMenuName = "resumePbMinusMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "stayPbPlusMenu"://display resume menu
            this.currMenu = resumePbPlusMenu;
            this.currMenuName = "resumePbPlusMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "stayConstMenu":
            this.currMenu = resumeConstMenu;
            this.currMenuName = "resumeConstMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            break;
        case "stayDimmerMenu":
            this.currMenu = resumeDimmerMenu;
            this.currMenuName = "resumeDimmerMenu";
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
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
	console.log("this.arrow :" + this.arrow + " this.currMenuName: " + this.currMenuName);
});

this.rotary.on("pressed", () => {
    switch (this.currMenuName) {
        case "":
            this.currMenu = startMenu;
            this.currMenuName = "startMenu";
            this.arrow = 0;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(5, 0);
            this.lcd.printSync(this.currMenu[0]);
            break;
        case "startMenu":
            this.currMenu = mainMenu;
            this.currMenuName = "mainMenu";
            this.arrow = 0;
            this.lcd.clearSync();
    
            this.lcd.setCursorSync(1, 0);
            this.lcd.printSync(this.currMenu[0]);
            this.lcd.setCursorSync(1, 1);
            this.lcd.printSync(this.currMenu[1]);
    
            this.lcd.setCursorSync(8, 0);
            this.lcd.printSync(this.currMenu[2]);
            this.lcd.setCursorSync(8, 1);
            this.lcd.printSync(this.currMenu[3]);
    
            this.lcd.setCursorSync(14, 0);
            this.lcd.printSync(this.currMenu[4]);
            break;
        case "mainMenu":
            switch (this.arrow){
                case 0://>Pb- pressed
                    this.currMenu = pbMinusMenu;
                    this.currMenuName = "pbMinusMenu";
                    this.arrow = 0;
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(this.currMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(this.currMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(this.currMenu[2]);
                    break;
                case 1://>Pb+ pressed
                    this.currMenu = pbPlusMenu;
                    this.currMenuName = "pbPlusMenu";
                    this.arrow = 0;
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(this.currMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(this.currMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(this.currMenu[2]);
                    break;
                case 2://>Const pressed
                    this.currMenu = constMenu;
                    this.currMenuName = "constMenu";
                    this.arrow = 0;
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(this.currMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(this.currMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(this.currMenu[2]);
                    this.lcd.setCursorSync(8, 1);
                    this.lcd.printSync(this.currMenu[3]);
                    break;
                case 3://>Dimmer pressed
                    this.currMenu = dimmerMenu;
                    this.currMenuName = "dimmerMenu";
                    this.arrow = 0;
                    this.lcd.clearSync();

                    this.lcd.setCursorSync(1, 0);
                    this.lcd.printSync(this.currMenu[0]);
                    this.lcd.setCursorSync(1, 1);
                    this.lcd.printSync(this.currMenu[1]);
            
                    this.lcd.setCursorSync(8, 0);
                    this.lcd.printSync(this.currMenu[2]);
                    this.lcd.setCursorSync(8, 1);
                    this.lcd.printSync(this.currMenu[3]);
                    break;
                case 4://>T pressed
                    //for termometer
                    break;
            }
            break;
            case "pbMinusMenu":
                switch (this.arrow) {
                    case 0://>Start pressed
                        this.currMenu = workPbMinusMenu;
                        this.currMenuName = "workPbMinusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Profile01 pressed
                        //temporary block
                        break;
                    case 2://>Back pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                }
                break;
            case "pbPlusMenu":
                switch (this.arrow) {
                    case 0://>Start pressed
                        this.currMenu = workPbPlusMenu;
                        this.currMenuName = "workPbPlusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Profile01 pressed
                        //temporary block
                        break;
                    case 2://>Back pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                }
                break;
            case "constMenu":
                switch (this.arrow) {
                    case 0://>Start pressed
                        this.currMenu = workConstMenu;
                        this.currMenuName = "workConstMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>t=200 pressed
                        //temporary block
                        break;
                    case 2://>Dur=120 pressed
                        //temporary block
                        break;
                    case 3://>Back pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                }
                break;
            case "dimmerMenu":
                switch (this.arrow) {
                    case 0://>Start pressed
                        this.currMenu = workDimmerMenu;
                        this.currMenuName = "workDimmerMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>P=000% pressed
                        //temporary block
                        break;
                    case 2://>Dur=120 pressed
                        //temporary block
                        break;
                    case 3://>Back pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                }
                break;
            case "pausePbMinusMenu":
                switch (this.arrow) {
                    case 0://>Pause pressed
                        this.currMenu = stayPbMinusMenu;
                        this.currMenuName = "stayPbMinusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = workPbMinusMenu;
                        this.currMenuName = "workPbMinusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "pausePbPlusMenu":
                switch (this.arrow) {
                    case 0://>Pause pressed
                        this.currMenu = stayPbPlusMenu;
                        this.currMenuName = "stayPbPlusMenu;"
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = workPbPlusMenu;
                        this.currMenuName = "workPbPlusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "pauseConstMenu":
                switch (this.arrow) {
                    case 0://>Pause pressed
                        this.currMenu = stayConstMenu;
                        this.currMenuName = "stayConstMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = workConstMenu;
                        this.currMenuName = "workConstMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "pauseDimmerMenu":
                switch (this.arrow) {
                    case 0://>Pause pressed
                        this.currMenu = stayDimmerMenu;
                        this.currMenuName = "stayDimmerMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = workDimmerMenu;
                        this.currMenuName = "workDimmerMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "resumePbMinusMenu":
                switch (this.arrow) {
                    case 0://>Resume pressed
                        this.currMenu = workPbMinusMenu;
                        this.currMenuName = "workPbMinusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = stayPbMinusMenu;
                        this.currMenuName = "stayPbMinusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "resumePbPlusMenu":
                switch (this.arrow) {
                    case 0://>Resume pressed
                        this.currMenu = workPbPlusMenu;
                        this.currMenuName = "workPbPlusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = stayPbPlusMenu;
                        this.currMenuName = "stayPbPlusMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "resumeConstMenu":
                switch (this.arrow) {
                    case 0://>Resume pressed
                        this.currMenu = workConstMenu;
                        this.currMenuName = "workConstMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = stayConstMenu;
                        this.currMenuName = "stayConstMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
            case "resumeDimmerMenu":
                switch (this.arrow) {
                    case 0://>Resume pressed
                        this.currMenu = workDimmerMenu;
                        this.currMenuName = "workDimmerMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(13, 1);
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                    case 1://>Stop pressed
                        this.currMenu = mainMenu;
                        this.currMenuName = "mainMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();
                
                        this.lcd.setCursorSync(1, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(1, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(8, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(8, 1);
                        this.lcd.printSync(this.currMenu[3]);
                
                        this.lcd.setCursorSync(14, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        break;// ↑this duplicate from 160 line
                    case 2://>Back pressed
                        this.currMenu = stayDimmerMenu;
                        this.currMenuName = "stayDimmerMenu";
                        this.arrow = 0;
                        this.lcd.clearSync();

                        this.lcd.setCursorSync(0, 0);
                        this.lcd.printSync(this.currMenu[0]);
                        this.lcd.setCursorSync(0, 1);
                        this.lcd.printSync(this.currMenu[1]);
                
                        this.lcd.setCursorSync(6, 0);
                        this.lcd.printSync(this.currMenu[2]);
                        this.lcd.setCursorSync(6, 1);
                        this.lcd.printSync(this.currMenu[3]);

                        this.lcd.setCursorSync(13, 0);
                        this.lcd.printSync(this.currMenu[4]);
                        this.lcd.setCursorSync(12, 1);//12!
                        this.lcd.printSync(this.currMenu[5]);
                        break;
                }
                break;
    }
	console.log("Rotary switch pressed. this.currMenuName: "+this.currMenuName);
});




module.exports = Menu;