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
exports.ProgressionService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const subscription_service_1 = require("./subscription.service");
const game_state_service_1 = require("./game-state.service");
const game_states_1 = require("../config/game.states");
const options_service_1 = require("./options.service");
let ProgressionService = class ProgressionService {
    get newCurrentDensity() { return Math.round(this.currentDensity); }
    constructor(subscriptionService, gameStateService, optionsService) {
        this.subscriptionService = subscriptionService;
        this.gameStateService = gameStateService;
        this.optionsService = optionsService;
        // Set up initial variables
        this.baseSpeed = this.optionsService.PlaneConfig.speed; // base line speed
        this.maxSpeed = 0.85;
        this.currentSpeed = this.baseSpeed;
        this.baseDensity = this.optionsService.CubeConfig.baseDensity; // baseline density
        this.maxDensity = 50;
        this.currentDensity = this.baseDensity;
        this.progress = 0;
        this.clock = new THREE.Clock();
        this.timeElapsed = 0;
        this.totalProgress = 250;
        this.difficultyIncreaseTime = 10;
        this.progressionTime = 20;
        this.hasEnteredTransition = false;
    }
    update() {
        this.handleGameStates();
    }
    handleGameStates() {
        if (this.gameStateService.state == game_states_1.GameStates.Transition) {
            this.hasEnteredTransition = true;
        }
        if (this.gameStateService.state == game_states_1.GameStates.Normal) {
            if (this.hasEnteredTransition) {
                this.hasEnteredTransition = false;
                // increase the difficulty
                this.progress += this.difficultyIncreaseTime;
                this.updateDifficulty();
            }
        }
    }
    updateDifficulty() {
        this.timeElapsed += this.clock.getDelta();
        this.progress += this.timeElapsed;
        const progressRatio = this.progress / this.totalProgress; // totalProgress is the total time it takes to reach max speed and density
        this.increaseDensity(progressRatio);
        this.increaseSpeed(progressRatio);
        this.timeElapsed = 0;
        this.subscriptionService.updateDifficulty$.next({ speed: +(this.currentSpeed.toFixed(2)), density: Math.round(this.currentDensity) });
    }
    increaseDensity(progressRatio) {
        // if (this.currentDensity >= this.maxDensity) return;
        // this.currentDensity = this.baseDensity + (this.maxDensity - this.baseDensity) * progressRatio; // linear easing
        // if (this.currentDensity > this.maxDensity) this.currentDensity = this.maxDensity;
        this.currentDensity = 40;
    }
    increaseSpeed(progressRatio) {
        if (this.currentSpeed >= this.maxSpeed)
            return;
        this.currentSpeed = this.baseSpeed + (this.maxSpeed - this.baseSpeed) * progressRatio; // linear easing
        if (this.currentSpeed > this.maxSpeed)
            this.currentSpeed = this.maxSpeed;
    }
};
ProgressionService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        game_state_service_1.GameStateService,
        options_service_1.OptionsService])
], ProgressionService);
exports.ProgressionService = ProgressionService;
//# sourceMappingURL=progression.service.js.map