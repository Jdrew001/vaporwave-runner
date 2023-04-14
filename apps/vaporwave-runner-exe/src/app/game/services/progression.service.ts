import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as THREE from "three";
import { ProgressionModel } from '../models/progression.model';
import { SubscriptionService } from './subscription.service';
import { RandomUtils } from '../utils/random.util';
import { GameStateService } from './game-state.service';
import { GameStates } from '../config/game.states';
import { OptionsService } from './options.service';

@Injectable()
export class ProgressionService {

  // Set up initial variables
  baseSpeed = this.optionsService.PlaneConfig.speed; // base line speed
  maxSpeed = 0.85;
  currentSpeed = this.baseSpeed;
  baseDensity = this.optionsService.CubeConfig.baseDensity; // baseline density
  maxDensity = 50;
  currentDensity = this.baseDensity;
  progress = 0;
  clock = new THREE.Clock();
  timeElapsed = 0;
  totalProgress = 250;
  difficultyIncreaseTime = 10;
  progressionTime = 20;
  hasEnteredTransition = false;

  get newCurrentDensity() { return Math.round(this.currentDensity) }

  constructor(
    private subscriptionService: SubscriptionService,
    private gameStateService: GameStateService,
    private optionsService: OptionsService
  ) { }

  update() {
    this.handleGameStates();
  }

  private handleGameStates() {
   if (this.gameStateService.state == GameStates.Transition) {
    this.hasEnteredTransition = true;
   }

   if (this.gameStateService.state == GameStates.Normal) {
      if (this.hasEnteredTransition) {
        this.hasEnteredTransition = false;

        // increase the difficulty
        this.progress += this.difficultyIncreaseTime;
        this.updateDifficulty();
      }
   }
  }

  private updateDifficulty() {
    this.timeElapsed += this.clock.getDelta();
    this.progress += this.timeElapsed;

    
    const progressRatio = this.progress / this.totalProgress; // totalProgress is the total time it takes to reach max speed and density
    this.increaseDensity(progressRatio);
    this.increaseSpeed(progressRatio);
    this.timeElapsed = 0;

    this.subscriptionService.updateDifficulty$.next({speed: + (this.currentSpeed.toFixed(2)), density: Math.round(this.currentDensity)});
  }

  private increaseDensity(progressRatio) {
    // if (this.currentDensity >= this.maxDensity) return;
    // this.currentDensity = this.baseDensity + (this.maxDensity - this.baseDensity) * progressRatio; // linear easing

    // if (this.currentDensity > this.maxDensity) this.currentDensity = this.maxDensity;
    this.currentDensity = 40;
  }

  private increaseSpeed(progressRatio) {
      if (this.currentSpeed >= this.maxSpeed) return;
      this.currentSpeed = this.baseSpeed + (this.maxSpeed - this.baseSpeed) * progressRatio; // linear easing

      if (this.currentSpeed > this.maxSpeed) this.currentSpeed = this.maxSpeed;
  }
}
