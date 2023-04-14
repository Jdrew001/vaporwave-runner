import * as THREE from "three";
import random from 'random'

export class RandomUtils {
    private static m = 4294967296;
    private static a = 1664525;
    private static c = 1013904223;
    private static seed = Date.now();

    private static radius = 2
    private static min = -16.5;
    private static max = 16.5;

    public static randomValue(min, max) {
        return random.float(min, max);
    }
    public static randomVector3(
        minX: number, maxX: number, 
        minY: number, maxY: number,
        minZ: number, maxZ: number
    ) {
        return new THREE.Vector3(
            random.float(minX, maxX),
            random.float(minY, maxY),
            random.float(minZ, maxZ)
        );
    }

    public static rand() {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }

    public static generateVector3s(count): Array<THREE.Vector3> {
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

    public static random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    
    public static randomFn(x: number, y: number, z: number) {
      const r1 = this.random(x, y);
      const r2 = this.random(y, z);
      const r3 = this.random(z, x);
      return (r1 + r2 + r3) / 3;
    }
}