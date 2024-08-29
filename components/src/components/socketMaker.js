const fs = require("fs");
var path = require("path");
const PORT = process.env.PORT || 8080;
const { Server } = require("socket.io");

class SocketMaker {
  constructor() {}

  start(server, data) {
    this.io = new Server(server);

    const onConnection = (socket) => {
      console.log("a user connected");
      console.log("this.socket1: " + socket.id);
      socket.emit("data1", data);
      socket.emit("data", "hello");
      socket.join('barmenski room');
      socket.on("disconnect", () => {
        socket.leave('barmenski room');
        console.log("user disconnected");
      });
    };
    this.io.on("connection", onConnection);
    this.io.to('barmenski room').emit("data", "hello room!");

    process.on("SIGINT", function () {
      console.log("\nWebserver closed");
      process.exit();
    });
  }

  send(data) {
    this.io.to('barmenski room').emit("data1", data);
    //socket.emit("data1", data);
  }
}
module.exports = SocketMaker;
