import * as THREE from "three";
import { ShaderPass } from "postprocessing";


export class CustomShaderPass extends ShaderPass {
	textureID;
	clear;
	quad;
	uniforms;
	material;

	private _renderToScreen;
	public get renderToScreen() {
		return this._renderToScreen;
	}
	public set renderToScreen(value) {
		this._renderToScreen = value;
	}

	constructor(scene, shader, textureID) {
		let material = new THREE.ShaderMaterial( {

			defines: shader.defines || {},
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );
		super(material);
		this.scene = scene;
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

		

		this.renderToScreen = false;

		this.enabled = true;
		this.needsSwap = true;
		this.clear = false;

		this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

		this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
		this.scene.add( this.quad );
	}
}

// CustomShaderPass.prototype = {
// 	render: function( renderer, writeBuffer, readBuffer, delta ) {

// 		if ( this.uniforms[ this.textureID ] ) {

// 			this.uniforms[ this.textureID ].value = readBuffer;

// 		}

// 		this.quad.material = this.material;

// 		if ( this.renderToScreen ) {

// 			renderer.render( this.scene, this.camera );

// 		} else {

// 			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

// 		}

// 	}
// }


