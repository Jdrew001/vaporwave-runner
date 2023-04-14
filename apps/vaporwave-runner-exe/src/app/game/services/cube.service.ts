import { Injectable } from '@angular/core';
import { delay, Subject } from 'rxjs';
import AssetConfig from '../config/asset.config';
import CubeEntity from '../entities/cube.entity';
import PlaneEntity from '../entities/plane.entity';
import { RandomUtils } from '../utils/random.util';
import * as THREE from "three";
import { Color, Plane } from "three";
import { SubscriptionService } from './subscription.service';
import { LoaderService } from './loader.service';
import { CollisionService } from './collision.service';
import { OptionsService } from './options.service';
import { APP_CONFIG } from '../../../environments/environment';
import { ProgressionService } from './progression.service';
import { GameStateService } from './game-state.service';

@Injectable()
export class CubeService {

  private maxCubes = this.optionService.CubeConfig.baseDensity;
  private get isProduction() { return APP_CONFIG.production; }

  private _scene: THREE.Scene;
  get scene() { return this._scene; }
  set scene(value) { this._scene = value; }

  private _cubeGroup: THREE.Group;
  get cubeGroup() { return this._cubeGroup; }
  set cubeGroup(group) { this._cubeGroup = group; }

  private _cubeMtl: any;
  get cubeMtl() { return this._cubeMtl; }
  set cubeMtl(value) { this._cubeMtl = value; }

  drawCubes$: Subject<any> = new Subject();


  constructor(
    private subscriptionService: SubscriptionService,
    private loaderService: LoaderService,
    private collisionService: CollisionService,
    protected optionService: OptionsService,
    private gameStateService: GameStateService
  ) { }

  initialize(scene: THREE.Scene) {
    this.scene = scene;
    this.preloadCubeMaterial();

    this.drawCubes$.pipe(delay(100)).subscribe((data: {plane: PlaneEntity, row: number}) => {
        let vector3s = RandomUtils.generateVector3s(this.optionService.CubeConfig.baseDensity)
        this.createCubes(data.plane, data.row, vector3s);
    });
  }

  private async preloadCubeMaterial() {
    const configs = AssetConfig.SQUARE_ENTITY_PATHS;
    this.cubeMtl = await this.loaderService.loadEntityMtl(configs.MTL);
  }

  update() {
      this.subscriptionService.checkForCubeIntersection$.next(true);
  }

  // TODO: Check if a cube is colliding with another cube, then redraw one of the cubes
  async createCubes(plane: PlaneEntity, row: number, vector3s: THREE.Vector3[]) {
      for (let i = 0; i < vector3s.length; i++) {
          const cube = new CubeEntity(this.scene, this.subscriptionService, this.collisionService, this.optionService, this.gameStateService);
          await cube.initialize(this.cubeMtl, i);
          
          plane.group.add(cube.group);
          cube.planeId = plane.group.uuid;
          cube.group.position.set(vector3s[i].x, vector3s[i].y, vector3s[i].z);
          cube.row = row;
          cube.box = new THREE.Box3().setFromObject(cube.group);

          if (this.optionService.DebugConfig.showCollisionBoxes) {
            cube.drawCubeBox();
          }
          
          plane.group.add(cube.group);
      }
  }

  async createNewCubes(plane: PlaneEntity, row: number, count, indexes) {
    for (let i = 0; i < count; i++) {
        const cube = new CubeEntity(this.scene, this.subscriptionService, this.collisionService, this.optionService, this.gameStateService);
        await cube.initialize(this.cubeMtl, indexes[i]);
        
        plane.group.add(cube.group);
        cube.planeId = plane.group.uuid;
        cube.group.position.set(0, -5, 0);
        cube.row = row;
        cube.box = new THREE.Box3().setFromObject(cube.group);

        if (this.optionService.DebugConfig.showCollisionBoxes) {
          cube.drawCubeBox();
        }
        
        plane.group.add(cube.group);
    }
}

  async redrawCubes(row, planeEntity, vector3s: THREE.Vector3[]) {
    this.subscriptionService.redrawCube$.next({row: row, vector3: vector3s});
  }
}
