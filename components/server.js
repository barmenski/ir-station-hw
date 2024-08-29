const http = require("http");
const fs = require("fs");
var path = require("path");
const PORT = process.env.PORT || 8080;
const { Server } = require("socket.io");

class ServerHttp {
  http = http;
  data = null;
  socket1 = null;


  constructor() {

  }

  start() {
    function handler(request, response) {
      request.on("error", (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
      });
      response.on("error", (err) => {
        console.error(err);
        response.end();
      });
      if (request.url === "/") {
        var indexPath = path.join(__dirname, "/src/index.html");
        fs.readFile(indexPath, "UTF-8", (err, html) => {
          if (err) {
            console.log("Error of open index.html: " + err);
          }
          response.statusCode = 200;
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(html);
        });
      } else if (request.url.match(".css$")) {
        var cssPath = path.join(__dirname, "src", request.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        response.writeHead(200, { "Content-Type": "text/css" });
        fileStream.pipe(response);
      } else if (request.url.match(".(woff(2)?|eot|ttf|otf)$")) {
        var fontPath = path.join(__dirname, "src", request.url);
        var fileStream = fs.createReadStream(fontPath);
        response.writeHead(200, { "Content-Type": "font" });
        fileStream.pipe(response);
      } else if (request.url.match(".ico$")) {
        var favPath = path.join(__dirname, "src", request.url);
        var fileStream = fs.createReadStream(favPath);
        response.writeHead(200, { "Content-Type": "image/x-icon" });
        fileStream.pipe(response);
      } else if (request.url.match(".(svg|jpg|png)$")) {
        var imgPath = path.join(__dirname, "src", request.url);
        var fileStream = fs.createReadStream(imgPath);
        response.writeHead(200, { "Content-Type": "image/svg+xml" });
        fileStream.pipe(response);
      } else if (request.url.match(".js$")) {
        var jsPath = path.join(__dirname, "src", request.url);
        var fileStream = fs.createReadStream(jsPath, "UTF-8");
        response.writeHead(200, { "Content-Type": "text/javascript" });
        fileStream.pipe(response);
      } else {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end("No Page Found");
      }
    }
    this.socketId = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/socketId.json"), (err, data) => {
        if (err) throw err;
        return data;
      })
    );

    this.server = this.http.createServer(handler);

    this.server.listen(PORT, () => {
      console.log(`Webserver started on :${PORT}`);
    });

    process.on("SIGINT", function () {
      console.log("\nWebserver closed");
      process.exit();
    });
    console.log("this.server: "+ this.server);
    //this.io = new Server(this.server);
    return this.server;
/*
    

    const onConnection = (socket) => {
      //const sockets = await this.io.fetchSockets();
      console.log("a user connected");
      this.socket1 = socket;
      console.log("this.socket1: "+this.socket1.id);
      this.socketId.socket.id = socket.id;
      fs.writeFile(
        path.join(__dirname, "/socketId.json"),
        JSON.stringify(this.socketId),
        (err) => {
          if (err) console.log(err);
          else {
            console.log("socketId.json written successfully");
          }
        }
      );
        console.log("Data Message: ", "hello");
       // socket.emit("data1", socket);
        socket.emit("data", "hello");
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    };

    this.io.on("connection", onConnection); 
*/

  }

  sendData(data) {

    console.log("sendData data: " + data);
    this.socketId = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/socketId.json"), (err, fsData) => fsData)
    );
    this.socket1 = this.socketId;
    console.log("this.socket1: "+this.socket1.socket.id);
    //this.socket1.emit("data", data);
  }

  // sendData(data) {
  //   console.log("sendData data: "+data);
  //   this.io = new Server(this.server);
  //   this.io.on('connection', (socket) => {
  //     socket.emit('data', data);
  //     console.log("WS data: "+data);
  //   });
  // }

}
module.exports = ServerHttp;
