"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomUtils = void 0;
const THREE = require("three");
const random_1 = require("random");
class RandomUtils {
    static randomValue(min, max) {
        return random_1.default.float(min, max);
    }
    static randomVector3(minX, maxX, minY, maxY, minZ, maxZ) {
        return new THREE.Vector3(random_1.default.float(minX, maxX), random_1.default.float(minY, maxY), random_1.default.float(minZ, maxZ));
    }
    static rand() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
    static generateVector3s(count) {
        const vectors = []; // array to store the generated vectors
        const positions = []; // array to store the positions of the generated vectors
        while (vectors.length < count) {
            const x = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
            const z = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
            const position = new THREE.Vector3(x, 0.1, z);
            // check if the position is within the forbidden circumference
            let isInside = false;
            for (let i = 0; i < positions.length; i++) {
                const distance = position.distanceTo(positions[i]);
                if (distance < this.radius) {
                    isInside = true;
                    break;
                }
            }
            // check if the position is a duplicate
            const isDuplicate = positions.some((p) => position.equals(p));
            // add the vector to the array if it meets the criteria
            if (!isInside && !isDuplicate) {
                vectors.push(position);
                positions.push(position.clone());
            }
        }
        return vectors;
    }
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }
    static randomFn(x, y, z) {
        const r1 = this.random(x, y);
        const r2 = this.random(y, z);
        const r3 = this.random(z, x);
        return (r1 + r2 + r3) / 3;
    }
}
exports.RandomUtils = RandomUtils;
RandomUtils.m = 4294967296;
RandomUtils.a = 1664525;
RandomUtils.c = 1013904223;
RandomUtils.seed = Date.now();
RandomUtils.radius = 2;
RandomUtils.min = -16.5;
RandomUtils.max = 16.5;
//# sourceMappingURL=random.util.js.map