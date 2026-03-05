function initBuffers(gl: WebGLRenderingContext, vertices: number[], indices: number[]) {
    const positionBuffer = initPositionBuffer(gl, vertices);
    const indexBuffer = initIndexBuffer(gl, indices);
    
    return {
        position: positionBuffer,
        indices: indexBuffer,
    };
}

function initPositionBuffer(gl: WebGLRenderingContext, positions: number[]) {
    // Create a buffer for the positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the shape.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initIndexBuffer(gl: WebGLRenderingContext, indices: number[]) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}

export { initBuffers };
