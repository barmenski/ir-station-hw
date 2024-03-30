const process = require("process");
const Menu = require("./components/menu");

const menu = new Menu();

menu.start();

process.on("SIGINT", function () {
  console.log("\nir-station-hw closed");
  process.exit();
});
