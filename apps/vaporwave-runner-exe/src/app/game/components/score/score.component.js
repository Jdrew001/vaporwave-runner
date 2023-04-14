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
exports.ScoreComponent = void 0;
const core_1 = require("@angular/core");
const score_service_1 = require("../../services/score.service");
let ScoreComponent = class ScoreComponent {
    get playerScore() { return this.scoreService.score; }
    constructor(scoreService) {
        this.scoreService = scoreService;
        this.scoreOpts = {
            path: 'assets/ui/score/main.json',
            name: 'score',
            autoplay: false,
            loop: false,
            renderer: 'svg'
        };
        this.scoreStyles = {
            width: "75%",
            margin: "auto"
        };
    }
    enterFrame(e) {
    }
};
ScoreComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-score',
        templateUrl: './score.component.html',
        styleUrls: ['./score.component.scss']
    }),
    __metadata("design:paramtypes", [score_service_1.ScoreService])
], ScoreComponent);
exports.ScoreComponent = ScoreComponent;
//# sourceMappingURL=score.component.js.map