const process = require("process");
const Menu = require("./components/menu");
const ServerHttp = require("./components/server");

const menu = new Menu();
const server = new ServerHttp();

const serv = server.start();
console.log("serv: "+ serv);
menu.start(serv);
//server.start();

process.on("SIGINT", function () {
  console.log("\nir-station-hw closed");
  process.exit();
});
