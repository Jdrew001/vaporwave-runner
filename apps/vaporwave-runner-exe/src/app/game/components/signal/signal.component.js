"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalComponent = void 0;
const core_1 = require("@angular/core");
const signal_service_1 = require("../../services/signal.service");
const subscription_service_1 = require("../../services/subscription.service");
let SignalComponent = class SignalComponent {
    get progressOpts() { return this._progressOpts; }
    get playerSignal() { return this.signalService.playerSignal; }
    constructor(signalService, ngZone, subscribeService) {
        this.signalService = signalService;
        this.ngZone = ngZone;
        this.subscribeService = subscribeService;
        this.progressStyles = {
            width: "75%",
        };
        this._progressOpts = {
            path: 'assets/ui/progress/progress.json',
            name: 'progress',
            autoplay: false,
            loop: false,
            renderer: 'svg'
        };
        this.oldPlayerSignal = this.playerSignal;
        this.activeFrame = 0;
        this.currentFrame = 0;
        this.isFalling = false;
        this.isImproving = false;
        this.signalAnimationValues = {
            100: { frame: 0 },
            75: { frame: 11 },
            50: { frame: 23 },
            25: { frame: 33 },
            0: { frame: 45 }
        };
        this.viewLoadedVar = false;
    }
    ngAfterViewInit() {
    }
    update() {
        if (!this.viewLoadedVar)
            return;
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
        if (this.isFalling || this.isImproving)
            return;
        this.oldPlayerSignal = this.playerSignal;
    }
    animationCreated(animationItem) {
        this.animationItem = animationItem;
        this.animationItem.setSpeed(1 / 2);
        this.ngZone.runOutsideAngular(() => {
        });
    }
    viewLoaded(e) {
        this.viewLoadedVar = true;
    }
    enterFrame(e) {
        this.currentFrame = e['currentTime'];
    }
    configureActiveFrame() {
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
};
SignalComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-signal',
        templateUrl: './signal.component.html',
        styleUrls: ['./signal.component.scss']
    }),
    __metadata("design:paramtypes", [signal_service_1.SignalService,
        core_1.NgZone,
        subscription_service_1.SubscriptionService])
], SignalComponent);
exports.SignalComponent = SignalComponent;
//# sourceMappingURL=signal.component.js.map