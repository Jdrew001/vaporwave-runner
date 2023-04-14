"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CubeService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const asset_config_1 = require("../config/asset.config");
const cube_entity_1 = require("../entities/cube.entity");
const random_util_1 = require("../utils/random.util");
const THREE = require("three");
const subscription_service_1 = require("./subscription.service");
const loader_service_1 = require("./loader.service");
const collision_service_1 = require("./collision.service");
const options_service_1 = require("./options.service");
const environment_1 = require("../../../environments/environment");
const game_state_service_1 = require("./game-state.service");
let CubeService = class CubeService {
    get isProduction() { return environment_1.APP_CONFIG.production; }
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }
    get cubeGroup() { return this._cubeGroup; }
    set cubeGroup(group) { this._cubeGroup = group; }
    get cubeMtl() { return this._cubeMtl; }
    set cubeMtl(value) { this._cubeMtl = value; }
    constructor(subscriptionService, loaderService, collisionService, optionService, gameStateService) {
        this.subscriptionService = subscriptionService;
        this.loaderService = loaderService;
        this.collisionService = collisionService;
        this.optionService = optionService;
        this.gameStateService = gameStateService;
        this.maxCubes = this.optionService.CubeConfig.baseDensity;
        this.drawCubes$ = new rxjs_1.Subject();
    }
    initialize(scene) {
        this.scene = scene;
        this.preloadCubeMaterial();
        this.drawCubes$.pipe((0, rxjs_1.delay)(100)).subscribe((data) => {
            let vector3s = random_util_1.RandomUtils.generateVector3s(this.optionService.CubeConfig.baseDensity);
            this.createCubes(data.plane, data.row, vector3s);
        });
    }
    preloadCubeMaterial() {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = asset_config_1.default.SQUARE_ENTITY_PATHS;
            this.cubeMtl = yield this.loaderService.loadEntityMtl(configs.MTL);
        });
    }
    update() {
        this.subscriptionService.checkForCubeIntersection$.next(true);
    }
    // TODO: Check if a cube is colliding with another cube, then redraw one of the cubes
    createCubes(plane, row, vector3s) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < vector3s.length; i++) {
                const cube = new cube_entity_1.default(this.scene, this.subscriptionService, this.collisionService, this.optionService, this.gameStateService);
                yield cube.initialize(this.cubeMtl, i);
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
        });
    }
    createNewCubes(plane, row, count, indexes) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < count; i++) {
                const cube = new cube_entity_1.default(this.scene, this.subscriptionService, this.collisionService, this.optionService, this.gameStateService);
                yield cube.initialize(this.cubeMtl, indexes[i]);
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
        });
    }
    redrawCubes(row, planeEntity, vector3s) {
        return __awaiter(this, void 0, void 0, function* () {
            this.subscriptionService.redrawCube$.next({ row: row, vector3: vector3s });
        });
    }
};
CubeService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        loader_service_1.LoaderService,
        collision_service_1.CollisionService,
        options_service_1.OptionsService,
        game_state_service_1.GameStateService])
], CubeService);
exports.CubeService = CubeService;
//# sourceMappingURL=cube.service.js.map