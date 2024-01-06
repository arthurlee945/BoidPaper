import { Vector3 } from "three/src/math/Vector3.js";

import { Shader } from "../Shader";

//TODO: resolution | texturePosition | textureVelocity | CHECK Phase Variable
/**
 * Built-in uniforms and attributes
 * @desc uniform: mat4 viewMatrix | vec3 cameraPosition | mat4 modelMatrix | mat4 modelViewMatrix | mat4 projectionMatrix | mat3 normalMatrix
 * @desc attribute: vec3 position | vec3 normal | vec2 uv
 */
export const velocityFragmentShader = new Shader({
  uniforms: {
    time: { value: 1.0, type: "float" },
    delta: { value: 0.0, type: "float" },
    //!REMOVE IF NOT USED
    testing: { value: 1.0, type: "float" },
    //* Boid core behavior
    separation: { value: 1.0, type: "float" },
    alignment: { value: 1.0, type: "float" },
    cohesion: { value: 1.0, type: "float" },
    freedom: { value: 1.0, type: "float" },
    //* Pointer Event
    predator: { value: new Vector3(), type: "vec3" },
    preyRad: { value: 150.0, type: "float" },
    resRange: { value: 800.0, type: "float" },
    speedLimit: { value: 9.0, type: "float" },
  },
  shader: /*glsl*/ `
    const float PI = 3.141592653589793;
    const float TAU = PI * 2.0;

    const float width = resolution.x;
    const float height = resolution.y;

    float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;

        vec3 selfPos = texture2D(texturePosition, uv).xyz;
        vec3 selfVel = texture2D(textureVelocity, uv).xyz;

        //! Check use case
        float separationSq = separation * separation;
        float cohesionSq = cohesion * cohesion;

        float f, percent;

        vec3 velocity = selfVel;
        
        float limit = speedLimit;

        //CHECK FOR POINTER EVENT
        if(predator.x != 9999. && predator.y != 9999.){
            vec3 dir = predator * resRange - selfPos;
            dir.z = 0;
            float dist = length(dir);
            float distSq = dist * dist;

            float preyRadSq = preyRad * preyRad;

            if(dist < preRad){
                f = (distSq / preyRadsq - 1.0) * delta * 100.;
                velocity += normalize(dir) * f;
                limit += 5.0;
            }
        }

        //RANDOM BEHAVIOR FOR BOIS
        /*
        if( rand( uv + time) < freedom ){
            velocity += freedom;
        }
        */

        // NORMAL BEHAVIOR
        float zoneRad = (separation + alignment + cohesion) * 0.8;
        float separationThreshold = separation / zoneRad;
        float alignmentThreshold = (separation + alignment) / zoneRad;
        float zoneRadSq = zoneRad * zoneRad;

        vec3 center = vec3(0., 0., 0.);
        vec3 dir = selfPos - center;

        dir.y *= 2.5;
        velocity -= normalize(dir) * delta * 5.;
        
        vec3 boidPos, boidVel;

        for( float y = 0.0; y < height; y++ ){
            for(float x = 0.0; x < width; x++){
                //REF POINT MIGHT NEED MULTIPLE for 
                vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
                boidPos = texture2D(texturePosition, ref);

                dir = boidPos - selfPos;
                float dist = length(dir);

                if(dist < 0.0001) continue;

                float distSq = dist * dist;

                if(distSq > zoneRadSq) continue;

                percent = distSq / zoneRadSq;

                if( percent < separationThreshold ){

                    //Separation - boids move away from other boids that are too close
                    f = (separationThreshold / percent - 1.0) * delta;
                    velocity -= normalize(dir) * f;
                
                }else if ( percent < alignmentThreshold){

                    //Alignment - boids attempt to match the velocities of their neighbors
                    float thresholdDelta = alignmentThreshold - separationThreshold;
                    float adjustedPercent = (percent - separationThreshold) / thresholdDelta;

                    boidVel = texture2D(textureVelocity, ref).xyz;

                    f = (0.5 - cos(adjustedPercent * TAU) * 0.5 + 0.5) * delta;
                    velocity += normalize(boidVel) * f;

                }else {

                    // Attraction / Cohesion - boids move toward the center of mass of their neighbors
                    float thresholdDelta = 1.0 - alignmentThreshold;
                    float adjustedPercent;
                    if(thresholdDelta === 0.){
                        adjustedPercent = 1.;
                    }
                    else{
                        adjustedPercent = (percent - alignmentThreshold) / thresholdDelta;
                    }

                    f = (0.5 - (cos(adjustedPercent * TAU) * -0.5 + 0.5)) * delta;
                    velocity += normalize(dir) * f;

                }

            }
        }

        //! TEST THIS
        //if(velocity.y > 0.) velocity.y += (1. - 0.2 * delta);

        if(length(velocity) > limit){
            velocity = normalize(velocity) * limit;
        }

        gl_FragColor = vec4(velocity, 1.0);
    }
  `,
});
