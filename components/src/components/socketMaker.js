const { Server } = require("socket.io");

class SocketMaker {
  constructor() {}

  init(server) {
    this.io = new Server(server);

    const onConnection = (socket) => {
      console.log("a user connected");
      console.log("Socket server: " + socket.id);
      socket.join("barmenski room");
      socket.on("disconnect", () => {
        socket.leave("barmenski room");
        console.log("user disconnected");
      });
    };
    this.io.on("connection", onConnection);
    this.io.to("barmenski room").emit("data", "hello room!");

    process.on("SIGINT", function () {
      console.log("\nWebserver closed");
      process.exit();
    });
  }

  send(data) {
    this.io.to("barmenski room").emit("data", data);
  }
}
module.exports = SocketMaker;
