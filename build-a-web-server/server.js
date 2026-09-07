import http from "http";
import { join, extname } from "path";
import { readFile } from "fs";

const server = http.createServer((request, response) => {
  const url = request.url === "/" ? "/index.html" : request.url; // if request equals "/", then url = "/index.html" otherwise url = request.url
  const filePath = join("public", url);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".png": "image/png",
    ".js": "text/javascript",
  };

  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  readFile(filePath, (error, file) => { // tries to read the actual file from disk
    if (error) { // if it errors (file doesn't exist) 
      readFile("public/404.html", (error, file) => { // we read 404.html instead, 
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(file, "utf-8");
      });
      return; // this stops the function
    }
    response.writeHead(200, { "Content-Type": contentType }); // if it succeeds, we send status 200 with contentType, then send actual file's content as response body
    response.end(file, "utf-8");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));