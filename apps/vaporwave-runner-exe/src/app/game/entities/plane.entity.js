"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const asset_config_1 = require("../config/asset.config");
const base_entity_1 = require("./base.entity");
class PlaneEntity extends base_entity_1.default {
    set box(value) { this._box = value; }
    get box() { return this._box; }
    constructor(effectsService, cameraService, subscriptionService, optionService) {
        super(optionService);
        this.effectsService = effectsService;
        this.cameraService = cameraService;
        this.subscriptionService = subscriptionService;
        this.optionService = optionService;
        this.config = this.optionService.PlaneConfig;
    }
    initialize(addToPosition, zPos) {
        return __awaiter(this, void 0, void 0, function* () {
            this.group = yield this.createPlane();
            this.group.position.set(addToPosition, this.config.position.y, zPos);
            this.box = new THREE.Box3().setFromObject(this.group);
            let camPosZ = Math.abs(this.cameraService.mainCamera.position.z - this.config.position.z);
            this.subscriptionService.destroyPlanes$.subscribe(() => this.destroy());
        });
    }
    update() {
    }
    destroy() {
        this.group.children.forEach(item => {
            const mesh = this.group.getObjectByProperty('uuid', item.uuid);
            mesh.geometry.dispose();
            mesh.material.forEach(item => {
                item.dispose();
            });
        });
        this.group.clear();
    }
    resetToPosition(position) {
        this.group.position.set(position.x, position.y, position.z);
    }
    createPlane() {
        const configs = asset_config_1.default.PLANE_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }
    getDiminsions() {
        return {
            width: this.box.max.x - this.box.min.x,
            height: this.box.max.z - this.box.min.z,
            depth: this.box.max.y - this.box.min.y
        };
    }
}
exports.default = PlaneEntity;
//# sourceMappingURL=plane.entity.js.map