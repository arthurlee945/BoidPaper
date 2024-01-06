type uniformType = "float" | "int" | "vec2" | "vec3" | "vec4";

export type ShaderOpts<TUniform extends Record<string, { value: unknown; type: uniformType }>> = {
  uniforms: TUniform;
  shader: string;
};

export class Shader<TUniform extends Record<string, { value: unknown; type: uniformType }>> {
  readonly uniforms: TUniform;
  readonly shader: string;
  /**
   * WebGL built in uniforms and attributes
   * @link https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
   */
  constructor(opts: ShaderOpts<TUniform>) {
    this.uniforms = opts.uniforms;
    this.shader = this.toShader(opts.shader);
    //----------Method bind
    this.toShader = this.toShader.bind(this);
    this.getUniform = this.getUniform.bind(this);
  }

  private toShader(shaderStr: string) {
    return (
      Object.entries(this.uniforms).reduce((uStr, uniform) => {
        return uStr + `uniform ${uniform[1].type} ${uniform[0]}\n`;
      }, "") + shaderStr
    );
  }

  getUniform() {
    return Object.entries(this.uniforms).reduce(
      (uSet, uniform) => {
        uSet[uniform[0]] = { value: uniform[1].value };
        return uSet;
      },
      {} as Record<string, { value: unknown }>
    );
  }
}
