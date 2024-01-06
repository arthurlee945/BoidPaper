import { Shader } from "../Shader";

//TODO: texturePosition | textureVelocity | CHECK Phase Variable
export const positionFragmentShader = new Shader({
  uniforms: {
    time: { value: 0.0, type: "float" },
    delta: { value: 0.0, type: "float" },
  },
  shader: /*glsl*/ `
    void main(){
        vec2 uv = gl_FragCoord.xy/ resolution.xy;
        vec4 tmpPos = texture2D(texturePosition, uv);
        vec3 position = tmpPos.xyz;
        vec3 velocity = texture2D(textureVelocity, uv).xyz;

        float phase = mod( ( tmpPos.w + delta +
            length( velocity.xz ) * delta * 3. +
            max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );
        
        gl_FragColor = vec4(position + velocity * delta * 15. , phase);
    }
  `,
});
