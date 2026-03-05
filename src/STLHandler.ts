export class STLHandler {
    /**
     * Parses STL file data and returns geometry information
     * @param data - The binary or ASCII STL file data
     * @returns Object containing vertices and indices arrays
     */
    static parseSTL(data: ArrayBuffer): { vertices: number[], indices: number[] } {
        const view = new DataView(data);
        
        // Check if it's binary STL (starts with solid for ASCII, or binary header)
        const header = new Uint8Array(data, 0, 80);
        const headerString = String.fromCharCode(...header).trim();
        
        if (headerString.startsWith('solid')) {
            // ASCII STL
            return this.parseASCIISTL(data);
        } else {
            // Binary STL
            return this.parseBinarySTL(data);
        }
    }

    private static parseBinarySTL(data: ArrayBuffer): { vertices: number[], indices: number[] } {
        const view = new DataView(data);
        const vertices: number[] = [];
        const indices: number[] = [];
        
        // Skip 80 byte header
        let offset = 80;
        
        // Read number of triangles (4 bytes, little endian)
        const numTriangles = view.getUint32(offset, true);
        offset += 4;
        
        for (let i = 0; i < numTriangles; i++) {
            // Skip normal vector (12 bytes)
            offset += 12;
            
            // Read 3 vertices (3 floats each = 36 bytes)
            for (let j = 0; j < 3; j++) {
                const x = view.getFloat32(offset, true);
                const y = view.getFloat32(offset + 4, true);
                const z = view.getFloat32(offset + 8, true);
                vertices.push(x, y, z);
                offset += 12;
            }
            
            // Skip attribute byte count (2 bytes)
            offset += 2;
            
            // Add indices for this triangle
            const baseIndex = (i * 3);
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
        }
        
        return { vertices, indices };
    }

    private static parseASCIISTL(data: ArrayBuffer): { vertices: number[], indices: number[] } {
        // Convert to string
        const text = new TextDecoder().decode(data);
        const lines = text.split('\n').map(line => line.trim());
        
        const vertices: number[] = [];
        const indices: number[] = [];
        let vertexIndex = 0;
        
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];
            if (line && line.startsWith('facet')) {
                // Skip normal
                i += 2; // skip facet normal line
                
                if (i < lines.length && lines[i] && lines[i]!.startsWith('outer loop')) {
                    i++; // skip outer loop
                    
                    // Read 3 vertices
                    for (let j = 0; j < 3; j++) {
                        if (i < lines.length && lines[i]) {
                            const vertexMatch = lines[i]!.match(/vertex\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/);
                            if (vertexMatch && vertexMatch[1] && vertexMatch[2] && vertexMatch[3]) {
                                vertices.push(
                                    parseFloat(vertexMatch[1]),
                                    parseFloat(vertexMatch[2]),
                                    parseFloat(vertexMatch[3])
                                );
                            }
                        }
                        i++;
                    }
                    
                    // Skip endloop and endfacet
                    while (i < lines.length && lines[i] && !lines[i]!.startsWith('endfacet')) {
                        i++;
                    }
                    if (i < lines.length) {
                        i++; // skip endfacet
                    }
                    
                    // Add triangle indices
                    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                    vertexIndex += 3;
                }
            } else {
                i++;
            }
        }
        
        return { vertices, indices };
    }
}