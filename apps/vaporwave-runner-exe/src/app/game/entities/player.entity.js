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
const three_1 = require("three");
const environment_1 = require("../../../environments/environment");
const asset_config_1 = require("../config/asset.config");
const base_entity_1 = require("./base.entity");
class PlayerEntity extends base_entity_1.default {
    get isProduction() { return environment_1.APP_CONFIG.production; }
    set leftRaycaster(value) { this._leftRaycaster = value; }
    get leftRaycaster() { return this._leftRaycaster; }
    set rightRaycaster(value) { this._rightRaycaster = value; }
    get rightRaycaster() { return this._rightRaycaster; }
    set box(value) { this._box = value; }
    get box() { return this._box; }
    constructor(optionService) {
        super(optionService);
        this.optionService = optionService;
        this.config = this.optionService.PlayerConfig;
    }
    initialize(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            this.scene = scene;
            this.group = yield this.createPlayer();
            this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
            this.group.scale.set(this.config.scale, this.config.scale, this.config.scale);
            this.box = new THREE.Box3().setFromObject(this.group);
            this.initializeRaycasters();
            if (!this.optionService.DebugConfig.showCollisionBoxes)
                return;
            this.drawCubeBox();
        });
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
    createPlayer() {
        const configs = asset_config_1.default.PLAYER_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }
    drawCubeBox() {
        const helper = new THREE.Box3Helper(this.box, new three_1.Color(0xffff00));
        this.scene.add(helper);
    }
}
exports.default = PlayerEntity;
//# sourceMappingURL=player.entity.js.map