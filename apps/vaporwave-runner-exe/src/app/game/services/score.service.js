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
exports.ScoreService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
let ScoreService = class ScoreService {
    get score() { return this._score; }
    set score(val) { this._score = val; }
    constructor() {
        this._score = 0;
        this.clock = new THREE.Clock();
        this.increaseRate = 0.5 * 10;
        this.incrementRate = .250; //ms
    }
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
};
ScoreService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ScoreService);
exports.ScoreService = ScoreService;
//# sourceMappingURL=score.service.js.map