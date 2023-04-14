import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable()
export class ScoreService {

  private _score = 0;
  get score() { return this._score; }
  private set score(val) { this._score = val; }
  clock = new THREE.Clock();

  private increaseRate: number = 0.5 * 10;
  incrementRate: number = .250; //ms

  constructor() { }

  initialize() {

    this.clock.start();
  }

  updateScore() {
    if (this.clock.getElapsedTime() > this.incrementRate) {
      this.score = this.score + this.increaseRate;

      this.clock.start();
    }
  }

  resetScore() {
    this.score = 0;
  }
}
