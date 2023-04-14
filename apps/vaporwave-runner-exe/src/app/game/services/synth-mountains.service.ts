import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
import alea from 'alea';
import { RandomUtils } from '../utils/random.util';
import { OptionsService } from './options.service';
import { ProgressionService } from './progression.service';
import { GameStateService } from './game-state.service';
import { GameStates } from '../config/game.states';
import { of } from 'rxjs';

//TODO: ONe potential enhancement -> every time we go back to the main state, we can have the mountains update their heights

@Injectable({
  providedIn: 'root'
})
export class SynthMountainsService {

  private scene: THREE.Scene;
  public mountainMeshs: Array<THREE.Mesh<THREE.PlaneGeometry, any>> = [];

  private readonly MOUNTAIN_WIDTH = 50;
  private readonly MOUNTAIN_LENGTH = 8;
  private rng: any;
  private noise: NoiseFunction3D;
  private mountainSpacing = 4.5;

  private mountainCount = 25;
  private zOrigin = -85;
  newXPositions: number[];
  hasAnimated: boolean;
  clock = new THREE.Clock();
  timer = 0;

  constructor(
    private gameStateService: GameStateService,
    private progressionService: ProgressionService
  ) { }

  async initialize(scene: THREE.Scene) {
    this.scene = scene;

    //Wrapping it around of to make it an observable (running outside the main loop)
    //Ensures faster load times
    //of (this.initMountains()).subscribe(() => {});
  }

  update() {
    //this.checkForTransition();
  }

  reshufflePositions() {
    let xPositions = this.sinWaveXPosition();
    this.mountainMeshs.forEach((mountain, index) => {
      this.setMountainHeight(mountain);
      mountain.position.set(xPositions[index], 2, mountain.position.z);
    });
  }

  updateMountainPositionRelativeToPlayer(vector3: THREE.Vector3) {
    this.mountainMeshs.forEach(mountain => {
      mountain.position.add(vector3);
    });
  }

  private initMountains() {
    for (let i = 0; i < this.mountainCount; i++) {
      this.rng = alea(Math.random());
      this.noise = createNoise3D(this.rng);
      let zPosition = i * this.MOUNTAIN_LENGTH;
      let mountainGeometry = this.createMountainGeometry();
      this.createMountainMeshes(mountainGeometry, zPosition, i);
    }

    return 'done';
  }

  private checkForTransition() {
    if (this.gameStateService.state == GameStates.Transition) {
      if (this.timer <= 5) {
        this.timer += this.clock.getDelta();
      }
      
      if (this.timer >= 2) {
        this.animateMountains();
      }
    }

    if (this.gameStateService.state == GameStates.TransitionEnd) {
      // allow animation to finish to a point and then stop
      this.animationMountainsAndStop();
      this.timer = 0;
    }
  }

  private animateMountains() {
    this.hasAnimated = true;
    this.mountainMeshs.forEach((mountain, index) => {
      mountain.position.z += this.progressionService.currentSpeed;;
      if (mountain.position.z > 20) {
        mountain.position.z = this.zOrigin;
      }
    });
  }

  private animationMountainsAndStop() {
    // we want to allow the animation to continue but they get reset to the origin, we want to stop the animation
    this.mountainMeshs.forEach((mountain, index) => {
      if (mountain.position.z > this.zOrigin) {
        mountain.position.z += this.progressionService.currentSpeed;
      }
      if (mountain.position.z > 20) {
        let zPosition = index * this.MOUNTAIN_LENGTH;
        mountain.position.z = (zPosition * -1) + this.zOrigin;
      }
    });
  }

  private redrawMountains() {
    for (let i = 0; i < this.mountainCount; i++) {
      let zPosition = i * this.MOUNTAIN_LENGTH;
      this.mountainMeshs[i].position.z = (zPosition * -1) + this.zOrigin;
    }
    this.reshufflePositions();
  }

  private createMountainGeometry(): { geometry: THREE.PlaneGeometry, points: Array<THREE.Vector3> } {

    // Create center valley geometry
    let valleyGeometry = new THREE.PlaneGeometry(this.MOUNTAIN_WIDTH, this.MOUNTAIN_LENGTH, 50, 50);
    valleyGeometry.translate(0, 0, 0);

    // Apply noise to mountain geometries and center valley geometry
    let points = this.setMountainHeight(valleyGeometry);

    return {geometry: valleyGeometry, points: points };
  }

