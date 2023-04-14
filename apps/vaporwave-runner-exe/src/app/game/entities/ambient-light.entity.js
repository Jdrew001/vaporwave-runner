"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
class AmbientLightEntity extends THREE.AmbientLightProbe {
    constructor() {
        super(0xFFFFFF, 1);
    }
    initialize() {
    }
}
exports.default = AmbientLightEntity;
//# sourceMappingURL=ambient-light.entity.js.map