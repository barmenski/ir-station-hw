const process = require('process');
const Menu = require('./components/menu');

const menu = new Menu();
// (async ()=>{
//   await menu.start();
// })();

menu.start();
console.log("index.js close");

process.on('SIGINT', function () {
  console.log('\nir-station-hw closed');
  process.exit();
});