  //#region Set mountain height
  private setMountainHeight(geometry) {
    const positions = geometry.attributes.position as THREE.Float32BufferAttribute;
    const count = positions.count;
    const points = [];
  
    // Set the frequency and amplitude for the noise function
    const freq = 4;
    const amp = 7;
  
    // Generate the noise values for each vertex
    let noiseValues = [];
    for (let i = 0; i < count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      points.push(new THREE.Vector3(x, y, z));
  
      // Generate noise value using a 2D noise function
      let noise = this.fbm3d(this.noise, 2)(x * freq, y * freq, z * freq);
  
      // Check if the vertex is in the center of the valley
      if (Math.abs(x) < this.mountainSpacing) {
        noise = 5; // Make the valley flat
        noiseValues.push(noise);
      } else {
        noiseValues.push(noise * amp);
      }
    }
  
    // Apply the Gaussian blur filter
    const filteredNoiseValues = [];
    const filterSize = 8; // The size of the filter kernel
    const sigma = filterSize / 3; // The standard deviation of the Gaussian function
    const filterWeight = 1 / (2 * Math.PI * sigma * sigma);
    for (let i = 0; i < count; i++) {
      let sum = 0;
      let weightSum = 0;
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
  
      // Iterate over the neighboring vertices
      for (let j = -filterSize; j <= filterSize; j++) {
        for (let k = -filterSize; k <= filterSize; k++) {
          const index = i + j * count + k;
          if (index >= 0 && index < count) {
            const nx = positions.getX(index);
            const ny = positions.getY(index);
            const nz = positions.getZ(index);
            const distance = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2 + (z - nz) ** 2);
            const weight = filterWeight * Math.exp(-distance * distance / (2 * sigma * sigma));
            sum += noiseValues[index] * weight;
            weightSum += weight;
          }
        }
      }
  
      // Compute the filtered noise value for the current vertex
      const filteredNoise = sum / weightSum;
      filteredNoiseValues.push(filteredNoise);
    }
  
    // Update the z-coordinates of the vertices with the filtered noise values
    for (let i = 0; i < count; i++) {
      positions.setZ(i, filteredNoiseValues[i]);
    }
  
    positions.needsUpdate = true;
    return points;
  }

  //#endregion

  private fbm3d(noise3D: NoiseFunction3D, octaves: number): NoiseFunction3D {
    return function fbm2dFn(x: number, y: number, z: number) {
      let value = 0.0;
      let amplitude = 0.5;
      for (let i = 0; i < octaves; i++) {
        x *= 0.5;
        y *= 0.5;
        z *= 0.5;
        value += noise3D(x, y, z) * amplitude;
        amplitude *= 0.8;
      }
      return value;
    };
  }

  private createMountainMeshes(data: { geometry: THREE.PlaneGeometry, points: Array<THREE.Vector3> }, zPosition, index?) {
    let mountainMaterialCenter = new THREE.MeshPhongMaterial({ color: 0x000000, lightMapIntensity: 30 });

    let newZPosition = (zPosition * -1) + this.zOrigin;
    let xPositions = this.sinWaveXPosition();

    // Create wireframe material
    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x00B1FF, linewidth: 5 });
    let mountainMeshCenter = new THREE.Mesh(data.geometry, mountainMaterialCenter);

    mountainMeshCenter.rotateX(Math.PI / 2);
    mountainMeshCenter.position.set(xPositions[index], 1, newZPosition);
    mountainMeshCenter.scale.set(2, 1, 1);

    const centerMountainWireframeGeometry = new THREE.WireframeGeometry(data.geometry);
    let centerMountainWireframe = new THREE.LineSegments(centerMountainWireframeGeometry, outlineMaterial);
    mountainMeshCenter.add(centerMountainWireframe);

    this.mountainMeshs.push(mountainMeshCenter);
    this.scene.add(mountainMeshCenter);
}

  private sinWaveXPosition(): Array<number> {
    const amplitude = RandomUtils.randomValue(8, 10);
    const frequency = 0.08
    const phaseShift = 0
    const xOffset = 0; // The horizontal offset of the wave

    const waveArray = [];
    for (let i = 0; i < this.mountainCount; i++) {
      const y = amplitude * Math.sin(2 * Math.PI * frequency * i + phaseShift) + xOffset;
      waveArray.push(y);
    }

    return waveArray;
  }
}
