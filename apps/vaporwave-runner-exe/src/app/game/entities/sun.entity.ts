import * as THREE from "three";

export default class SunEntity {

    private _sunMesh: THREE.Mesh;
    get sunMesh() { return this._sunMesh; }
    set sunMesh(val) { this._sunMesh = val; }

    private uniforms = {
        u_time: { value: 0.0 },
        u_mouse: {
            value: {
                x: 0.0,
                y: 0.0
            }
        },
        u_resolution: {
            value: {
                x: window.innerWidth * window.devicePixelRatio,
                y: window.innerHeight * window.devicePixelRatio
            }
        },
        color_main: { // sun's top color
            value: this.hexToRgb("#ffab00", true)
        },
        color_accent: { // sun's bottom color
            value: this.hexToRgb("#ff51c8", true)
        }
    }

    initialize(scene) {
        this.initSun(scene);
    }

    private initSun(scene) {
        const sunMat = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
            transparent: true
          });
          
          // Create a new circle geometry with fewer segments to reduce the number of vertices
          const circle = new THREE.CircleGeometry(30, 64);
          
          this.sunMesh = new THREE.Mesh(circle, sunMat);
          this.sunMesh.position.set(0, 0.7, -74);
          this.sunMesh.scale.set(1/3,1/3,1/3);
          scene.add(this.sunMesh);
    }

    private hexToRgb(hex, forShaders = false) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (forShaders) {
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : null;
        }
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    private vertexShader() {
        return `
            varying vec2 vUv;
            varying vec3 vPos;
            void main() {
              vUv = uv;
              vPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
            }
        `
    }

    private fragmentShader() {
        return `
            #ifdef GL_ES
            precision mediump float;
            #endif
            #define PI 3.14159265359
            #define TWO_PI 6.28318530718
            
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform float u_time;
            uniform vec3 color_main;
            uniform vec3 color_accent;
            varying vec2 vUv;
            varying vec3 vPos;
            void main() {
                float x = vPos.y;
                float osc = ceil(sin((3. - (x - u_time) / 1.5) * 5.) / 2. + 0.4 - floor((3. - x / 1.5) * 5. / TWO_PI) / 10.);
                vec3 color = mix(color_accent, color_main, smoothstep(0.3, 0.9, vUv.y));
                vec2 st = vec2(vUv.x, 1.0 - (vUv.y - 0.01)); 
                gl_FragColor = vec4(color, osc);
            }
        `
      }
}