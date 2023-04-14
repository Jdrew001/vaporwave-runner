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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthMountainsService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
const simplex_noise_1 = require("simplex-noise");
const alea_1 = require("alea");
const random_util_1 = require("../utils/random.util");
const progression_service_1 = require("./progression.service");
const game_state_service_1 = require("./game-state.service");
const game_states_1 = require("../config/game.states");
//TODO: ONe potential enhancement -> every time we go back to the main state, we can have the mountains update their heights
let SynthMountainsService = class SynthMountainsService {
    constructor(gameStateService, progressionService) {
        this.gameStateService = gameStateService;
        this.progressionService = progressionService;
        this.mountainMeshs = [];
        this.MOUNTAIN_WIDTH = 50;
        this.MOUNTAIN_LENGTH = 8;
        this.mountainSpacing = 4.5;
        this.mountainCount = 25;
        this.zOrigin = -85;
        this.clock = new THREE.Clock();
        this.timer = 0;
    }
    initialize(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            this.scene = scene;
            //Wrapping it around of to make it an observable (running outside the main loop)
            //Ensures faster load times
            //of (this.initMountains()).subscribe(() => {});
        });
    }
    update() {
        //this.checkForTransition();
    }
    reshufflePositions() {
        let xPositions = this.sinWaveXPosition();
        this.mountainMeshs.forEach((mountain, index) => {
            this.setMountainHeight(mountain);
            mountain.position.set(xPositions[index], 2, mountain.position.z);
        });
    }
    updateMountainPositionRelativeToPlayer(vector3) {
        this.mountainMeshs.forEach(mountain => {
            mountain.position.add(vector3);
        });
    }
    initMountains() {
        for (let i = 0; i < this.mountainCount; i++) {
            this.rng = (0, alea_1.default)(Math.random());
            this.noise = (0, simplex_noise_1.createNoise3D)(this.rng);
            let zPosition = i * this.MOUNTAIN_LENGTH;
            let mountainGeometry = this.createMountainGeometry();
            this.createMountainMeshes(mountainGeometry, zPosition, i);
        }
        return 'done';
    }
    checkForTransition() {
        if (this.gameStateService.state == game_states_1.GameStates.Transition) {
            if (this.timer <= 5) {
                this.timer += this.clock.getDelta();
            }
            if (this.timer >= 2) {
                this.animateMountains();
            }
        }
        if (this.gameStateService.state == game_states_1.GameStates.TransitionEnd) {
            // allow animation to finish to a point and then stop
            this.animationMountainsAndStop();
            this.timer = 0;
        }
    }
    animateMountains() {
        this.hasAnimated = true;
        this.mountainMeshs.forEach((mountain, index) => {
            mountain.position.z += this.progressionService.currentSpeed;
            ;
            if (mountain.position.z > 20) {
                mountain.position.z = this.zOrigin;
            }
        });
    }
    animationMountainsAndStop() {
        // we want to allow the animation to continue but they get reset to the origin, we want to stop the animation
        this.mountainMeshs.forEach((mountain, index) => {
            if (mountain.position.z > this.zOrigin) {
                mountain.position.z += this.progressionService.currentSpeed;
            }
            if (mountain.position.z > 20) {
                let zPosition = index * this.MOUNTAIN_LENGTH;
                mountain.position.z = (zPosition * -1) + this.zOrigin;
            }
        });
    }
    redrawMountains() {
        for (let i = 0; i < this.mountainCount; i++) {
            let zPosition = i * this.MOUNTAIN_LENGTH;
            this.mountainMeshs[i].position.z = (zPosition * -1) + this.zOrigin;
        }
        this.reshufflePositions();
    }
    createMountainGeometry() {
        // Create center valley geometry
        let valleyGeometry = new THREE.PlaneGeometry(this.MOUNTAIN_WIDTH, this.MOUNTAIN_LENGTH, 50, 50);
        valleyGeometry.translate(0, 0, 0);
        // Apply noise to mountain geometries and center valley geometry
        let points = this.setMountainHeight(valleyGeometry);
        return { geometry: valleyGeometry, points: points };
    }
    //#region Set mountain height
    setMountainHeight(geometry) {
        const positions = geometry.attributes.position;
        const count = positions.count;
        const points = [];
        // Set the frequency and amplitude for the noise function
        const freq = 4;
        const amp = 7;
        // Generate the noise values for each vertex
        let noiseValues = [];
        for (let i = 0; i < count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            points.push(new THREE.Vector3(x, y, z));
            // Generate noise value using a 2D noise function
            let noise = this.fbm3d(this.noise, 2)(x * freq, y * freq, z * freq);
            // Check if the vertex is in the center of the valley
            if (Math.abs(x) < this.mountainSpacing) {
                noise = 5; // Make the valley flat
                noiseValues.push(noise);
            }
            else {
                noiseValues.push(noise * amp);
            }
        }
        // Apply the Gaussian blur filter
        const filteredNoiseValues = [];
        const filterSize = 8; // The size of the filter kernel
        const sigma = filterSize / 3; // The standard deviation of the Gaussian function
        const filterWeight = 1 / (2 * Math.PI * sigma * sigma);
        for (let i = 0; i < count; i++) {
            let sum = 0;
            let weightSum = 0;
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            // Iterate over the neighboring vertices
            for (let j = -filterSize; j <= filterSize; j++) {
                for (let k = -filterSize; k <= filterSize; k++) {
                    const index = i + j * count + k;
                    if (index >= 0 && index < count) {
                        const nx = positions.getX(index);
                        const ny = positions.getY(index);
                        const nz = positions.getZ(index);
                        const distance = Math.sqrt(Math.pow((x - nx), 2) + Math.pow((y - ny), 2) + Math.pow((z - nz), 2));
                        const weight = filterWeight * Math.exp(-distance * distance / (2 * sigma * sigma));
                        sum += noiseValues[index] * weight;
                        weightSum += weight;
                    }
                }
            }
            // Compute the filtered noise value for the current vertex
            const filteredNoise = sum / weightSum;
            filteredNoiseValues.push(filteredNoise);
        }
        // Update the z-coordinates of the vertices with the filtered noise values
        for (let i = 0; i < count; i++) {
            positions.setZ(i, filteredNoiseValues[i]);
        }
        positions.needsUpdate = true;
        return points;
    }
    //#endregion
    fbm3d(noise3D, octaves) {
        return function fbm2dFn(x, y, z) {
            let value = 0.0;
            let amplitude = 0.5;
            for (let i = 0; i < octaves; i++) {
                x *= 0.5;
                y *= 0.5;
                z *= 0.5;
                value += noise3D(x, y, z) * amplitude;
                amplitude *= 0.8;
            }
            return value;
        };
    }
    createMountainMeshes(data, zPosition, index) {
        let mountainMaterialCenter = new THREE.MeshPhongMaterial({ color: 0x000000, lightMapIntensity: 30 });
        let newZPosition = (zPosition * -1) + this.zOrigin;
        let xPositions = this.sinWaveXPosition();
        // Create wireframe material
        const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x00B1FF, linewidth: 5 });
        let mountainMeshCenter = new THREE.Mesh(data.geometry, mountainMaterialCenter);
        mountainMeshCenter.rotateX(Math.PI / 2);
        mountainMeshCenter.position.set(xPositions[index], 1, newZPosition);
        mountainMeshCenter.scale.set(2, 1, 1);
        const centerMountainWireframeGeometry = new THREE.WireframeGeometry(data.geometry);
        let centerMountainWireframe = new THREE.LineSegments(centerMountainWireframeGeometry, outlineMaterial);
        mountainMeshCenter.add(centerMountainWireframe);
        this.mountainMeshs.push(mountainMeshCenter);
        this.scene.add(mountainMeshCenter);
    }
    sinWaveXPosition() {
        const amplitude = random_util_1.RandomUtils.randomValue(8, 10);
        const frequency = 0.08;
        const phaseShift = 0;
        const xOffset = 0; // The horizontal offset of the wave
        const waveArray = [];
        for (let i = 0; i < this.mountainCount; i++) {
            const y = amplitude * Math.sin(2 * Math.PI * frequency * i + phaseShift) + xOffset;
            waveArray.push(y);
        }
        return waveArray;
    }
};
SynthMountainsService = __decorate([
    (0, core_1.Injectable)({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [game_state_service_1.GameStateService,
        progression_service_1.ProgressionService])
], SynthMountainsService);
exports.SynthMountainsService = SynthMountainsService;
//# sourceMappingURL=synth-mountains.service.js.map