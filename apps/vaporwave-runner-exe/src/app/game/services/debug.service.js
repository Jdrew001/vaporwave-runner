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
exports.DebugService = void 0;
const core_1 = require("@angular/core");
const lil_gui_1 = require("lil-gui");
const camera_service_1 = require("./camera.service");
const options_service_1 = require("./options.service");
let DebugService = class DebugService {
    get gui() { return this._gui; }
    set gui(value) { this._gui = value; }
    //private cameraManager = Container.get(CameraManager);
    constructor(cameraService, optionService) {
        this.cameraService = cameraService;
        this.optionService = optionService;
    }
    initialize() {
        this.gui = new lil_gui_1.default();
        this.gui.close();
        this.gui.title('Cube Runner Debug');
    }
    playerDebugOptions(player) {
        const playerFolder = this.gui.addFolder('Player Options');
        playerFolder.add(this.optionService.PlayerConfig, "scale").onChange(() => {
            player.group.scale.set(this.optionService.PlayerConfig.scale, this.optionService.PlayerConfig.scale, this.optionService.PlayerConfig.scale);
        });
        playerFolder.add(this.optionService.PlayerConfig, "speed");
    }
    planeDebugOptions() {
        const planeFolder = this.gui.addFolder('Plane Options');
        planeFolder.add(this.optionService.PlaneConfig, "isAnimating");
        planeFolder.add(this.optionService.PlaneConfig, "speed");
        planeFolder.add(this.optionService.PlaneConfig, "rows");
        planeFolder.add(this.optionService.PlaneConfig, "columns");
        planeFolder.add(this.optionService.PlaneConfig, "width");
        planeFolder.add(this.optionService.PlaneConfig, "height");
    }
    gameCameraOptions(mainCamera) {
        const camFolder = this.gui.addFolder('Main Camera Options');
        camFolder.add(this.optionService.GameCameraConfig, "positionX").onChange(() => {
            mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ);
        });
        camFolder.add(this.optionService.GameCameraConfig, "positionY").onChange(() => {
            mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ);
        });
        camFolder.add(this.optionService.GameCameraConfig, "positionZ").onChange(() => {
            mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ);
        });
    }
    debugCameraOptions(debugCamera) {
        const camFolder = this.gui.addFolder('Debug Camera Options');
        camFolder.add(this.optionService.DebugCameraConfig, 'isActive').onChange(() => {
            this.cameraService.isDebugActive = this.optionService.DebugCameraConfig.isActive;
        });
        camFolder.add(this.optionService.DebugCameraConfig, 'followPlayer');
        camFolder.add(this.optionService.DebugCameraConfig, "x").onChange(() => {
            debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z);
        });
        camFolder.add(this.optionService.DebugCameraConfig, "y").onChange(() => {
            debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z);
        });
        camFolder.add(this.optionService.DebugCameraConfig, "z").onChange(() => {
            debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z);
        });
    }
    LightOptions() {
        const lightFolder = this.gui.addFolder('Light Options');
        lightFolder.addColor(this.optionService.LightConfig, 'color', 255);
    }
    CubeOptions() {
    }
};
DebugService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [camera_service_1.CameraService,
        options_service_1.OptionsService])
], DebugService);
exports.DebugService = DebugService;
//# sourceMappingURL=debug.service.js.map