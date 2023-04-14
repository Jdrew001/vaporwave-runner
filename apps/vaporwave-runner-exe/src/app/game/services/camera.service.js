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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const options_service_1 = require("./options.service");
let CameraService = class CameraService {
    get mainCamera() { return this._mainCamera; }
    set mainCamera(value) { this._mainCamera = value; }
    get debugCamera() { return this._debugCamera; }
    set debugCamera(value) { this._debugCamera = value; }
    set renderer(value) { this._renderer = value; }
    get renderer() { return this._renderer; }
    constructor(optionService) {
        this.optionService = optionService;
        this.MAIN_CAMERA_CONFIG = this.optionService.GameCameraConfig;
        this.DEBUG_CAMERA_CONFIG = this.optionService.DebugCameraConfig;
        this.isDebugActive = false;
    }
    initialize(renderer) {
        document.addEventListener("resize", this.resizeCamera);
        this.createMainCamera();
        this.createDebugCamera();
        this.renderer = renderer;
    }
    getFieldOfView() {
        return this.mainCamera.fov;
    }
    getHeightOfView(dist) {
        let vFOV = THREE.MathUtils.degToRad(this.getFieldOfView());
        return 2 * Math.tan(vFOV / 2) * dist;
    }
    getWidthOfView(dist) {
        return this.getHeightOfView(dist) * this.mainCamera.aspect;
    }
    resizeCamera() {
        this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        this.mainCamera.updateProjectionMatrix();
        let insetWidth = window.innerHeight / 4;
        let insetHeight = window.innerWidth / 4;
        this.debugCamera.aspect = insetWidth / insetHeight;
        this.debugCamera.updateProjectionMatrix();
    }
    createMainCamera() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.mainCamera = new THREE.PerspectiveCamera(this.MAIN_CAMERA_CONFIG.fov, width / height, this.MAIN_CAMERA_CONFIG.near, this.MAIN_CAMERA_CONFIG.far);
        this.mainCamera.name = "MAIN CAMERA";
        this.mainCamera.position.set(this.MAIN_CAMERA_CONFIG.position.x, this.MAIN_CAMERA_CONFIG.position.y, this.MAIN_CAMERA_CONFIG.position.z);
        const rotation = this.mainCamera.rotation;
        this.mainCamera.rotation.set(this.MAIN_CAMERA_CONFIG.rotationX, rotation.y, rotation.z);
    }
    createDebugCamera() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.debugCamera = new THREE.PerspectiveCamera(this.DEBUG_CAMERA_CONFIG.fov, width / height, this.DEBUG_CAMERA_CONFIG.near, this.DEBUG_CAMERA_CONFIG.far);
        this.debugCamera.name = "DEBUG CAMERA";
        this.debugCamera.position.set(this.DEBUG_CAMERA_CONFIG.x, this.DEBUG_CAMERA_CONFIG.y, this.DEBUG_CAMERA_CONFIG.z);
        const rotation = this.debugCamera.rotation;
        this.debugCamera.rotation.set(this.DEBUG_CAMERA_CONFIG.rotateX, rotation.y, rotation.z);
        //this.mainCamera.add(this.debugCamera);
    }
};
CameraService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [options_service_1.OptionsService])
], CameraService);
exports.CameraService = CameraService;
//# sourceMappingURL=camera.service.js.map