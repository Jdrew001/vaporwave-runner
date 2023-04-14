import * as THREE from 'three';
import { Color } from 'three';
import { APP_CONFIG } from '../../../environments/environment';
import AssetConfig from "../config/asset.config";
import { OptionsService } from '../services/options.service';
import BaseEntity from "./base.entity";

export default class PlayerEntity extends BaseEntity {

    private config = this.optionService.PlayerConfig;
    private get isProduction() { return APP_CONFIG.production; }

    private _leftRaycaster: THREE.Raycaster;
    set leftRaycaster(value) { this._leftRaycaster = value; }
    get leftRaycaster(): THREE.Raycaster { return this._leftRaycaster; }

    private _rightRaycaster: THREE.Raycaster;
    set rightRaycaster(value) { this._rightRaycaster = value; }
    get rightRaycaster(): THREE.Raycaster { return this._rightRaycaster; }
    
    private _box: THREE.Box3;
    set box(value) { this._box = value; }
    get box(): THREE.Box3 { return this._box; }

    scene: THREE.Scene;

    constructor(
        protected override optionService: OptionsService
    ) {
        super(optionService);
    }

    async initialize(scene: THREE.Scene) {
        this.scene = scene;
        this.group = await this.createPlayer();
        this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.group.scale.set(this.config.scale, this.config.scale, this.config.scale);
        this.box = new THREE.Box3().setFromObject(this.group);
        this.initializeRaycasters();

        if (!this.optionService.DebugConfig.showCollisionBoxes) return;
        this.drawCubeBox();
        
    }

    initializeRaycasters() {
        const leftDirection = new THREE.Vector3(-1, 0.9, 0);
        const rightDirection = new THREE.Vector3(1, 0.9, 0);

        this.leftRaycaster = new THREE.Raycaster(this.group.position, leftDirection, 0, 0.5);
        this.rightRaycaster = new THREE.Raycaster(this.group.position, rightDirection, 0, 0.5);

        //add an arrow helper to show the direction of the raycaster
        const leftArrowHelper = new THREE.ArrowHelper(leftDirection, this.group.position, 0.5, 0xffff00);
        const rightArrowHelper = new THREE.ArrowHelper(rightDirection, this.group.position, 0.5, 0xffff00);

        this.scene.add(leftArrowHelper);
        this.scene.add(rightArrowHelper);
    }

    update() {
        // create the move logic
    }

    destroy() {
        
    }

    private createPlayer() {
        const configs = AssetConfig.PLAYER_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }

    private drawCubeBox() {
        const helper = new THREE.Box3Helper(this.box, new Color(0xffff00) );
        this.scene.add(helper);
    }
}