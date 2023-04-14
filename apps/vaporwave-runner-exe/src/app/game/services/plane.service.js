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
exports.PlaneService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const plane_entity_1 = require("../entities/plane.entity");
const random_util_1 = require("../utils/random.util");
const camera_service_1 = require("./camera.service");
const cube_service_1 = require("./cube.service");
const effects_service_1 = require("./effects.service");
const options_service_1 = require("./options.service");
const progression_service_1 = require("./progression.service");
const subscription_service_1 = require("./subscription.service");
let PlaneService = class PlaneService {
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }
    get planes() { return this._planes; }
    set planes(value) { this._planes = value; }
    get planeBuffer() { return this._planeBuffer; }
    set planeBuffer(value) { this._planeBuffer = value; }
    constructor(cameraService, cubeService, effectService, subscriptionService, optionService, progressionService) {
        this.cameraService = cameraService;
        this.cubeService = cubeService;
        this.effectService = effectService;
        this.subscriptionService = subscriptionService;
        this.optionService = optionService;
        this.progressionService = progressionService;
        this._planes = [];
        this.PLANE_CONFIG = this.optionService.PlaneConfig;
        this.columns = this.PLANE_CONFIG.columns;
        this.rows = this.PLANE_CONFIG.rows;
        this.columnIndexes = [];
        this.widthNum = this.PLANE_CONFIG.width;
        this.heightNum = this.PLANE_CONFIG.height;
        this.zStart = -80;
        this.speed = this.PLANE_CONFIG.speed;
        this.resetThreshold = 20;
        this.planeXSpacing = 32;
        this.newDensity = 0;
        this.shouldIncreaseDifficulty = false;
        this.cubesPerPlane = this.optionService.CubeConfig.baseDensity;
    }
    initSubscriptions() {
        // Subscription fires when we increase the difficulty of the game
        // Time should be based on progression service
        this.subscriptionService.updateDifficulty$.subscribe(val => {
            this.speed = val.speed;
            this.shouldIncreaseDifficulty = true;
        });
    }
    initialize(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initSubscriptions();
            this.scene = scene;
            this.cubeService.initialize(scene);
            this.generateColumnIndexes();
            this.generatePlaneBuffer();
            yield this.createPlaneRows();
        });
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
        }));
        this.planes = [];
    }
    generatePlaneBuffer() {
        const mapLoader = new THREE.TextureLoader();
        const checkerboard = mapLoader.load('assets/BG.png');
        this.planeBuffer = new THREE.Mesh(new THREE.PlaneGeometry(140, 50, 10, 10), new THREE.MeshStandardMaterial({ map: checkerboard }));
        this.planeBuffer.castShadow = true;
        this.planeBuffer.receiveShadow = true;
        //this.planeBuffer.rotation.x = 90;
        this.planeBuffer.position.add(new THREE.Vector3(0, 10, -75));
        this.scene.add(this.planeBuffer);
    }
    generateColumnIndexes() {
        for (let i = 0; i < this.columns; i++) {
            this.columnIndexes.push(i);
        }
    }
    animatePlanes() {
        if (this.planes.length <= 0)
            return;
        for (let i = 0; i < this.planes.length; i++) {
            this.resetGroupZPosition(this.planes[i], i);
            for (let z = 0; z < this.planes[i].length; z++) {
                this.planes[i][z].group.position.add(new THREE.Vector3(0, 0, this.speed));
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
    resetPlaneXPositionRight(playerXPosition) {
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
        });
    }
    resetPlaneXPositionLeft(playerXPosition) {
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
        });
    }
    resetGroupZPosition(planeGroup, groupIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (planeGroup[0].group.position.z > this.resetThreshold) {
                planeGroup.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    let resetIndex = groupIndex == 0 ? this.rows - 1 : groupIndex - 1;
                    let resetZPos = this.planes[resetIndex][0].group.position.z - this.heightNum;
                    let newPosition = new THREE.Vector3(element.group.position.x, element.group.position.y, resetZPos);
                    element.resetToPosition(newPosition);
                    if (!(planeGroup[0].group.children.length > 1)) {
                        let vector3s = random_util_1.RandomUtils.generateVector3s(this.cubesPerPlane);
                        yield this.cubeService.createCubes(element, groupIndex, vector3s);
                        return;
                    }
                    // we need to draw new cubes, then we need to draw here
                    this.createNewCubesForPlane(planeGroup, element, groupIndex);
                    let vector3s = random_util_1.RandomUtils.generateVector3s(this.cubesPerPlane);
                    yield this.cubeService.redrawCubes(groupIndex, element, vector3s);
                }));
            }
        });
    }
    createPlaneRows() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.rows; i++) {
                let positionFactor = (i * this.planeXSpacing) * -1;
                yield this.createPlanes(positionFactor, i == this.rows - 1, i);
            }
        });
    }
    createPlanes(zPosition, shouldDrawCubes, row) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempArr = [];
            for (let i = 0; i < this.columns; i++) {
                let midIndex = this.median();
                let positionFactor = (i - midIndex) * this.widthNum;
                const plane = new plane_entity_1.default(this.effectService, this.cameraService, this.subscriptionService, this.optionService);
                yield plane.initialize(positionFactor, zPosition);
                if (shouldDrawCubes) {
                    yield this.cubeService.drawCubes$.next({ plane: plane, row: row });
                }
                tempArr.push(plane);
                this.scene.add(plane.group);
            }
            this.planes.push(tempArr);
        });
    }
    createNewCubesForPlane(planeGroup, element, row) {
        return __awaiter(this, void 0, void 0, function* () {
            if (planeGroup[0].group.children.length - 1 < this.newDensity) {
                let indexes = [];
                for (let i = 0; i < (this.newDensity - (planeGroup[0].group.children.length - 1)); i++) {
                    let newI = i;
                    indexes.push(newI + (planeGroup[0].group.children.length - 1));
                }
                yield this.cubeService.createNewCubes(element, row, indexes.length, indexes);
            }
        });
    }
    median() {
        const sorted = Array.from(this.columnIndexes).sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }
};
PlaneService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [camera_service_1.CameraService,
        cube_service_1.CubeService,
        effects_service_1.EffectsService,
        subscription_service_1.SubscriptionService,
        options_service_1.OptionsService,
        progression_service_1.ProgressionService])
], PlaneService);
exports.PlaneService = PlaneService;
//# sourceMappingURL=plane.service.js.map