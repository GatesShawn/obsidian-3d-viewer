import { describe, it, expect } from "vitest";
import { initShaderProgram, loadShader, vsSource, fsSource } from "./webgl";

// Minimal mock for WebGLRenderingContext functionality used by our helpers
class MockGL {
  VERTEX_SHADER = 0x8b31;
  FRAGMENT_SHADER = 0x8b30;
  LINK_STATUS = 0x8b82;

  createShader(type: number) {
    // return a non-null value to simulate success, or null to simulate failure
    return {};
  }
  shaderSource(_shader: any, _src: string) {}
  compileShader(_shader: any) {}
  getShaderParameter(_shader: any, _pname: number) {
    return true;
  }
  getShaderInfoLog(_shader: any) {
    return "";
  }
  deleteShader(_shader: any) {}

  createProgram() {
    return {};
  }
  attachShader(_prog: any, _shader: any) {}
  linkProgram(_prog: any) {}
  getProgramParameter(_prog: any, _pname: number) {
    return true;
  }
  getProgramInfoLog(_prog: any) {
    return "";
  }
}

describe("webgl utility functions", () => {
  it("loadShader returns null when createShader returns null", () => {
    const gl = {
      createShader: () => null,
    } as any;
    expect(loadShader(gl, 0, "")).toBeNull();
  });

  it("initShaderProgram returns null if a shader fails to compile", () => {
    const gl = {
      createShader: () => null,
      VERTEX_SHADER: 0x8b31,
      FRAGMENT_SHADER: 0x8b30,
    } as any;
    expect(initShaderProgram(gl, vsSource, fsSource)).toBeNull();
  });

  it("initShaderProgram returns a program when everything is working", () => {
    const gl = new MockGL() as unknown as WebGLRenderingContext;
    const program = initShaderProgram(gl, vsSource, fsSource);
    expect(program).not.toBeNull();
  });
});
