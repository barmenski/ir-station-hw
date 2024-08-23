const process = require("process");
const Menu = require("./components/menu");
const ServerHttp = require("./components/server");

const menu = new Menu();
const server = new ServerHttp();

menu.start();
server.start();

process.on("SIGINT", function () {
  console.log("\nir-station-hw closed");
  process.exit();
});
