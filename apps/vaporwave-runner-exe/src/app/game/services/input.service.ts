import { EventEmitter, Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as THREE from "three";
import PlayerEntity from "../entities/player.entity";
import { OptionsService } from './options.service';
import { PlaneService } from './plane.service';
import { SunService } from './sun.service';
import { SynthMountainsService } from './synth-mountains.service';
import { GameStateService } from './game-state.service';
import { GameStates } from '../config/game.states';

@Injectable()
export class InputService {

    clock = new THREE.Clock();
    get scene() { return this._scene; }
    private _scene: THREE.Scene;

    private directionVector = new THREE.Vector3();
    private readonly keyDown = new Set<string>();

    private animateTime = 1/18;

    handleESCInput: EventEmitter<any> = new EventEmitter();

    constructor(
      private planeService: PlaneService,
      private optionService: OptionsService,
      private sunService: SunService,
      private mountainService: SynthMountainsService,
      private gameStateService: GameStateService
    ) {}

    initialize(scene: THREE.Scene) {
        this._scene = scene;
        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp);
        this.clock.start();
    }

    handleInput(player: PlayerEntity, mainCamera, planeBuffer, debugCamera, skyBox: THREE.Mesh) {
        if (!player?.group) return;
        const dir = this.directionVector
		mainCamera.getWorldDirection(dir);

        const oldObjectPosition = new THREE.Vector3();
        player?.group?.getWorldPosition(oldObjectPosition);

        const strafeDir = dir.clone()
        const upVector = new THREE.Vector3(0, 1, 0);
        const camUpVector = new THREE.Vector3(1, 0, 0)
        player?.group?.rotateZ(0);

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
            mainCamera?.position.add(new THREE.Vector3(delta.x, 0, delta.z))
            if (this.optionService.DebugCameraConfig.followPlayer) {
                debugCamera?.position.add(delta);
            }
            planeBuffer?.position.add(delta);
            this.sunService.updateSunPosition(delta);
           // skyBox.position.add(delta);

            this.planeService.resetPlaneXPositionLeft(player.group.position.x);

            if (this.gameStateService.state != GameStates.Normal) return;
            this.mountainService.updateMountainPositionRelativeToPlayer(delta);

            return;
        }

        //moving right
        if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
        {
            let vector3 = strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
                    .multiplyScalar(this.optionService.PlayerConfig.speed)
            player.group.position.add(new THREE.Vector3(vector3.x, 0, 0))

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
            mainCamera?.position.add(new THREE.Vector3(delta.x, 0, delta.z))
            if (this.optionService.DebugCameraConfig.followPlayer) {
                debugCamera?.position.add(delta);
            }
            
            planeBuffer?.position.add(delta);
            this.sunService.updateSunPosition(delta);
            //skyBox.position.add(delta);

            this.planeService.resetPlaneXPositionRight(player.group.position.x);

            if (this.gameStateService.state != GameStates.Normal) return;
            this.mountainService.updateMountainPositionRelativeToPlayer(delta);

            return
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
                mainCamera.rotateZ(THREE.MathUtils.degToRad(1/2))
            }

            if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) > 0) {
                mainCamera.rotateZ(THREE.MathUtils.degToRad(-1/2))
            }

            this.clock.start();
        }
    }

    handlePause() {
        if (this.keyDown.has('escape')) {
            this.handleESCInput.emit('esc');
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase());
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyDown.delete(event.key.toLowerCase());
	}
}
