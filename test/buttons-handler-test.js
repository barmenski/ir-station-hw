const Menu = require("./components/menu");
const process = require("process");
const rpio = require('rpio');
const { POLL_LOW, POLL_HIGH } = require('rpio');

let options = {
    gpiomem: false,
    mapping: 'physical',
    mock: undefined,
    close_on_exit: true
    }
let button1 = 36;
let button2 = 38;
let button3 = 40;
let led1 = 35;
let led2 = 37;

rpio.init(options);
const menu = new Menu();
rpio.open(button1, rpio.INPUT, rpio.PULL_UP);
rpio.open(button2, rpio.INPUT, rpio.PULL_UP);
rpio.open(button3, rpio.INPUT, rpio.PULL_UP);
rpio.open(led1, rpio.OUTPUT, rpio.LOW);
rpio.open(led2, rpio.OUTPUT, rpio.LOW);
	
function pollcb1 (){
    rpio.msleep(20);
    if (rpio.read(button1) == 0 ) {
        console.log("b1");
        //menu.start();
        rpio.write(led2, rpio.HIGH);
        } else {
            rpio.write(led2, rpio.LOW);
        }
}

function pollcb2 (){
    rpio.msleep(20);
    if (rpio.read(button2) == 0 ) {
        console.log("b2");
        //menu.start();
        rpio.write(led1, rpio.HIGH);
        } else {
            rpio.write(led1, rpio.LOW);
        }
}

function pollcb3 (){
    rpio.msleep(20);
    if (rpio.read(button3) == 0 ) {
        console.log("b3");
        //menu.start();
        rpio.write(led1, rpio.HIGH);
        rpio.write(led2, rpio.HIGH);
        } else {
            rpio.write(led1, rpio.LOW);
            rpio.write(led2, rpio.LOW);
        }
}
rpio.poll(button1, pollcb1);
rpio.poll(button2, pollcb2);
rpio.poll(button3, pollcb3);

	



function stop() {
    rpio.poll(button1, null);
    rpio.poll(button2, null);
    rpio.poll(button3, null);
    rpio.close(led1, rpio.PIN_RESET);
    rpio.close(led2, rpio.PIN_RESET);
};
	


process.on('exit', function() {
    stop();
    /* Insert any custom cleanup code here. */
    rpio.exit();
});
