# WebGL 3D Viewer - Standalone Preview

A standalone WebGL-based 3D viewer for STL files that runs directly in the browser.

## Running the Preview

### Option 1: Development Server (Recommended)

For full WebGL rendering with the complete 3D pipeline:

```bash
cd /workspaces/obsidian-3d-viewer
node dev-server.mjs
```

Then open `http://localhost:3001` in your browser.

### Option 2: VS Code Run and Debug

1. Open the Run and Debug panel (Ctrl+Shift+D)
2. Select "WebGL Preview Server" from the dropdown
3. Click the green play button or press F5
4. The server will start and automatically open in your browser

### Option 3: Self-Contained HTML (Codespace Compatible)

For basic STL loading without full 3D rendering (works in restricted environments):

Open `standalone.html` directly in your browser. This version:
- Loads STL files and parses them
- Shows file information
- Tests WebGL availability
- Works without a local server

## Features

- **File Upload**: Load STL files directly from your computer
- **WebGL Rendering**: Hardware-accelerated 3D rendering (server version)
- **Default Cube**: Built-in cube model for testing
- **Responsive**: Adapts to window size
- **Cross-platform**: Works on any modern browser with WebGL support

## Supported Formats

- **Binary STL**: Standard binary STL files (.stl)
- **ASCII STL**: Text-based STL files (.stl)

## Browser Requirements

- Modern browser with WebGL support
- Recommended: Chrome, Firefox, Safari, Edge

## Troubleshooting

### Port Already in Use

If you see "Error: listen EADDRINUSE":
```bash
# Kill any existing dev servers
pkill -f "node dev-server.mjs"

# Or find and kill the specific process
lsof -i :3001
kill <PID>
```

### WebGL Not Supported Error

If you see "WebGL not supported":
1. Try a different browser (Chrome recommended)
2. Update your browser to the latest version
3. Enable hardware acceleration in browser settings
4. Check if your graphics drivers are up to date

### Codespace Issues

In GitHub Codespaces:
1. Use the `standalone.html` file for basic functionality
2. For full 3D rendering, ensure port 3001 is forwarded
3. Check browser console (F12) for WebGL errors

### VS Code Debugger Issues

If the Run and Debug doesn't work:
1. Make sure you're in the correct workspace
2. Try running `npm run preview` from the terminal
3. Check that Node.js is properly installed
4. Restart VS Code if needed

## Development

The viewer consists of:
- `dev.html`: Full WebGL interface with server
- `standalone.html`: Self-contained version for codespaces
- `src/webgl.ts`: WebGL rendering engine
- `src/init-buffer.ts`: Buffer initialization for geometry
- `src/draw.ts`: Scene drawing functions

## Testing

A test cube file `test-cube.stl` is included for verification.