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
exports.AudioService = void 0;
const core_1 = require("@angular/core");
const THREE = require("three");
let AudioService = class AudioService {
    get audioListener() { return this._audioListener; }
    set audioListener(value) { this._audioListener = value; }
    get audioLoader() { return this._audioLoader; }
    set audioLoader(value) { this._audioLoader = value; }
    constructor() {
        this.background_music = {
            id: 'starter',
            name: 'assets/music/starting_bg.mp3',
            volume: 0.08
        };
        this.grid_electric_effect = {
            id: 'electric',
            name: 'assets/music/electric_sound.mp3',
            volume: 0.05
        };
    }
    initialize(mainCamera, debugCamera) {
        this.audioListener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        mainCamera.add(this.audioListener);
        debugCamera.add(this.audioListener);
    }
    startingBackgroundMusic() {
        this.backgroundMusic = new THREE.Audio(this.audioListener);
        this.audioLoader.load(this.background_music.name, (buffer) => {
            this.backgroundMusic.setBuffer(buffer);
            this.backgroundMusic.setLoop(true);
            this.backgroundMusic.setVolume(this.background_music.volume);
            this.backgroundMusic.play();
        });
    }
    gridElectricEffect() {
        this.electricSound = new THREE.Audio(this.audioListener);
        this.audioLoader.load(this.grid_electric_effect.name, (buffer) => {
            this.electricSound.setBuffer(buffer);
            this.electricSound.setLoop(true);
            this.electricSound.setVolume(this.grid_electric_effect.volume);
            this.electricSound.play();
        });
    }
    unloadSounds() {
        this.backgroundMusic.disconnect();
        this.backgroundMusic.clear();
        // this.electricSound.disconnect();
        // this.electricSound.clear();
    }
};
AudioService = __decorate([
    (0, core_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AudioService);
exports.AudioService = AudioService;
//# sourceMappingURL=audio.service.js.map