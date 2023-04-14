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
exports.InputService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const options_service_1 = require("./options.service");
const plane_service_1 = require("./plane.service");
const sun_service_1 = require("./sun.service");
const synth_mountains_service_1 = require("./synth-mountains.service");
const game_state_service_1 = require("./game-state.service");
const game_states_1 = require("../config/game.states");
let InputService = class InputService {
    get scene() { return this._scene; }
    constructor(planeService, optionService, sunService, mountainService, gameStateService) {
        this.planeService = planeService;
        this.optionService = optionService;
        this.sunService = sunService;
        this.mountainService = mountainService;
        this.gameStateService = gameStateService;
        this.clock = new THREE.Clock();
        this.directionVector = new THREE.Vector3();
        this.keyDown = new Set();
        this.animateTime = 1 / 18;
        this.handleESCInput = new core_1.EventEmitter();
        this.handleKeyDown = (event) => {
            this.keyDown.add(event.key.toLowerCase());
        };
        this.handleKeyUp = (event) => {
            this.keyDown.delete(event.key.toLowerCase());
        };
    }
    initialize(scene) {
        this._scene = scene;
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        this.clock.start();
    }
    handleInput(player, mainCamera, planeBuffer, debugCamera, skyBox) {
        var _a, _b;
        if (!(player === null || player === void 0 ? void 0 : player.group))
            return;
        const dir = this.directionVector;
        mainCamera.getWorldDirection(dir);
        const oldObjectPosition = new THREE.Vector3();
        (_a = player === null || player === void 0 ? void 0 : player.group) === null || _a === void 0 ? void 0 : _a.getWorldPosition(oldObjectPosition);
        const strafeDir = dir.clone();
        const upVector = new THREE.Vector3(0, 1, 0);
        const camUpVector = new THREE.Vector3(1, 0, 0);
        (_b = player === null || player === void 0 ? void 0 : player.group) === null || _b === void 0 ? void 0 : _b.rotateZ(0);
        //moving left
        if (this.keyDown.has('a') || this.keyDown.has('arrowleft')) {
            const vector3 = strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
                .multiplyScalar(this.optionService.PlayerConfig.speed);
            player.group.position.add(new THREE.Vector3(vector3.x, 0, 0));
            player.box.setFromObject(player.group);
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) < 8) {
                player.group.rotateZ(THREE.MathUtils.degToRad(8));
                // if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) < 1) {
                //     mainCamera.rotateZ(THREE.MathUtils.degToRad(1))
                // }
            }
            const newObjectPosition = new THREE.Vector3();
            player.group.getWorldPosition(newObjectPosition);
            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            mainCamera === null || mainCamera === void 0 ? void 0 : mainCamera.position.add(new THREE.Vector3(delta.x, 0, delta.z));
            if (this.optionService.DebugCameraConfig.followPlayer) {
                debugCamera === null || debugCamera === void 0 ? void 0 : debugCamera.position.add(delta);
            }
            planeBuffer === null || planeBuffer === void 0 ? void 0 : planeBuffer.position.add(delta);
            this.sunService.updateSunPosition(delta);
            // skyBox.position.add(delta);
            this.planeService.resetPlaneXPositionLeft(player.group.position.x);
            if (this.gameStateService.state != game_states_1.GameStates.Normal)
                return;
            this.mountainService.updateMountainPositionRelativeToPlayer(delta);
            return;
        }
        //moving right
        if (this.keyDown.has('d') || this.keyDown.has('arrowright')) {
            let vector3 = strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
                .multiplyScalar(this.optionService.PlayerConfig.speed);
            player.group.position.add(new THREE.Vector3(vector3.x, 0, 0));
            player.box.setFromObject(player.group);
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) > -8) {
                player.group.rotateZ(THREE.MathUtils.degToRad(-8));
                // if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) > -1) {
                //     mainCamera.rotateZ(THREE.MathUtils.degToRad(-1))
                // }
            }
            const newObjectPosition = new THREE.Vector3();
            player.group.getWorldPosition(newObjectPosition);
            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            mainCamera === null || mainCamera === void 0 ? void 0 : mainCamera.position.add(new THREE.Vector3(delta.x, 0, delta.z));
            if (this.optionService.DebugCameraConfig.followPlayer) {
                debugCamera === null || debugCamera === void 0 ? void 0 : debugCamera.position.add(delta);
            }
            planeBuffer === null || planeBuffer === void 0 ? void 0 : planeBuffer.position.add(delta);
            this.sunService.updateSunPosition(delta);
            //skyBox.position.add(delta);
            this.planeService.resetPlaneXPositionRight(player.group.position.x);
            if (this.gameStateService.state != game_states_1.GameStates.Normal)
                return;
            this.mountainService.updateMountainPositionRelativeToPlayer(delta);
            return;
        }
        if (this.clock.getElapsedTime() > this.animateTime) {
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) < 0) {
                player.group.rotateZ(THREE.MathUtils.degToRad(8));
            }
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) > 0) {
                player.group.rotateZ(THREE.MathUtils.degToRad(-8));
            }
            //camera reset
            if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) < 0) {
                mainCamera.rotateZ(THREE.MathUtils.degToRad(1 / 2));
            }
            if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) > 0) {
                mainCamera.rotateZ(THREE.MathUtils.degToRad(-1 / 2));
            }
            this.clock.start();
        }
    }
    handlePause() {
        if (this.keyDown.has('escape')) {
            this.handleESCInput.emit('esc');
        }
    }
};
InputService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [plane_service_1.PlaneService,
        options_service_1.OptionsService,
        sun_service_1.SunService,
        synth_mountains_service_1.SynthMountainsService,
        game_state_service_1.GameStateService])
], InputService);
exports.InputService = InputService;
//# sourceMappingURL=input.service.js.map