import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

const server = http.createServer((req, res) => {
	console.log(`Request: ${req.method} ${req.url}`);
	let filePath = path.join(__dirname, req.url === "/" ? "dev.html" : req.url);
	console.log(`Serving file: ${filePath}`);
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
			console.error(`Error reading file ${filePath}:`, error);
			if (error.code === "ENOENT") {
				res.writeHead(404, { "Content-Type": "text/html" });
				res.end("<h1>404 - File not found</h1>", "utf-8");
			} else {
				res.writeHead(500);
				res.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
			}
		} else {
			console.log(`Serving ${filePath} (${content.length} bytes)`);
			res.writeHead(200, { "Content-Type": contentType });
			res.end(content, "utf-8");
		}
	});
});

server.listen(PORT, () => {
	console.log(`🚀 Dev server running at http://localhost:${PORT}`);
	console.log("Press Ctrl+C to stop.");
});
