import { Injectable } from '@angular/core';
import CubeEntity from '../entities/cube.entity';
import PlayerEntity from '../entities/player.entity';
import { SubscriptionService } from './subscription.service';
import { SynthMountainsService } from './synth-mountains.service';

@Injectable()
export class CollisionService {

  private _player: PlayerEntity;
  get player() { return this._player; }
  set player(value) { this._player = value; }

  private collidedWithMountain = false;
  private mountainThreshold = 5.55112123125783e-17;

  constructor(
    private subscriptionService: SubscriptionService,
    private mountainService: SynthMountainsService
  ) {}

  initialize(playerEntity: PlayerEntity) {
      this.player = playerEntity;
  }

  checkForCollision(entity: CubeEntity) {
      const playerBox = this.player?.box;

      if (!playerBox)return;

      if (entity.group.visible && playerBox.intersectsBox(entity.box)) {
          entity.group.visible = false;

          this.subscriptionService.collisionOccurred$.next(false);
      }
  }

  checkForPlayerCollision() {
    // if (!this.player?.leftRaycaster) return;
    
    // const leftIntersection = this.player.leftRaycaster.intersectObjects(this.mountainService.mountainMeshs);
  
    // if (leftIntersection.length > 0) {
    //   // Sort the intersections by distance from the player
    //   leftIntersection.sort((a, b) => a.distance - b.distance);
  
    //   // Check if the player's raycast intersects with the closest mountain mesh

    //   const isIntersecting = leftIntersection[0].distance <= this.mountainThreshold; // Adjust the distance threshold as neededa
    //   if (isIntersecting && !this.collidedWithMountain) {
    //     this.collidedWithMountain = true;
    //     this.subscriptionService.collisionOccurred$.next(true);
    //   }
    // }
  }
}
