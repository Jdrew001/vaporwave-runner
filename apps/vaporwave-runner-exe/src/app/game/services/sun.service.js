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
exports.SunService = void 0;
const core_1 = require("@angular/core");
const sun_entity_1 = require("../entities/sun.entity");
const THREE = require("three");
let SunService = class SunService {
    get sunEntity() { return this._sunEntity; }
    constructor() {
        this._sunEntity = new sun_entity_1.default();
    }
    initialize(scene) {
        this.sunEntity.initialize(scene);
    }
    updateSunPosition(delta) {
        const position = new THREE.Vector3(delta.x / 1.2, delta.y, delta.z);
        this.sunEntity.sunMesh.position.add(position);
    }
};
SunService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SunService);
exports.SunService = SunService;
//# sourceMappingURL=sun.service.js.map