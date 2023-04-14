import { Injectable } from '@angular/core';
import GUI from 'lil-gui';
import { CameraService } from './camera.service';
import { OptionsService } from './options.service';

@Injectable()
export class DebugService {

  private _gui;
  get gui(): GUI { return this._gui; }
  private set gui(value) { this._gui = value; }

  //private cameraManager = Container.get(CameraManager);

  constructor(
    private cameraService: CameraService,
    private optionService: OptionsService
  ) {}

  initialize() {
      this.gui = new GUI();
      this.gui.close();
      this.gui.title('Cube Runner Debug')
  }

  playerDebugOptions(player) {
    const playerFolder = this.gui.addFolder('Player Options');
    playerFolder.add(this.optionService.PlayerConfig, "scale").onChange(() => {
        player.group.scale.set(this.optionService.PlayerConfig.scale, this.optionService.PlayerConfig.scale, this.optionService.PlayerConfig.scale)
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
          mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ)
      });

      camFolder.add(this.optionService.GameCameraConfig, "positionY").onChange(() => {
          mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ)
      });

      camFolder.add(this.optionService.GameCameraConfig, "positionZ").onChange(() => {
          mainCamera.position.set(this.optionService.GameCameraConfig.positionX, this.optionService.GameCameraConfig.positionY, this.optionService.GameCameraConfig.positionZ)
      });
  }

  debugCameraOptions(debugCamera) {
      const camFolder = this.gui.addFolder('Debug Camera Options');
      camFolder.add(this.optionService.DebugCameraConfig, 'isActive').onChange(() => {
          this.cameraService.isDebugActive = this.optionService.DebugCameraConfig.isActive;
      });

      camFolder.add(this.optionService.DebugCameraConfig, 'followPlayer')

      camFolder.add(this.optionService.DebugCameraConfig, "x").onChange(() => {
          debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z)
      });

      camFolder.add(this.optionService.DebugCameraConfig, "y").onChange(() => {
          debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z)
      });

      camFolder.add(this.optionService.DebugCameraConfig, "z").onChange(() => {
          debugCamera.position.set(this.optionService.DebugCameraConfig.x, this.optionService.DebugCameraConfig.y, this.optionService.DebugCameraConfig.z)
      });
  }

  LightOptions() {
      const lightFolder = this.gui.addFolder('Light Options');
      lightFolder.addColor(this.optionService.LightConfig, 'color', 255)
  }

  CubeOptions() {

}
}
