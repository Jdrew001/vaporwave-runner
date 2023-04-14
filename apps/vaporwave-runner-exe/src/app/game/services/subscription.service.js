"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let SubscriptionService = class SubscriptionService {
    constructor() {
        this.redrawCube$ = new rxjs_1.Subject();
        this.checkForCubeIntersection$ = new rxjs_1.Subject();
        this.destroyPlanes$ = new rxjs_1.Subject();
        this.destoryCubes$ = new rxjs_1.Subject();
        this.collisionOccurred$ = new rxjs_1.Subject();
        this.restart$ = new rxjs_1.BehaviorSubject(false);
        this.updateDifficulty$ = new rxjs_1.Subject();
        this.progressionTransition$ = new rxjs_1.Subject();
        this.update$ = new rxjs_1.Subject();
    }
};
SubscriptionService = __decorate([
    (0, core_1.Injectable)()
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map