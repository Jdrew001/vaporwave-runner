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
exports.CollisionService = void 0;
const core_1 = require("@angular/core");
const subscription_service_1 = require("./subscription.service");
const synth_mountains_service_1 = require("./synth-mountains.service");
let CollisionService = class CollisionService {
    get player() { return this._player; }
    set player(value) { this._player = value; }
    constructor(subscriptionService, mountainService) {
        this.subscriptionService = subscriptionService;
        this.mountainService = mountainService;
        this.collidedWithMountain = false;
        this.mountainThreshold = 5.55112123125783e-17;
    }
    initialize(playerEntity) {
        this.player = playerEntity;
    }
    checkForCollision(entity) {
        var _a;
        const playerBox = (_a = this.player) === null || _a === void 0 ? void 0 : _a.box;
        if (!playerBox)
            return;
        if (entity.group.visible && playerBox.intersectsBox(entity.box)) {
            entity.group.visible = false;
            this.subscriptionService.collisionOccurred$.next(false);
        }
    }
    checkForPlayerCollision() {
        // if (!this.player?.leftRaycaster) return;
        // const leftIntersection = this.player.leftRaycaster.intersectObjects(this.mountainService.mountainMeshs);
        // if (leftIntersection.length > 0) {
        //   // Sort the intersections by distance from the player
        //   leftIntersection.sort((a, b) => a.distance - b.distance);
        //   // Check if the player's raycast intersects with the closest mountain mesh
        //   const isIntersecting = leftIntersection[0].distance <= this.mountainThreshold; // Adjust the distance threshold as neededa
        //   if (isIntersecting && !this.collidedWithMountain) {
        //     this.collidedWithMountain = true;
        //     this.subscriptionService.collisionOccurred$.next(true);
        //   }
        // }
    }
};
CollisionService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        synth_mountains_service_1.SynthMountainsService])
], CollisionService);
exports.CollisionService = CollisionService;
//# sourceMappingURL=collision.service.js.map