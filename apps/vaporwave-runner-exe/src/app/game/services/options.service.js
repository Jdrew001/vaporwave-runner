"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
let OptionsService = class OptionsService {
    constructor() {
        this.gameOptions = {
            cameraRotationX: 0,
        };
        this.PlayerConfig = {
            position: new THREE.Vector3(0, 0.3, -2),
            scale: 0.2,
            speed: 0.10
        };
        this.GameCameraConfig = {
            position: new THREE.Vector3(0, 2.5, 4.5),
            positionX: 0,
            positionY: 3,
            positionZ: 4.5,
            rotation: new THREE.Vector3(0, 0.00, 0),
            rotationX: THREE.MathUtils.degToRad(-5),
            fov: 40,
            aspect: 1,
            near: 1,
            far: 95
        };
        this.DebugCameraConfig = {
            x: 0,
            y: 35,
            z: -10,
            isActive: false,
            followPlayer: false,
            rotateX: THREE.MathUtils.degToRad(-90),
            fov: 90,
            aspect: 1,
            near: 0.01,
            far: 600
        };
        this.DebugConfig = {
            showCollisionBoxes: false
        };
        this.LightConfig = {
            color: 0xFFFFFF,
            intensity: 1
        };
        this.CubeConfig = {
            scale: 0.3,
            position: new THREE.Vector3(0, 0.1, -6),
            baseDensity: 35
        };
        this.PlaneConfig = {
            position: new THREE.Vector3(0, 0, -25),
            scale: 0.2,
            speed: 0.45,
            rows: 4,
            columns: 4,
            width: 32.2,
            height: 32.2,
            isAnimating: false
        };
    }
};
OptionsService = __decorate([
    (0, core_1.Injectable)()
], OptionsService);
exports.OptionsService = OptionsService;
//# sourceMappingURL=options.service.js.map