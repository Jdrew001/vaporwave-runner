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
exports.EffectsService = void 0;
const core_1 = require("@angular/core");
const postprocessing_1 = require("postprocessing");
const THREE = require("three");
const camera_service_1 = require("./camera.service");
let EffectsService = class EffectsService {
    get renderer() {
        return this._renderer;
    }
    set renderer(value) {
        this._renderer = value;
    }
    get scene() {
        return this._scene;
    }
    set scene(value) {
        this._scene = value;
    }
    get outlineEffect() {
        return this._outlineEffect;
    }
    set outlineEffect(value) {
        this._outlineEffect = value;
    }
    get mainComposer() {
        return this._composer;
    }
    set mainComposer(value) {
        this._composer = value;
    }
    get renderPass() {
        return this._renderPass;
    }
    set renderPass(value) {
        this._renderPass = value;
    }
    get debugPass() {
        return this._debugPass;
    }
    set debugPass(value) {
        this._debugPass = value;
    }
    get debugComposer() {
        return this._debugComposer;
    }
    set debugComposer(value) {
        this._debugComposer = value;
    }
    get mainCamera() {
        return this.cameraService.mainCamera;
    }
    get debugCamera() {
        return this.cameraService.debugCamera;
    }
    get noiseEffect() { return this._noiseEffect; }
    set noiseEffect(value) { this._noiseEffect = value; }
    get scanLineEffect() { return this._scanLineEffect; }
    set scanLineEffect(value) { this._scanLineEffect = value; }
    constructor(cameraService) {
        this.cameraService = cameraService;
        this.selectedOutlineObjects = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.noiseEffectMatrix = {
            100: { opacity: 0.2 },
            75: { opacity: 0.8 },
            50: { opacity: 1.0 },
            25: { opacity: 1.5 },
            0: { opacity: 2.0 }
        };
        this.scanLineEffectMatrix = {
            100: { opacity: 0.08, scrollSpeed: 0.01 },
            75: { opacity: 0.09, scrollSpeed: 0.02 },
            50: { opacity: 0.10, scrollSpeed: 0.03 },
            25: { opacity: 0.11, scrollSpeed: 0.04 },
            0: { opacity: 0.12, scrollSpeed: 0.05 }
        };
    }
    initWebGLRenderer() {
    }
    initalize(canvas, scene) {
        this.scene = scene;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas
        });
        this.cameraService.initialize(this.renderer);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.autoClear = true;
    }
    destroyRender() {
        this.renderer.dispose();
        this.scene = null;
    }
    initalizeMainSceneEffects() {
        // RENDER PASS
        this.renderPass = new postprocessing_1.RenderPass(this.scene, this.mainCamera);
        this.renderPass.enabled = true;
        this.initNoiseEffect();
        this.initScanLineEffect();
        this.mainScreenPass = new postprocessing_1.EffectPass(this.mainCamera, this.smaaEffect(), this.bloomEffect(), this.depthOfFieldEffect(), this.vignetteEffect());
        this.scanNoisePass = new postprocessing_1.EffectPass(this.mainCamera, this.scanLineEffect, this.noiseEffect);
        this.mainComposer = new postprocessing_1.EffectComposer(this.renderer);
        this.mainComposer.autoRenderToScreen = true;
        this.mainComposer.addPass(this.renderPass);
        this.mainComposer.addPass(this.mainScreenPass);
        this.mainComposer.addPass(this.scanNoisePass);
    }
    initalizeDebugSceneEffects() {
        // RENDER PASS
        this.debugPass = new postprocessing_1.RenderPass(this.scene, this.debugCamera);
        this.debugPass.enabled = true;
        const pass = new postprocessing_1.EffectPass(this.debugCamera, this.smaaEffect(), this.initOutlineEffect());
        pass.renderToScreen = true;
        this.debugComposer = new postprocessing_1.EffectComposer(this.renderer);
        this.debugComposer.addPass(this.debugPass);
        this.debugComposer.addPass(pass);
    }
    update() {
        var _a, _b;
        if (this.cameraService.isDebugActive) {
            (_a = this.debugComposer) === null || _a === void 0 ? void 0 : _a.render();
        }
        else {
            (_b = this.mainComposer) === null || _b === void 0 ? void 0 : _b.render();
        }
    }
    updateOutlineSelection(obj) {
        this.outlineEffect.selection.add(obj);
    }
    updateScreenEffects(value) {
        const scanLineData = this.scanLineEffectMatrix[value];
        const noiseEffectData = this.noiseEffectMatrix[value];
        if (!scanLineData || !noiseEffectData)
            return;
        this.scanLineEffect.scrollSpeed = scanLineData.scrollSpeed;
        this.scanLineEffect.blendMode.opacity.value = scanLineData.opacity;
        this.noiseEffect.blendMode.opacity.value = noiseEffectData.opacity;
    }
    initOutlineEffect() {
        this.outlineEffect = new postprocessing_1.OutlineEffect(this.scene, this.debugCamera, {
            blendFunction: postprocessing_1.BlendFunction.SCREEN,
            edgeStrength: 1,
            pulseSpeed: 4,
            resolutionX: window.innerWidth,
            resolutionY: window.innerWidth,
            blur: false,
            xRay: false
        });
        this.outlineEffect.selection.set(this.selectedOutlineObjects);
        return this.outlineEffect;
    }
    smaaEffect() {
        let effect = new postprocessing_1.SMAAEffect({
            preset: postprocessing_1.SMAAPreset.HIGH,
            edgeDetectionMode: postprocessing_1.EdgeDetectionMode.DEPTH
        });
        effect.edgeDetectionMaterial.edgeDetectionThreshold = 0.01;
        return effect;
    }
    bloomEffect() {
        return new postprocessing_1.BloomEffect({
            resolutionX: window.innerWidth,
            resolutionY: window.innerWidth,
            intensity: 1.4,
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0,
            kernelSize: postprocessing_1.KernelSize.HUGE
        });
    }
    depthOfFieldEffect() {
        return new postprocessing_1.DepthOfFieldEffect(this.mainCamera, {
            focusDistance: 0.0,
            focalLength: 2,
            bokehScale: 2.0,
            height: 1080
        });
    }
    initNoiseEffect() {
        this.noiseEffect = new postprocessing_1.NoiseEffect({
            blendFunction: postprocessing_1.BlendFunction.OVERLAY
        });
        this.noiseEffect.blendMode.opacity.value = 0.2;
    }
    initScanLineEffect() {
        this.scanLineEffect = new postprocessing_1.ScanlineEffect({
            blendFunction: postprocessing_1.BlendFunction.MULTIPLY,
            density: 0.5,
        });
        this.scanLineEffect.scrollSpeed = 0.02;
        this.scanLineEffect.blendMode.opacity.value = 0.08;
    }
    vignetteEffect() {
        const effect = new postprocessing_1.VignetteEffect();
        effect.darkness = 0.5;
        return effect;
    }
};
EffectsService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [camera_service_1.CameraService])
], EffectsService);
exports.EffectsService = EffectsService;
//# sourceMappingURL=effects.service.js.map