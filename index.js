const process = require("process");
const Menu = require("./components/menu");
const Server = require("./components/server");

const menu = new Menu();
const server = new Server();

menu.start();
server.start();

process.on("SIGINT", function () {
  console.log("\nir-station-hw closed");
  process.exit();
});
