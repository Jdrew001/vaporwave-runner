import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import PlayerEntity from './entities/player.entity';
import { AudioService } from './services/audio.service';
import { CameraService } from './services/camera.service';
import { CollisionService } from './services/collision.service';
import { CubeService } from './services/cube.service';
import { DebugService } from './services/debug.service';
import { EffectsService } from './services/effects.service';
import { InputService } from './services/input.service';
import { PlaneService } from './services/plane.service';
import * as THREE from "three";
import AmbientLightEntity from './entities/ambient-light.entity';
import { LoaderService } from './services/loader.service';
import { SubscriptionService } from './services/subscription.service';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OptionsService } from './services/options.service';
import { ElectronService } from '../core/services';
import { APP_CONFIG } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, delay, ReplaySubject, Subscription, take, takeLast, takeUntil } from 'rxjs';
import { ScoreService } from './services/score.service';
import { ProgressionService } from './services/progression.service';
import { SignalService } from './services/signal.service';
import { AnimationOptions } from 'ngx-lottie';
import { SignalComponent } from './components/signal/signal.component';
import SunEntity from './entities/sun.entity';
import { SunService } from './services/sun.service';
import { SynthMountainsService } from './services/synth-mountains.service';
import { GameStateService } from './services/game-state.service';
import { GameStates } from './config/game.states';
import { SpeedingUpComponent } from './components/speeding-up/speeding-up.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [
    AudioService,
    CameraService,
    CollisionService,
    CubeService,
    DebugService,
    EffectsService,
    InputService,
    LoaderService,
    PlaneService,
    OptionsService,
    SubscriptionService,
    ScoreService,
    ProgressionService,
    SignalService,
    SunService,
    SynthMountainsService,
    GameStateService
  ]
})
export class GameComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gameover') gameoverModal: any;
  @ViewChild('pausemenu') pauseModal: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  startGame = false;
  modalIsOpen = false;
  pauseModalIsOpen = false;
  skybox: THREE.Mesh<THREE.BoxGeometry, any[]>;
  sub: Subscription;
  maxFPS: number = 60;
  normalGameTime = 30;
  transitionGameTime = 5;
  transitionEndTime = 3;

  gameStateTimer = new THREE.Clock();
  

  get isProduction() { return APP_CONFIG.production; }
  get playerScore() { return this.scoreService.score; }

  get mainCamera() { return this.cameraService.mainCamera; }
  get debugCamera() { return this.cameraService.debugCamera; }

  private _player: PlayerEntity = new PlayerEntity(this.optionService);
  get player() { return this._player;}

  private _scene: THREE.Scene;
  get scene() { return this._scene; }
  set scene(value) { this._scene = value; }

  stats = Stats();

  @ViewChild('gameContainer') gameContainer: ElementRef;
  @ViewChild('signal') signalComponent: SignalComponent;
  @ViewChild('speedingUpComponent') speedingUpComponent: SpeedingUpComponent;

  destroy;
  escSub: Subscription;

  constructor(
    private router: Router,
    private cameraService: CameraService,
    private planeService: PlaneService,
    private debugService: DebugService,
    private inputService: InputService,
    private effectService: EffectsService,
    private cubeService: CubeService,
    private collisionService: CollisionService,
    private audioService: AudioService,
    private optionService: OptionsService,
    private electronService: ElectronService,
    private subscriptionService: SubscriptionService,
    private modalService: NgbModal,
    private scoreService: ScoreService,
    private progressionService: ProgressionService,
    private signalService: SignalService,
    private sunService: SunService,
    private synthWaveMountainService: SynthMountainsService,
    private gameStateService: GameStateService
  ) {}

  /** 
   * @method Destroy gets called when component destroys
   * 
   * @description Unsubscribe from all subscriptions
   * 
   * */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * @method Ng After View Init
   * 
   * @description 
   * Initialize the game
   * Call "tick" to start the game loop
   * 
   * Wait 850ms before starting the game
   */
  ngAfterViewInit(): void {
    this.initialize();
    this.tick();
    
    setTimeout(() => {
      this.startGame = true;
      this.initGame();
    }, 850);
  }

  /**
   * @method Tick
   * 
   * @description 
   * Call "tick" to start the game loop
   * Calls update method each frame
   */
  tick()
  {
    requestAnimationFrame(() => this.tick());
    this.update();
  }

  /**
   * @method initGame
   * 
   * @description 
   * Initialize the game at a delay of 750ms
   */
  initGame() {
    setTimeout(async () => {
      
      //Planes begin animating
      this.optionService.PlaneConfig.isAnimating = true;

      //Start bg music
      this.audioService.startingBackgroundMusic();

      //Initialize the collision subscription - this is where the player and cube collision is handled
      this.initCollisionSub();

      //Initialize the score information
      this.scoreService.initialize();

      // start the timer for transitions
      this.gameStateTimer.start();
    }, 750);
  }

  /**
   * @method initalize
   * 
   * @description 
   * THis method initializes many game elements
   * 
   * 1. Create a new scene
   * 2. Initialize the effects and cameras
   * 3. Inilialize the main effects (scanlines and noise)
   * 4. Player object initialization
   * 5. Plane object initialization
   * 6. Sun object initialization
   * 7. Input service initialization
   * 8. Collision service initialization
   * 9. Add the player to the scene
   * 10. Add ambient light to the scene
   * 11. Initialize the audio service
   * 12. Initialize the debug scene effects
   * 
   * If not in production, initialize the stats and other debug elements
   */
  async initialize() {
    this.scene = new THREE.Scene();
    this.effectService.initalize(this.gameContainer.nativeElement, this.scene);
    this.effectService.initalizeMainSceneEffects();
    await this.player.initialize(this.scene);
    await this.planeService.initialize(this.scene);
    this.sunService.initialize(this.scene);
    this.inputService.initialize(this.scene);
    this.collisionService.initialize(this.player);
    this.scene.add(this.player.group);
    this.scene.add(new AmbientLightEntity());
    this.audioService.initialize(this.mainCamera, this.debugCamera);
    this.effectService.initalizeDebugSceneEffects();
    await this.synthWaveMountainService.initialize(this.scene);
    
    if (!this.isProduction) {
      //this.stats.showPanel(0);
      //document.body.appendChild(this.stats.dom);
      this.effectService.initalizeDebugSceneEffects();
      //this.initializeDebugManager();
    }

    this.initializeDebugManager();

    this.initEscapeSub();
  }

  /**
   * @method OnDestroy
   * 
   * @description calls when scene is destroyed
   */
  OnDestroy() {
    this.audioService.unloadSounds();
    this.effectService.renderer.dispose();
  }

  /**
   * @method update 
   * 
   * @description 
   * This method is called each frame
   * 
   * Update all services
   * 
   * ONly update score, progression, input, signal, mountains and game states if the modal is not open
   */
  update() {
    //this.stats.begin();
    this.effectService.update();
    if (!this.modalIsOpen && !this.pauseModalIsOpen) {
      this.scoreService.updateScore();
      this.progressionService.update();
      this.inputService.handleInput(
        this.player, 
        this.mainCamera, 
        this.planeService.planeBuffer,
        this.debugCamera,
        this.skybox);
      this.signalService.update();
      this.synthWaveMountainService.update();
      this.handleTheGameStates();
      this.collisionService.checkForPlayerCollision();
    }
    this.planeService.update();
    this.cubeService.update();
    this.signalComponent.update();
    this.speedingUpComponent.update();
    //this.stats.end();

    this.inputService.handlePause();
  }

  navigateToMenu() {
    this.OnDestroy();
    this.router.navigate(['/'])
      .then(() => {
        this.electronService.reload();
      });;
  }

  restartGame() {
    this.OnDestroy();
    sessionStorage.setItem('restart', 'true');
    this.modalService.dismissAll();
    setTimeout(() => this.electronService.reload(), 50);
  }

  quitGame() {
    this.modalService.dismissAll();
    this.navigateToMenu();
  }

  private handleTheGameStates() {
    if (this.gameStateService.state == GameStates.Transition) {
      if (this.gameStateTimer.getElapsedTime() >= this.transitionGameTime) {
        this.gameStateTimer = new THREE.Clock();
        this.gameStateTimer.start();
        this.gameStateService.state = GameStates.TransitionEnd;
      }
    }

    if (this.gameStateService.state == GameStates.TransitionEnd) {
      if (this.gameStateTimer.getElapsedTime() >= this.transitionEndTime) {
        this.gameStateTimer = new THREE.Clock();
        this.gameStateTimer.start();
        this.gameStateService.state = GameStates.Normal;
        this.synthWaveMountainService.reshufflePositions();
      }
    }

    if (this.gameStateService.state == GameStates.Normal) {
      if (this.gameStateTimer.getElapsedTime() >= this.normalGameTime) {
        this.gameStateTimer = new THREE.Clock();
        this.gameStateTimer.start();
        this.gameStateService.state = GameStates.Transition
      }
    }
  }

  private initializeDebugManager() {
      this.debugService.initialize();
      this.debugService.playerDebugOptions(this.player);
      this.debugService.gameCameraOptions(this.mainCamera);
      this.debugService.debugCameraOptions(this.debugCamera);
      this.debugService.LightOptions();
      this.debugService.planeDebugOptions();
  }

  private initCollisionSub() {
    this.sub = this.subscriptionService.collisionOccurred$.pipe(debounceTime(200), takeUntil(this.destroyed$)).subscribe(value => {
      // should die
      if (value) {
        this.signalService.playerSignal = 0;
        if (this.signalService.playerSignal <= 0 && !this.modalIsOpen) {
          this.modalService.open(this.gameoverModal, { centered: true, keyboard: false, backdrop: 'static' });
          this.modalIsOpen = true;
          this.optionService.PlaneConfig.isAnimating = false;
        }
      } else {
        this.signalService.damagePlayerSignal();
        if (this.signalService.playerSignal <= 0 && !this.modalIsOpen) {
          this.modalService.open(this.gameoverModal, { centered: true, keyboard: false, backdrop: 'static' });
          this.modalIsOpen = true;
          this.optionService.PlaneConfig.isAnimating = false;
        }
      }
    })
  }

  private handleESCAction() {
    if (this.modalIsOpen || this.pauseModalIsOpen) return;
    this.modalService.open(this.pauseModal, { 
      centered: true,
      backdrop: 'static',
      beforeDismiss: () => {
        this.pauseModalIsOpen = false;
        this.optionService.PlaneConfig.isAnimating = true;
        setTimeout(() => this.initEscapeSub(),250);
        return true;
      }
     });
    this.pauseModalIsOpen = true;
    this.optionService.PlaneConfig.isAnimating = false;
    this.initEscapeSub();
  }

  private initEscapeSub() {
    if (this.escSub) this.escSub.unsubscribe();
    this.escSub = this.inputService.handleESCInput.pipe(take(1), takeUntil(this.destroyed$)).subscribe(result => this.handleESCAction());
  }
}
 