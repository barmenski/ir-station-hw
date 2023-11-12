const Thermometer = require('./therm-menu');
const PbMinus = require('./pbMinus-menu');
const DisplayLCD = require('./displayLCD');


const Rotary = require('raspberrypi-rotary-encoder');

class Menu {
        rotary = new Rotary(13, 14, 12);//(pinClk, pinDt, pinSwitch);
        thermometer = new Thermometer();
        pbMinus = new PbMinus();
        displayLCD = new DisplayLCD();
        
    constructor () {
        this.currMenu = [""];
        this.arrow = 0;
    }

    
    init = ()=>{
        let startMenu = ["startMenu", "Hello!"];
        let mainMenu = ["mainMenu", "Pb-", "Pb+", "Const", "Dimmer", "T"];
        let pbMinusMenu = ["pbMinusMenu", "Start", "Pr01", "Back"];//name of profile: max 6 symbols
        let pbPlusMenu = ["pbPlusMenu", "Start", "Pr01", "Back"];//name of profile: max 6 symbols
        let workPbMinusMenu = ["workPbMinusMenu", "t=000", "t=000", "P=000%", "P=000%", "pt1", "run"];
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
        let thermMenu = ["thermMenu", "t=000", "t=000", "C", "C"];

        this.rotary.on("rotate", async (delta) => {
            switch (this.currMenu[0]) {
                case "":
                    this.displayLCD.display(startMenu);
                    break;
                case "startMenu":
                    this.displayLCD.display(mainMenu);
                    break;
                case "workPbMinusMenu"://display pause menu
                    this.pbMinus.pause();
                    //start constant temp mode
                    this.displayLCD.display(pausePbMinusMenu);
                    break;
                case "workPbPlusMenu"://display pause menu
                    this.displayLCD.display(pausePbPlusMenu);
                    break;
                case "workConstMenu"://display pause menu
                    this.displayLCD.display(pauseConstMenu);
                    break;
                case "workDimmerMenu"://display pause menu
                    this.displayLCD.display(pauseDimmerMenu);
                    break;
                case "stayPbMinusMenu"://display resume menu
                    this.displayLCD.display(resumePbMinusMenu);
                    break;
                case "stayPbPlusMenu"://display resume menu
                    this.displayLCD.display(resumePbPlusMenu);
                    break;
                case "stayConstMenu":
                    this.displayLCD.display(resumeConstMenu);
                    break;
                case "stayDimmerMenu":
                    this.displayLCD.display(resumeDimmerMenu);
                    break;
                case "thermMenu":
                    this.thermometer.stop();
                    
                    break;
                default:
                    this.arrow = this.arrow + delta;
                    if(this.arrow>(this.currMenu.length-2)) {
                        this.arrow = 0;
                    }
                    if(this.arrow<0) {
                        this.arrow = this.currMenu.length-2;
                    }

                    this.displayLCD.moveArrow(this.arrow);
                    

            }
        });

        this.rotary.on("pressed", async () => {
            switch (this.currMenu[0]) {
                case "":
                    this.displayLCD.display(startMenu);
                    break;
                case "startMenu":
                    this.displayLCD.display(mainMenu);
                    break;
                case "mainMenu":
                    switch (this.arrow){
                        case 0://>Pb- pressed
                            this.displayLCD.display(pbMinusMenu);
                            break;
                        case 1://>Pb+ pressed
                            this.displayLCD.display(pbPlusMenu);
                            break;
                        case 2://>Const pressed
                            this.displayLCD.display(constMenu);
                            break;
                        case 3://>Dimmer pressed
                            this.displayLCD.display(dimmerMenu);
                            break;
                        case 4://>T pressed
                            this.currMenu=thermMenu;
                            await this.thermometer.measure();//waiting for measuring process
                            this.displayLCD.display(mainMenu);//display mainMenu after this.therm.stop();
                            break;
                    }
                    break;
                    case "pbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                //this.displayLCD.display(workPbMinusMenu);
                                this.currMenu=pbMinusMenu;
                                this.pbMinus.displayTitles();
                                await this.pbMinus.start();
                                this.displayLCD.display(mainMenu);//display mainMenu after this.pbMinus.stop();
                                break;
                            case 1://>Profile01 pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                            this.displayLCD.display(mainMenu);
                                break;
                        }
                        break;
                    case "pbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.displayLCD.display(workPbPlusMenu);
                                break;
                            case 1://>Profile01 pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(mainMenu);
                                break;
                        }
                        break;
                    case "constMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.displayLCD.display(workConstMenu);
                                break;
                            case 1://>t=200 pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 3://>Dur=120 pressed
                                //temporary block
                                break;
                        }
                        break;
                    case "dimmerMenu":
                        switch (this.arrow) {
                            case 0://>Start pressed
                                this.displayLCD.display(workDimmerMenu);
                                break;
                            case 1://>P=000% pressed
                                //temporary block
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 3://>Dur=120 pressed
                                //temporary block
                                break;
                        }
                        break;
                    case "pausePbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.displayLCD.display(stayPbMinusMenu);
                                break;
                            case 1://>Stop pressed
                                //this.displayLCD.display(mainMenu);
                                this.pbMinus.stop();
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(workPbMinusMenu);
                                break;
                        }
                        break;
                    case "pausePbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.displayLCD.display(stayPbPlusMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(workPbPlusMenu);
                                break;
                        }
                        break;
                    case "pauseConstMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.displayLCD.display(stayConstMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(workConstMenu);
                                break;
                        }
                        break;
                    case "pauseDimmerMenu":
                        switch (this.arrow) {
                            case 0://>Pause pressed
                                this.currMenu = stayDimmerMenu;
                                this.displayLCD.display(stayDimmerMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(workDimmerMenu);
                                break;
                        }
                        break;
                    case "resumePbMinusMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.displayLCD.display(workPbMinusMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(stayPbMinusMenu);
                                break;
                        }
                        break;
                    case "resumePbPlusMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.displayLCD.display(workPbPlusMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(stayPbPlusMenu);
                                break;
                        }
                        break;
                    case "resumeConstMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.displayLCD.display(workConstMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(stayConstMenu);
                                break;
                        }
                        break;
                    case "resumeDimmerMenu":
                        switch (this.arrow) {
                            case 0://>Resume pressed
                                this.displayLCD.display(workDimmerMenu);
                                break;
                            case 1://>Stop pressed
                                this.displayLCD.display(mainMenu);
                                break;
                            case 2://>Back pressed
                                this.displayLCD.display(stayDimmerMenu);
                                break;
                        }
                        break;
                    default:
                        break;
            }
	        console.log("Rotary switch pressed. this.currMenu[0]: " + this.currMenu[0]+" .this: " + this.toString());
        });
    }
}



module.exports = Menu;