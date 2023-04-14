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
exports.SignalService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const effects_service_1 = require("./effects.service");
let SignalService = class SignalService {
    get playerSignal() { return this._playerSignal; }
    set playerSignal(value) { this._playerSignal = value; }
    constructor(effectService) {
        this.effectService = effectService;
        this.MAX_SIGNAL = 100;
        this.REGEN_RATE = 1; // RATE PER SECONDS
        this.REGEN_DELAY = 15;
        this.PLAYER_SIGNAL_LOSS_RATE = 1 / 4;
        this.clock = new THREE.Clock();
        this.timeElapsed = 0;
        this._playerSignal = 100;
        this.isAnimationOccuring = false;
    }
    update() {
        this.regenerateSignal(this.clock.getDelta());
    }
    damagePlayerSignal() {
        if (this.playerSignal <= 0)
            return;
        this.playerSignal = this.playerSignal - (100 * this.PLAYER_SIGNAL_LOSS_RATE);
        this.effectService.updateScreenEffects(this.playerSignal);
    }
    regenerateSignal(deltaTime) {
        this.timeElapsed += deltaTime;
        if (this.playerSignal >= this.MAX_SIGNAL || this.playerSignal <= 0)
            return;
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
};
SignalService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [effects_service_1.EffectsService])
], SignalService);
exports.SignalService = SignalService;
//# sourceMappingURL=signal.service.js.map