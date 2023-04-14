/**
 * @author alteredq / http://alteredqualia.com/
*/

import { Pass } from "postprocessing";
import { UnsignedByteType } from "three";

/**
 * A shader pass.
 *
 * Renders any shader material as a fullscreen effect. If you want to create multiple chained effects, please use
 * {@link EffectPass} instead.
 */

export class ShaderPass extends Pass {

	/**
	 * Constructs a new shader pass.
	 *
	 * @param {ShaderMaterial} material - A shader material.
	 * @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
	 */

	constructor(shader, textureID) {
		super("ShaderPass");

		this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

		if ( shader instanceof THREE.ShaderMaterial ) {

			this.uniforms = shader.uniforms;

			this.material = shader;

		}
		else if ( shader ) {

			this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			this.material = new THREE.ShaderMaterial( {

				defines: shader.defines || {},
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );
		}

		// this.fullscreenMaterial = material
		// this.input = input;
	}

	/**
	 * Sets the name of the input buffer uniform.
	 *
	 * @param {String} input - The name of the input buffer uniform.
	 * @deprecated Use input instead.
	 */

	setInput(input) {

		this.input = input;

	}

	/**
	 * Renders the effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		// const uniforms = this.fullscreenMaterial.uniforms;

		// if(inputBuffer !== null && uniforms !== undefined && uniforms[this.input] !== undefined) {

		// 	uniforms[this.input].value = inputBuffer.texture;

		// }

		// renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
		// renderer.render(this.scene, this.camera);

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		if(frameBufferType !== undefined && frameBufferType !== UnsignedByteType) {

			this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";

		}

	}

}

// import {ShaderPass} from 'postprocessing';

// ShaderPass = function( shader, textureID ) {

// 	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

// 	if ( shader instanceof THREE.ShaderMaterial ) {

// 		this.uniforms = shader.uniforms;

// 		this.material = shader;

// 	}
// 	else if ( shader ) {

// 		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

// 		this.material = new THREE.ShaderMaterial( {

// 			defines: shader.defines || {},
// 			uniforms: this.uniforms,
// 			vertexShader: shader.vertexShader,
// 			fragmentShader: shader.fragmentShader

// 		} );

// 	}

// 	this.renderToScreen = false;

// 	this.enabled = true;
// 	this.needsSwap = true;
// 	this.clear = false;


// 	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
// 	this.scene = new THREE.Scene();

// 	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
// 	this.scene.add( this.quad );

