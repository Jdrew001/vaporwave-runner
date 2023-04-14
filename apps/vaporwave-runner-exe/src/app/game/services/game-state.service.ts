import { Injectable } from '@angular/core';
import { GameStates } from '../config/game.states';

@Injectable()
export class GameStateService {

  private _state: GameStates = GameStates.Normal;
  get state() { return this._state; }
  set state(val) { this._state = val; }
}
