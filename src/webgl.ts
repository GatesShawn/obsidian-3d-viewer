import { glMatrix } from "gl-matrix";
import { initBuffers } from "init-buffer";
import { drawScene } from "draw";

// Exported entry point. Accepts a DOM canvas element and optional geometry data to render.
// If no geometry provided, renders a default cube.
export function main(canvas: HTMLCanvasElement, vertices?: number[], indices?: number[]) {
    // Default cube geometry
    const defaultVertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    const defaultIndices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9, 10,     8, 10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    // Use provided geometry or defaults
    const verts = vertices || defaultVertices;
    const inds = indices || defaultIndices;
    // Use the provided canvas
    if (!canvas) {
        console.warn("No canvas provided for WebGL");
        return;
    }

    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
// Initialize a shader program; this is where all the lighting for the vertices and so forth is established.
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

if (shaderProgram === null) {
    alert("Unable to initialize shader program.");
    return;
}

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using for a VertexPosition and look up uniform locations.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

// Here's where we call the routine that builds all the
// objects we'll be drawing.
const buffers = initBuffers(gl, verts, inds);

// Draw the scene
// note: this draws once; if you need animation you would re-call from a requestAnimationFrame loop
drawScene(gl, programInfo, buffers);
}

// Vertex shader program
export const vsSource = `
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;
    
export const fsSource = `
#ifdef GL_ES
precision mediump float;
#endif
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (vertexShader === null || fragmentShader === null) {
        return null;
    }

    // Create the shader program
    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) {
        alert("Unable to create shader program.");
        return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and compiles it.
//
export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    if (shader === null) {
        alert("Unable to create shader.");
        return null;
    }
    gl.shaderSource(shader, source);
    
    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

