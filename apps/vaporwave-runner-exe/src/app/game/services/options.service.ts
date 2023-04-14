import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class OptionsService {

  public gameOptions = {
    cameraRotationX: 0,
  }

  public PlayerConfig = {
      position: new THREE.Vector3(0, 0.3, -2),
      scale: 0.2,
      speed: 0.10
  }

  public GameCameraConfig = {
      position: new THREE.Vector3(0, 2.5, 4.5),
      positionX: 0,
      positionY: 3,
      positionZ: 4.5,
      rotation: new THREE.Vector3(0, 0.00, 0),
      rotationX: THREE.MathUtils.degToRad(-5),
      fov: 40,
      aspect:1, 
      near: 1, 
      far: 95
  }

  public DebugCameraConfig = {
      x: 0,
      y: 35,
      z: -10,
      isActive: false,
      followPlayer: false,
      rotateX: THREE.MathUtils.degToRad(-90),
      fov: 90,
      aspect: 1,
      near: 0.01, 
      far: 600
  }

  public DebugConfig = {
    showCollisionBoxes: false
  }

  public LightConfig = {
      color: 0xFFFFFF,
      intensity: 1
  }

  public CubeConfig = {
      scale: 0.3,
      position: new THREE.Vector3(0, 0.1, -6),
      baseDensity: 35
  }

  public PlaneConfig = {
      position: new THREE.Vector3(0, 0, -25),
      scale: 0.2,
      speed: 0.45,
      rows: 4, //4d
      columns: 4, //8
      width: 32.2,
      height: 32.2,
      isAnimating: false
  }
}
