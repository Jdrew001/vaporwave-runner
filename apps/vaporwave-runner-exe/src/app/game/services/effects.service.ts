import {
  Injectable
} from '@angular/core';
import { BloomEffect, EdgeDetectionMode, EffectComposer, EffectPass, KernelSize, RenderPass, SMAAEffect, SMAAPreset, OutlineEffect, BlendFunction, DepthOfFieldEffect, ShaderPass, ScanlineEffect, NoiseEffect, VignetteEffect } from "postprocessing";
import * as THREE from "three";
import { CameraService } from './camera.service';

@Injectable()
export class EffectsService {

  private _renderer: THREE.WebGLRenderer;
  get renderer() {
    return this._renderer;
  }
  set renderer(value) {
    this._renderer = value;
  }

  private _scene: THREE.Scene;
  get scene() {
    return this._scene;
  }
  set scene(value) {
    this._scene = value;
  }

  private _outlineEffect: OutlineEffect
  get outlineEffect(): OutlineEffect {
    return this._outlineEffect;
  }
  set outlineEffect(value) {
    this._outlineEffect = value;
  }

  private _composer: EffectComposer;
  get mainComposer() {
    return this._composer;
  }
  set mainComposer(value) {
    this._composer = value;
  }

  private _renderPass: RenderPass;
  get renderPass() {
    return this._renderPass;
  }
  set renderPass(value) {
    this._renderPass = value;
  }

  private _debugPass: RenderPass;
  get debugPass() {
    return this._debugPass;
  }
  set debugPass(value) {
    this._debugPass = value;
  }

  private _debugComposer: EffectComposer;
  get debugComposer() {
    return this._debugComposer;
  }
  set debugComposer(value) {
    this._debugComposer = value;
  }

  selectedOutlineObjects = [];
  private width = window.innerWidth;
  private height = window.innerHeight;


  get mainCamera() {
    return this.cameraService.mainCamera;
  }
  get debugCamera() {
    return this.cameraService.debugCamera;
  }

  _noiseEffect: NoiseEffect;
  get noiseEffect() { return this._noiseEffect; }
  set noiseEffect(value) { this._noiseEffect = value; }

  _scanLineEffect: ScanlineEffect;
  get scanLineEffect() { return this._scanLineEffect; }
  set scanLineEffect(value) { this._scanLineEffect = value; }

  mainScreenPass: EffectPass;
  scanNoisePass: EffectPass;

  private noiseEffectMatrix = {
    100: { opacity: 0.2 },
    75: { opacity: 0.8 },
    50: { opacity: 1.0 },
    25: { opacity: 1.5 },
    0: { opacity: 2.0 }
  }

  private scanLineEffectMatrix = {
    100: { opacity: 0.08, scrollSpeed: 0.01 },
    75: { opacity: 0.09, scrollSpeed: 0.02 },
    50: { opacity: 0.10, scrollSpeed: 0.03 },
    25: { opacity: 0.11, scrollSpeed: 0.04 },
    0: { opacity: 0.12, scrollSpeed: 0.05 }
  }

  constructor(
    private cameraService: CameraService
  ) {}

  initWebGLRenderer() {

  }

  initalize(canvas, scene: THREE.Scene) {
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
    this.renderPass = new RenderPass(this.scene, this.mainCamera);
    this.renderPass.enabled = true;
    this.initNoiseEffect()
    this.initScanLineEffect();

    this.mainScreenPass = new EffectPass(this.mainCamera,
      this.smaaEffect(),
      this.bloomEffect(),
      this.depthOfFieldEffect(),
      this.vignetteEffect());
    this.scanNoisePass = new EffectPass(this.mainCamera, 
      this.scanLineEffect,
      this.noiseEffect)
    this.mainComposer = new EffectComposer(this.renderer);
    this.mainComposer.autoRenderToScreen = true;
    this.mainComposer.addPass(this.renderPass);
    this.mainComposer.addPass(this.mainScreenPass);
    this.mainComposer.addPass(this.scanNoisePass)
  }

  initalizeDebugSceneEffects() {
    // RENDER PASS
    this.debugPass = new RenderPass(this.scene, this.debugCamera);
    this.debugPass.enabled = true;

    const pass = new EffectPass(this.debugCamera, this.smaaEffect(), this.initOutlineEffect())

    pass.renderToScreen = true;
    this.debugComposer = new EffectComposer(this.renderer);
    this.debugComposer.addPass(this.debugPass);
    this.debugComposer.addPass(pass);
  }

  update() {
    if (this.cameraService.isDebugActive) {
      this.debugComposer?.render();
    } else {
      this.mainComposer?.render();
    }
  }

  updateOutlineSelection(obj) {
    this.outlineEffect.selection.add(obj);
  }

  updateScreenEffects(value: number) {
    const scanLineData = this.scanLineEffectMatrix[value];
    const noiseEffectData = this.noiseEffectMatrix[value];
    if (!scanLineData || !noiseEffectData) return;

    this.scanLineEffect.scrollSpeed = scanLineData.scrollSpeed;
    this.scanLineEffect.blendMode.opacity.value = scanLineData.opacity;

    this.noiseEffect.blendMode.opacity.value = noiseEffectData.opacity;
  }

  private initOutlineEffect() {
    this.outlineEffect = new OutlineEffect(this.scene, this.debugCamera, {
      blendFunction: BlendFunction.SCREEN,
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

  private smaaEffect() {
    let effect = new SMAAEffect({
      preset: SMAAPreset.HIGH,
      edgeDetectionMode: EdgeDetectionMode.DEPTH
    })
    effect.edgeDetectionMaterial.edgeDetectionThreshold = 0.01;
    return effect;
  }

  private bloomEffect() {
    return new BloomEffect({
      resolutionX: window.innerWidth,
      resolutionY: window.innerWidth,
      intensity: 1.4,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0,
      kernelSize: KernelSize.HUGE
    })
  }

  private depthOfFieldEffect() {
    return new DepthOfFieldEffect(this.mainCamera, {
      focusDistance: 0.0,
      focalLength: 2,
      bokehScale: 2.0,
      height: 1080
    });
  }

  private initNoiseEffect() {
    this.noiseEffect = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY
    });

    this.noiseEffect.blendMode.opacity.value = 0.2;
  }

  private initScanLineEffect() {
    this.scanLineEffect = new ScanlineEffect({
      blendFunction: BlendFunction.MULTIPLY,
      density: 0.5,
    });

    this.scanLineEffect.scrollSpeed = 0.02;
    this.scanLineEffect.blendMode.opacity.value = 0.08;
  }

  private vignetteEffect() {
    const effect = new VignetteEffect();
    effect.darkness = 0.5;
    return effect;
  }
}
