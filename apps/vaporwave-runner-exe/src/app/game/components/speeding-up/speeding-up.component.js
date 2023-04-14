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
exports.SpeedingUpComponent = void 0;
const core_1 = require("@angular/core");
const game_state_service_1 = require("../../services/game-state.service");
const game_states_1 = require("../../config/game.states");
let SpeedingUpComponent = class SpeedingUpComponent {
    get opts() { return this._opts; }
    constructor(gameStateService) {
        this.gameStateService = gameStateService;
        this.styles = {
            width: "100%",
        };
        this._opts = {
            path: 'assets/ui/speedingup/speedingup.json',
            name: 'speedingup',
            autoplay: false,
            loop: true,
            renderer: 'svg'
        };
        this.viewLoadedVar = false;
    }
    update() {
        if (!this.viewLoadedVar)
            return;
        if (this.gameStateService.state === game_states_1.GameStates.TransitionEnd)
            this.animationItem.play();
        if (this.gameStateService.state === game_states_1.GameStates.Normal)
            this.animationItem.stop();
    }
    viewLoaded(e) {
        this.viewLoadedVar = true;
    }
    animationCreated(animationItem) {
        this.animationItem = animationItem;
        this.animationItem.setSpeed(2);
    }
};
SpeedingUpComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-speeding-up',
        templateUrl: './speeding-up.component.html',
        styleUrls: ['./speeding-up.component.scss']
    }),
    __metadata("design:paramtypes", [game_state_service_1.GameStateService])
], SpeedingUpComponent);
exports.SpeedingUpComponent = SpeedingUpComponent;
//# sourceMappingURL=speeding-up.component.js.map