import { Injectable } from '@angular/core';
import * as THREE from "three";
import { AudioLoader, AudioListener } from "three";
import { BackgroundMusic } from '../models/audio-music.model';

@Injectable()
export class AudioService {

  private _audioListener: AudioListener;
  get audioListener() { return this._audioListener; }
  set audioListener(value) { this._audioListener = value; }

  private _audioLoader: AudioLoader;
  get audioLoader() { return this._audioLoader; }
  set audioLoader(value) { this._audioLoader = value; }

  backgroundMusic: THREE.Audio;
  electricSound: THREE.Audio;

  constructor() { }

  private background_music: BackgroundMusic = {
    id: 'starter',
    name: 'assets/music/starting_bg.mp3',
    volume: 0.08
  }

  private grid_electric_effect: BackgroundMusic = {
      id: 'electric',
      name: 'assets/music/electric_sound.mp3',
      volume: 0.05
  }

  initialize(mainCamera: THREE.PerspectiveCamera, debugCamera: THREE.PerspectiveCamera) {
    this.audioListener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
    mainCamera.add(this.audioListener)
    debugCamera.add(this.audioListener);
  }

  startingBackgroundMusic() {
      this.backgroundMusic = new THREE.Audio( this.audioListener );
      this.audioLoader.load(this.background_music.name, (buffer) => {
        this.backgroundMusic.setBuffer( buffer );
        this.backgroundMusic.setLoop( true );
        this.backgroundMusic.setVolume(this.background_music.volume);
        this.backgroundMusic.play();
      });

      
  }

  gridElectricEffect() {
      this.electricSound = new THREE.Audio( this.audioListener );
      this.audioLoader.load(this.grid_electric_effect.name, (buffer) => {
        this.electricSound.setBuffer( buffer );
        this.electricSound.setLoop( true );
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
}
