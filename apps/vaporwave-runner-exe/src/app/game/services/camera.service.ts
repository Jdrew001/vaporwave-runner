import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OptionsService } from './options.service';

@Injectable()
export class CameraService {

  private MAIN_CAMERA_CONFIG = this.optionService.GameCameraConfig;
  private DEBUG_CAMERA_CONFIG = this.optionService.DebugCameraConfig;

  private _mainCamera: THREE.PerspectiveCamera;
  get mainCamera() { return this._mainCamera; }
  set mainCamera(value) { this._mainCamera = value; }

  private _debugCamera: THREE.PerspectiveCamera;
  get debugCamera() { return this._debugCamera; }
  set debugCamera(value) { this._debugCamera = value; }

  private _renderer: THREE.WebGLRenderer;
  private set renderer(value: THREE.WebGLRenderer) { this._renderer = value; }
  get renderer() { return this._renderer; }

  public isDebugActive = false;

  constructor(
    private optionService: OptionsService
  ) { }

  initialize(renderer: THREE.WebGLRenderer) {
    document.addEventListener("resize", this.resizeCamera);
    this.createMainCamera();
    this.createDebugCamera();
    this.renderer = renderer;
  }

  getFieldOfView() {
      return this.mainCamera.fov;
  }

  getHeightOfView(dist) {
      let vFOV = THREE.MathUtils.degToRad( this.getFieldOfView() );
      return 2 * Math.tan(vFOV / 2) * dist;
  }

  getWidthOfView(dist) {
      return this.getHeightOfView(dist) * this.mainCamera.aspect;
  }

  private resizeCamera() {
      this.mainCamera.aspect = window.innerWidth / window.innerHeight;
      this.mainCamera.updateProjectionMatrix();

      let insetWidth = window.innerHeight / 4;
      let insetHeight = window.innerWidth / 4;

      this.debugCamera.aspect = insetWidth / insetHeight;
      this.debugCamera.updateProjectionMatrix();
  }

  private createMainCamera() {
      const width = window.innerWidth
      const height = window.innerHeight
      this.mainCamera = new THREE.PerspectiveCamera(
          this.MAIN_CAMERA_CONFIG.fov, 
          width / height, 
          this.MAIN_CAMERA_CONFIG.near, 
          this.MAIN_CAMERA_CONFIG.far)
      this.mainCamera.name = "MAIN CAMERA";
      
      this.mainCamera.position.set(this.MAIN_CAMERA_CONFIG.position.x, this.MAIN_CAMERA_CONFIG.position.y, this.MAIN_CAMERA_CONFIG.position.z);

      const rotation = this.mainCamera.rotation;
      this.mainCamera.rotation.set(this.MAIN_CAMERA_CONFIG.rotationX, rotation.y, rotation.z);
  }

  private createDebugCamera() {
      const width = window.innerWidth
      const height = window.innerHeight
      
      this.debugCamera = new THREE.PerspectiveCamera(
          this.DEBUG_CAMERA_CONFIG.fov,
          width/height,
          this.DEBUG_CAMERA_CONFIG.near,
          this.DEBUG_CAMERA_CONFIG.far
      );
      this.debugCamera.name = "DEBUG CAMERA";

      this.debugCamera.position.set(
          this.DEBUG_CAMERA_CONFIG.x,
          this.DEBUG_CAMERA_CONFIG.y,
          this.DEBUG_CAMERA_CONFIG.z
      );

      const rotation = this.debugCamera.rotation;
      this.debugCamera.rotation.set(this.DEBUG_CAMERA_CONFIG.rotateX, rotation.y, rotation.z);

      //this.mainCamera.add(this.debugCamera);
  }
}
