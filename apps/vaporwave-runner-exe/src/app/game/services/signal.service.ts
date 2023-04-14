import { Injectable } from '@angular/core';
import * as THREE from "three";
import { EffectsService } from './effects.service';

@Injectable()
export class SignalService {

  private readonly MAX_SIGNAL = 100;
  private readonly REGEN_RATE = 1; // RATE PER SECONDS
  private readonly REGEN_DELAY = 15;
  private readonly PLAYER_SIGNAL_LOSS_RATE = 1/4;

  private clock = new THREE.Clock();
  private timeElapsed: number = 0;

  private _playerSignal: number = 100;
  get playerSignal() { return this._playerSignal; }
  set playerSignal(value) { this._playerSignal = value; }

  public isAnimationOccuring: boolean = false;

  constructor(
    private effectService: EffectsService
  ) { }

  update() {
    this.regenerateSignal(this.clock.getDelta())
  }

  damagePlayerSignal() {
    if (this.playerSignal <= 0) return;
    this.playerSignal = this.playerSignal - (100 * this.PLAYER_SIGNAL_LOSS_RATE);
    this.effectService.updateScreenEffects(this.playerSignal);
  }

  regenerateSignal(deltaTime) {
    this.timeElapsed += deltaTime;
    if (this.playerSignal >= this.MAX_SIGNAL || this.playerSignal <= 0) return;
    if (this.isAnimationOccuring) {
      this.timeElapsed = 0;
      return;
    }
    if (this.timeElapsed >= this.REGEN_DELAY) {
      this.playerSignal = this.playerSignal + (100 * this.PLAYER_SIGNAL_LOSS_RATE);
      this.effectService.updateScreenEffects(this.playerSignal);

      this.timeElapsed = 0;
    }
  }
}
