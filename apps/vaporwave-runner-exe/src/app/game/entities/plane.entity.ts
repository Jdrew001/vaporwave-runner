import * as THREE from 'three';
import { Material, Mesh } from 'three';
import AssetConfig from "../config/asset.config";
import { CameraService } from '../services/camera.service';
import { EffectsService } from '../services/effects.service';
import { OptionsService } from '../services/options.service';
import { SubscriptionService } from '../services/subscription.service';
import BaseEntity from "./base.entity";

export default class PlaneEntity extends BaseEntity {

    private config = this.optionService.PlaneConfig;

    private _box: THREE.Box3;
    set box(value) { this._box = value; }
    get box() { return this._box; }

    constructor(
        private effectsService: EffectsService,
        private cameraService: CameraService,
        private subscriptionService: SubscriptionService,
        protected override optionService: OptionsService
    ) {
        super(optionService);
    }

    async initialize(addToPosition?: number, zPos?) {
        this.group = await this.createPlane();
        this.group.position.set(addToPosition, this.config.position.y, zPos);
        this.box = new THREE.Box3().setFromObject(this.group);

        let camPosZ = Math.abs(this.cameraService.mainCamera.position.z - this.config.position.z);


        this.subscriptionService.destroyPlanes$.subscribe(() => this.destroy());
    }
    update() {
        
    }

    destroy() {
        this.group.children.forEach(item => {
            const mesh = this.group.getObjectByProperty('uuid', item.uuid) as Mesh;
            mesh.geometry.dispose();
            (mesh.material as Material[]).forEach(item => {
                item.dispose();
            });
        });

        this.group.clear();
    }

    resetToPosition(position: THREE.Vector3) {
        this.group.position.set(position.x, position.y, position.z);
    }

    createPlane() {
        const configs = AssetConfig.PLANE_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }

    getDiminsions() {
        return {
            width: this.box.max.x - this.box.min.x,
            height: this.box.max.z - this.box.min.z,
            depth: this.box.max.y - this.box.min.y
        }
    }

}