const Thermometer = require('./components/thermometer');
const PID = require('./components/pid');
const process = require('process');
const Menu = require('./components/menu');

const menu = new Menu();
// const therm = new Thermometer();
// const pid = new PID({
// 	k_p: 1,
// 	k_i: 1,
// 	k_d: 1,
// 	dt: 1,
//   })

// const pinClk = 13;
// const pinDt = 14;
// const pinSwitch = 12;
// let inc = 0;

// const rotary = new Rotary(pinClk, pinDt, pinSwitch);

// const pidWork = async ()=> {
// 	/*getTemperature();
//     delta = Number((tempChip - prevTemp).toFixed(2));
//           pid.setTarget(
//             targetTemp,
//             1,
//             1,
//             1
//           );
//     targetTemp = targetTemp + rise;*/
//  await therm.sleep(1000);
// }

// rotary.on("rotate", async (delta) => {
// 	if(Number(delta)>0){
// 		inc = inc + Number(delta);
// 		console.log(inc);
// 	} else {
// 		let res = await therm.measure();
// 		console.log(res);
// 	};
// });
// rotary.on("pressed",  async() => {
// 	console.log("Rotary switch pressed");
// 	therm.stop();
	
// });
// rotary.on("released", () => {
// 	console.log("Rotary switch release");
// });

process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  process.exit();
});
