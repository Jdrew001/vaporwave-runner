"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = exports.playerFactory = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const game_routing_module_1 = require("./game-routing.module");
const game_component_1 = require("./game.component");
const ngx_lottie_1 = require("ngx-lottie");
const lottie_web_1 = require("lottie-web");
const signal_component_1 = require("./components/signal/signal.component");
const score_component_1 = require("./components/score/score.component");
const speeding_up_component_1 = require("./components/speeding-up/speeding-up.component");
function playerFactory() {
    return lottie_web_1.default;
}
exports.playerFactory = playerFactory;
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [
            game_component_1.GameComponent,
            signal_component_1.SignalComponent,
            score_component_1.ScoreComponent,
            speeding_up_component_1.SpeedingUpComponent
        ],
        providers: [],
        imports: [
            common_1.CommonModule,
            game_routing_module_1.GameRoutingModule,
            ngx_lottie_1.LottieModule.forRoot({ player: playerFactory })
        ]
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map