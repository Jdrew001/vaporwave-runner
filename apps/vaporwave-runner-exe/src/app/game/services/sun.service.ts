import { Injectable } from '@angular/core';
import SunEntity from '../entities/sun.entity';
import * as THREE from "three";

@Injectable()
export class SunService {

  private _sunEntity: SunEntity = new SunEntity();
  get sunEntity() { return this._sunEntity; }

  constructor() { }

  initialize(scene: THREE.Scene) {
    this.sunEntity.initialize(scene);
  }

  updateSunPosition(delta: THREE.Vector3) {
    const position = new THREE.Vector3(delta.x/1.2, delta.y, delta.z);
    this.sunEntity.sunMesh.position.add(position);
  }
}
