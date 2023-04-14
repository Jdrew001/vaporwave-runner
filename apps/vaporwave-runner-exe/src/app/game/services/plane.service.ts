import { Injectable } from '@angular/core';
import * as THREE from 'three';
import PlaneEntity from '../entities/plane.entity';
import { RandomUtils } from '../utils/random.util';
import { CameraService } from './camera.service';
import { CubeService } from './cube.service';
import { EffectsService } from './effects.service';
import { OptionsService } from './options.service';
import { ProgressionService } from './progression.service';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class PlaneService {

    private _scene: THREE.Scene;
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }

    private _planes: Array<PlaneEntity[]> = []; 
    get planes() { return this._planes; }
    set planes(value) { this._planes = value; }

    private _planeBuffer: THREE.Mesh;
    get planeBuffer() { return this._planeBuffer; }
    private set planeBuffer(value) { this._planeBuffer = value;}

    private PLANE_CONFIG = this.optionService.PlaneConfig;

    private columns = this.PLANE_CONFIG.columns;
    private rows = this.PLANE_CONFIG.rows;
    private columnIndexes = [];
    private widthNum = this.PLANE_CONFIG.width;
    private heightNum = this.PLANE_CONFIG.height;
    private zStart = -80;
    private speed = this.PLANE_CONFIG.speed;
    private resetThreshold = 20;
    private planeXSpacing = 32;
    private newDensity = 0;
    private shouldIncreaseDifficulty = false;
    private cubesPerPlane = this.optionService.CubeConfig.baseDensity;

    constructor(
        private cameraService: CameraService,
        private cubeService: CubeService,
        private effectService: EffectsService,
        private subscriptionService: SubscriptionService,
        private optionService: OptionsService,
        private progressionService: ProgressionService
    ) { }

    initSubscriptions() {

        // Subscription fires when we increase the difficulty of the game
        // Time should be based on progression service
        this.subscriptionService.updateDifficulty$.subscribe(val => {
            this.speed = val.speed;
            this.shouldIncreaseDifficulty = true;
        });
    }

    async initialize(scene: THREE.Scene) {
        this.initSubscriptions();
        this.scene = scene;
        this.cubeService.initialize(scene);
        this.generateColumnIndexes();
        this.generatePlaneBuffer();
        await this.createPlaneRows();       
    }

    update() {
        if (this.PLANE_CONFIG.isAnimating) {
           this.animatePlanes();
        }
    }

    destroy() {
        this.subscriptionService.destroyPlanes$.next(true);
        this.planes.forEach(item => item.forEach(plane => {
            for (var key in plane) 
                delete plane[key];

            plane = null;
        }))
        this.planes = [];
    }

    generatePlaneBuffer() {
        const mapLoader = new THREE.TextureLoader();
        const checkerboard = mapLoader.load('assets/BG.png');
        this.planeBuffer = new THREE.Mesh(
            new THREE.PlaneGeometry(140, 50, 10, 10),
            new THREE.MeshStandardMaterial({map: checkerboard}));
        this.planeBuffer.castShadow = true;
        this.planeBuffer.receiveShadow = true;
        //this.planeBuffer.rotation.x = 90;
        this.planeBuffer.position.add(new THREE.Vector3(0,10,-75));
        this.scene.add(this.planeBuffer);
    }

    generateColumnIndexes() {
        for (let i = 0; i < this.columns; i++) {
            this.columnIndexes.push(i);
        }
    }


    animatePlanes() {
        if (this.planes.length <= 0) return;
        for (let i = 0; i < this.planes.length; i++) {
            this.resetGroupZPosition(this.planes[i], i);

            for (let z = 0; z < this.planes[i].length; z++) {
                this.planes[i][z].group.position.add(new THREE.Vector3(0,0, this.speed));
            }
        }

        if (this.newDensity > this.cubesPerPlane) {
            this.cubesPerPlane = this.newDensity;
        }

        if (this.shouldIncreaseDifficulty) {
            this.newDensity = this.progressionService.newCurrentDensity;
            this.shouldIncreaseDifficulty = false;
        }
    }

    resetPlaneXPositionRight(playerXPosition: number) {
        this.planes.forEach(planeGroup => {
            let index = this.columns - 1;
            let furthestRightPlane = planeGroup[index].group;
            let furthestLeftPlane = planeGroup[0].group;
            let threshold = furthestRightPlane.position.x - ((this.widthNum / 2) * 2); //(this.widthNum / 2)

            if (playerXPosition > threshold) {
                // update the position to be to the right of the last element of the array
                let lastPlaneXPosition = planeGroup[index].group.position.x;
                furthestLeftPlane.position.set(lastPlaneXPosition + this.widthNum, furthestLeftPlane.position.y, furthestLeftPlane.position.z);

                // shift the array to the left [0,1,2] -> [1,2,0]
                planeGroup.unshift(...planeGroup.splice(1));
            }
        })
    }

    resetPlaneXPositionLeft(playerXPosition: number) {
        this.planes.forEach(planeGroup => {
            let index = this.columns - 1;
            let furthestRightPlane = planeGroup[index].group;
            let furthestLeftPlane = planeGroup[0].group;
            let threshold = furthestLeftPlane.position.x + ((this.widthNum / 2) * 2);

            if (playerXPosition < threshold) {
                // update the position to be to the left of the first element of the array
                let firstPlaneXPosition = planeGroup[0].group.position.x;
                furthestRightPlane.position.set(firstPlaneXPosition - this.widthNum, furthestRightPlane.position.y, furthestRightPlane.position.z);

                // shift the array to the right [0,1,2] -> [2,1,0]
                planeGroup.unshift(...planeGroup.splice(-1));
            }
        })
    }

    private async resetGroupZPosition(planeGroup: Array<PlaneEntity>, groupIndex: number) {
        if ((planeGroup[0] as PlaneEntity).group.position.z > this.resetThreshold) {
            planeGroup.forEach(async element => {
              let resetIndex = groupIndex == 0 ? this.rows - 1: groupIndex - 1; 
              let resetZPos = this.planes[resetIndex][0].group.position.z - this.heightNum;
              let newPosition = new THREE.Vector3(element.group.position.x, element.group.position.y, resetZPos);
              element.resetToPosition(newPosition);

              if (!(planeGroup[0].group.children.length > 1)) {
                    let vector3s = RandomUtils.generateVector3s(this.cubesPerPlane)
                    await this.cubeService.createCubes(element, groupIndex, vector3s);
                    return;
              }

              // we need to draw new cubes, then we need to draw here
              this.createNewCubesForPlane(planeGroup, element, groupIndex);

              let vector3s = RandomUtils.generateVector3s(this.cubesPerPlane);
              await this.cubeService.redrawCubes(groupIndex, element, vector3s);
          });
      }
    }

    private async createPlaneRows() {
        for (let i = 0; i < this.rows; i++) {
            let positionFactor = (i * this.planeXSpacing) * -1;
            await this.createPlanes(positionFactor, i == this.rows - 1, i);
        }
    }

    private async createPlanes(zPosition, shouldDrawCubes, row) {
        let tempArr: Array<PlaneEntity> = [];
        for (let i = 0; i < this.columns; i++) {
            let midIndex = this.median();
            let positionFactor = (i - midIndex) * this.widthNum;
            const plane = new PlaneEntity(
                this.effectService, this.cameraService, this.subscriptionService,
                this.optionService
            );

            await plane.initialize(positionFactor, zPosition);

            if (shouldDrawCubes) {
                await this.cubeService.drawCubes$.next({plane: plane, row: row});
            }
            
            tempArr.push(plane);
            this.scene.add(plane.group);
        }

        this.planes.push(tempArr);
    }

    private async createNewCubesForPlane(planeGroup, element, row) {
        if (planeGroup[0].group.children.length - 1 < this.newDensity) {

            let indexes = [];              
            for (let i = 0; i < (this.newDensity - (planeGroup[0].group.children.length - 1)); i++) {
            let newI = i;
            indexes.push(newI + (planeGroup[0].group.children.length - 1));
            }

            await this.cubeService.createNewCubes(element, row, indexes.length, indexes);
        }
    }

    private median() {
        const sorted = Array.from(this.columnIndexes).sort((a: number, b: number) => a - b);
        const middle = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return ((sorted[middle - 1]as number) + (sorted[middle] as number)) / 2;
        }

        return sorted[middle];
    }
}
