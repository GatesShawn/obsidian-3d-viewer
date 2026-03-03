import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
	let filePath = path.join(__dirname, req.url === "/" ? "dev.html" : req.url);
	const extname = String(path.extname(filePath)).toLowerCase();
	const mimeTypes = {
		".html": "text/html",
		".js": "text/javascript",
		".css": "text/css",
		".json": "application/json",
		".png": "image/png",
		".jpg": "image/jpg",
		".gif": "image/gif",
	};

	const contentType = mimeTypes[extname] || "application/octet-stream";

	fs.readFile(filePath, (error, content) => {
		if (error) {
			if (error.code === "ENOENT") {
				res.writeHead(404, { "Content-Type": "text/html" });
				res.end("<h1>404 - File not found</h1>", "utf-8");
			} else {
				res.writeHead(500);
				res.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
			}
		} else {
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
});

server.listen(PORT, () => {
	console.log(`🚀 Dev server running at http://localhost:${PORT}`);
	console.log("Press Ctrl+C to stop.");
});
