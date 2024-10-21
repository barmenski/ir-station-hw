const process = require("process");
const Menu = require("./components/menu/mainMenu");
const ServerHttp = require("./components/server");

const menu = new Menu();
const server = new ServerHttp();

const ioConnection = server.start();

menu.start(ioConnection);

process.on("SIGINT", function () {
  console.log("\nir-station-hw closed");
  process.exit();
});
