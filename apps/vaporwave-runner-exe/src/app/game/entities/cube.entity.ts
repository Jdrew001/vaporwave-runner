import * as THREE from 'three';
import { Color } from 'three';
import AssetConfig from "../config/asset.config";
import { CollisionService } from '../services/collision.service';
import { OptionsService } from '../services/options.service';
import { SubscriptionService } from '../services/subscription.service';
import { RandomUtils } from '../utils/random.util';
import BaseEntity from "./base.entity";
import PlaneEntity from './plane.entity';
import { GameStateService } from '../services/game-state.service';
import { GameStates } from '../config/game.states';

export default class CubeEntity extends BaseEntity {

    private config = this.optionService.CubeConfig;

    planeId: any;
    isDestroyed = false;
    private scene: THREE.Scene;
    row: number;
    plane: PlaneEntity;
    index: number;

    private _box: THREE.Box3;
    set box(value) { this._box = value; }
    get box() { return this._box; }

    private _boxHelper: THREE.Box3Helper;
    set boxHelper(value) { this._boxHelper = value; }
    get boxHelper() { return this._boxHelper; }

    private _leftRaycaster: THREE.Raycaster;
    set leftRaycaster(value) { this._leftRaycaster = value; }
    get leftRaycaster(): THREE.Raycaster { return this._leftRaycaster; }

    private _rightRaycaster: THREE.Raycaster;
    set rightRaycaster(value) { this._rightRaycaster = value; }
    get rightRaycaster(): THREE.Raycaster { return this._rightRaycaster; }

    constructor(
        scene: THREE.Scene,
        private subscriptionService: SubscriptionService,
        private collisionService: CollisionService,
        protected override optionService: OptionsService,
        private gameStateService: GameStateService) {
        super(optionService);

        this.scene = scene;
    }

    async initialize(mtl: any, index: number) {
        const configs = AssetConfig.SQUARE_ENTITY_PATHS;
        this.index = index;
        this.group = await this.mtlObjLoadersService.loadEntityObj(mtl, configs.OBJ);
        this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.group.scale.set(this.config.scale, this.config.scale, this.config.scale);
        //this.group.visible = false;
        this.subscriptionService.redrawCube$.subscribe(data => this.redrawCube(data));
        this.subscriptionService.checkForCubeIntersection$.subscribe(
            () => {
                this.box.setFromObject(this.group);
                this.collisionService.checkForCollision(this)
            });

        this.subscriptionService.destoryCubes$.subscribe(() => this.destroy());
    }

    update() {
        
        
    }

    private initializeRaycaster() {
        const leftDirection = new THREE.Vector3(-1, 0.10, 0);
        const rightDirection = new THREE.Vector3(1, 0.10, 0);

        this.leftRaycaster = new THREE.Raycaster(this.group.position, leftDirection, 0, 0.1);
        this.rightRaycaster = new THREE.Raycaster(this.group.position, rightDirection, 0, 0.1);
    }

    private redrawCube(data) {
        if (this.row != data.row) return;
        let i = this.index;
        let vector3 = (data.vector3 as Array<THREE.Vector3>)[i];

        const x = vector3.x;
        const y = vector3.y;
        const z = vector3.z;
        this.group.position.set(x, y, z);
        if (this.gameStateService.state == GameStates.Transition || this.gameStateService.state == GameStates.TransitionEnd) {
            this.group.visible = false;
        } else {
            this.group.visible = true
        }
    }

    destroy() {
        this.group.removeFromParent();
        this.scene.remove(this.group.children[0]);
        this.boxHelper.parent.remove(this.boxHelper);
        //this.boxHelper.materia.dispose();
        this.boxHelper.geometry.dispose();
        this.group.clear();
    }

    drawCubeBox() {
        this.boxHelper = new THREE.Box3Helper(this.box, new Color(0xffff00) );
        this.scene.add(this.boxHelper);
    }
}