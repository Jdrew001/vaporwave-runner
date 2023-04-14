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
const asset_config_1 = require("../config/asset.config");
const base_entity_1 = require("./base.entity");
const game_states_1 = require("../config/game.states");
class CubeEntity extends base_entity_1.default {
    set box(value) { this._box = value; }
    get box() { return this._box; }
    set boxHelper(value) { this._boxHelper = value; }
    get boxHelper() { return this._boxHelper; }
    set leftRaycaster(value) { this._leftRaycaster = value; }
    get leftRaycaster() { return this._leftRaycaster; }
    set rightRaycaster(value) { this._rightRaycaster = value; }
    get rightRaycaster() { return this._rightRaycaster; }
    constructor(scene, subscriptionService, collisionService, optionService, gameStateService) {
        super(optionService);
        this.subscriptionService = subscriptionService;
        this.collisionService = collisionService;
        this.optionService = optionService;
        this.gameStateService = gameStateService;
        this.config = this.optionService.CubeConfig;
        this.isDestroyed = false;
        this.scene = scene;
    }
    initialize(mtl, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = asset_config_1.default.SQUARE_ENTITY_PATHS;
            this.index = index;
            this.group = yield this.mtlObjLoadersService.loadEntityObj(mtl, configs.OBJ);
            this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
            this.group.scale.set(this.config.scale, this.config.scale, this.config.scale);
            //this.group.visible = false;
            this.subscriptionService.redrawCube$.subscribe(data => this.redrawCube(data));
            this.subscriptionService.checkForCubeIntersection$.subscribe(() => {
                this.box.setFromObject(this.group);
                this.collisionService.checkForCollision(this);
            });
            this.subscriptionService.destoryCubes$.subscribe(() => this.destroy());
        });
    }
    update() {
    }
    initializeRaycaster() {
        const leftDirection = new THREE.Vector3(-1, 0.10, 0);
        const rightDirection = new THREE.Vector3(1, 0.10, 0);
        this.leftRaycaster = new THREE.Raycaster(this.group.position, leftDirection, 0, 0.1);
        this.rightRaycaster = new THREE.Raycaster(this.group.position, rightDirection, 0, 0.1);
    }
    redrawCube(data) {
        if (this.row != data.row)
            return;
        let i = this.index;
        let vector3 = data.vector3[i];
        const x = vector3.x;
        const y = vector3.y;
        const z = vector3.z;
        this.group.position.set(x, y, z);
        if (this.gameStateService.state == game_states_1.GameStates.Transition || this.gameStateService.state == game_states_1.GameStates.TransitionEnd) {
            this.group.visible = false;
        }
        else {
            this.group.visible = true;
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
        this.boxHelper = new THREE.Box3Helper(this.box, new three_1.Color(0xffff00));
        this.scene.add(this.boxHelper);
    }
}
exports.default = CubeEntity;
//# sourceMappingURL=cube.entity.js.map