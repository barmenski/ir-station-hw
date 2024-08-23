const http = require("http");
const fs = require("fs");
var path = require("path");
const PORT = process.env.PORT || 8080;

const { Server } = require("socket.io");

class ServerHttp {
  http = http;

  constructor() {}

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

    const server = this.http.createServer(handler);

    server.listen(PORT, () => {
      console.log(`Webserver started on :${PORT}`);
    });
    const io = new Server(server);
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    process.on("SIGINT", function () {
      console.log("\nWebserver closed");
      process.exit();
    });
  }
}
module.exports = ServerHttp;
