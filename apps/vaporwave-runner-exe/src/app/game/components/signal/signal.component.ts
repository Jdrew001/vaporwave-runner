import { AfterViewInit, Component, Input, NgZone, OnInit, Output } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { SignalService } from '../../services/signal.service';
import { AnimationItem } from 'lottie-web';
import { SubscriptionService } from '../../services/subscription.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-signal',
  templateUrl: './signal.component.html',
  styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements AfterViewInit {

  progressStyles: Partial<CSSStyleDeclaration> = {
    width: "75%",
  };

  get progressOpts() { return this._progressOpts; }
  private _progressOpts: AnimationOptions = {
    path: 'assets/ui/progress/progress.json',
    name: 'progress',
    autoplay: false,
    loop: false,
    renderer: 'svg'
  }

  get playerSignal() { return this.signalService.playerSignal; }
  oldPlayerSignal = this.playerSignal;

  private animationItem: AnimationItem;
  private activeFrame = 0;
  private currentFrame = 0;
  private isFalling = false;
  private isImproving = false;

  private signalAnimationValues = {
    100: { frame: 0 },
    75: { frame: 11 },
    50: { frame: 23 },
    25: { frame: 33 },
    0: { frame: 45 }
  }

  viewLoadedVar = false;

  constructor(
    private signalService: SignalService,
    private ngZone: NgZone,
    private subscribeService: SubscriptionService
  ) {}

  ngAfterViewInit(): void {
    
  }

  public update() {
    if (!this.viewLoadedVar) return;
    this.configureActiveFrame();

    // player signal has worsened
    if (this.oldPlayerSignal > this.playerSignal) {
      if (this.activeFrame > this.currentFrame && !this.isFalling) {
        if (this.isImproving) {
          this.animationItem.pause();
        }
        
        this.animationItem.setDirection(1);
        this.animationItem.play();
        this.isFalling = true;
        this.signalService.isAnimationOccuring = true;
      }

      if (this.currentFrame >= this.activeFrame) {
        this.animationItem.pause();
        this.currentFrame = this.activeFrame;
        this.isFalling = false;
        this.signalService.isAnimationOccuring = false;
      }
    }

    // player signal has improved
    
    if (this.oldPlayerSignal < this.playerSignal) {
      if (this.activeFrame <= this.currentFrame && !this.isImproving) {
        if (this.isFalling) {
          this.animationItem.pause();
        }
        
        this.animationItem.setDirection(-1);
        this.animationItem.play();
        this.isImproving = true;
        this.signalService.isAnimationOccuring = true;
      }

      if (this.currentFrame <= this.activeFrame) {
        this.animationItem.pause();
        this.currentFrame = this.activeFrame;
        this.isImproving = false;
        this.signalService.isAnimationOccuring = false;
      }
    }

    if (this.isFalling || this.isImproving) return; 
    this.oldPlayerSignal = this.playerSignal;
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.animationItem.setSpeed(1/2)
    this.ngZone.runOutsideAngular(() => {
    })
  }

  viewLoaded(e) {
    this.viewLoadedVar = true;
  }

  enterFrame(e) { 
    this.currentFrame = e['currentTime'];
  }

  private configureActiveFrame() {
    if (this.playerSignal >= 100) {
      this.activeFrame = this.signalAnimationValues[100].frame;
      return;
    }

    if (this.playerSignal < 100 && this.playerSignal >= 75) {
      this.activeFrame = this.signalAnimationValues[75].frame;
      return;
    }

    if (this.playerSignal < 75 && this.playerSignal >= 50) {
      this.activeFrame = this.signalAnimationValues[50].frame;
      return;
    }

    if (this.playerSignal < 50 && this.playerSignal >= 25) {
      this.activeFrame = this.signalAnimationValues[25].frame;
      return;
    }

    if (this.playerSignal < 25 && this.playerSignal >= 0) {
      this.activeFrame = this.signalAnimationValues[0].frame;
      return;
    }
  }
}
