import { Component } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { GameStateService } from '../../services/game-state.service';
import { GameStates } from '../../config/game.states';

@Component({
  selector: 'app-speeding-up',
  templateUrl: './speeding-up.component.html',
  styleUrls: ['./speeding-up.component.scss']
})
export class SpeedingUpComponent {

  styles: Partial<CSSStyleDeclaration> = {
    width: "100%",
  };

  get opts() { return this._opts; }
  private _opts: AnimationOptions = {
    path: 'assets/ui/speedingup/speedingup.json',
    name: 'speedingup',
    autoplay: false,
    loop: true,
    renderer: 'svg'
  }

  private animationItem: AnimationItem;
  public viewLoadedVar = false;

  constructor(
    private gameStateService: GameStateService
  ) { }

  public update() {
    if (!this.viewLoadedVar) return;

    if (this.gameStateService.state === GameStates.TransitionEnd)
      this.animationItem.play();

    if (this.gameStateService.state === GameStates.Normal)
      this.animationItem.stop();
  }

  viewLoaded(e) {
    this.viewLoadedVar = true;
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.animationItem.setSpeed(2)
  }
}
