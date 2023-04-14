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
exports.GameComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const player_entity_1 = require("./entities/player.entity");
const audio_service_1 = require("./services/audio.service");
const camera_service_1 = require("./services/camera.service");
const collision_service_1 = require("./services/collision.service");
const cube_service_1 = require("./services/cube.service");
const debug_service_1 = require("./services/debug.service");
const effects_service_1 = require("./services/effects.service");
const input_service_1 = require("./services/input.service");
const plane_service_1 = require("./services/plane.service");
const THREE = require("three");
const ambient_light_entity_1 = require("./entities/ambient-light.entity");
const loader_service_1 = require("./services/loader.service");
const subscription_service_1 = require("./services/subscription.service");
const stats_module_js_1 = require("three/examples/jsm/libs/stats.module.js");
const options_service_1 = require("./services/options.service");
const services_1 = require("../core/services");
const environment_1 = require("../../environments/environment");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const rxjs_1 = require("rxjs");
const score_service_1 = require("./services/score.service");
const progression_service_1 = require("./services/progression.service");
const signal_service_1 = require("./services/signal.service");
const signal_component_1 = require("./components/signal/signal.component");
const sun_service_1 = require("./services/sun.service");
const synth_mountains_service_1 = require("./services/synth-mountains.service");
const game_state_service_1 = require("./services/game-state.service");
const game_states_1 = require("./config/game.states");
const speeding_up_component_1 = require("./components/speeding-up/speeding-up.component");
let GameComponent = class GameComponent {
    get isProduction() { return environment_1.APP_CONFIG.production; }
    get playerScore() { return this.scoreService.score; }
    get mainCamera() { return this.cameraService.mainCamera; }
    get debugCamera() { return this.cameraService.debugCamera; }
    get player() { return this._player; }
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }
    constructor(router, cameraService, planeService, debugService, inputService, effectService, cubeService, collisionService, audioService, optionService, electronService, subscriptionService, modalService, scoreService, progressionService, signalService, sunService, synthWaveMountainService, gameStateService) {
        this.router = router;
        this.cameraService = cameraService;
        this.planeService = planeService;
        this.debugService = debugService;
        this.inputService = inputService;
        this.effectService = effectService;
        this.cubeService = cubeService;
        this.collisionService = collisionService;
        this.audioService = audioService;
        this.optionService = optionService;
        this.electronService = electronService;
        this.subscriptionService = subscriptionService;
        this.modalService = modalService;
        this.scoreService = scoreService;
        this.progressionService = progressionService;
        this.signalService = signalService;
        this.sunService = sunService;
        this.synthWaveMountainService = synthWaveMountainService;
        this.gameStateService = gameStateService;
        this.destroyed$ = new rxjs_1.ReplaySubject(1);
        this.startGame = false;
        this.modalIsOpen = false;
        this.pauseModalIsOpen = false;
        this.maxFPS = 60;
        this.normalGameTime = 30;
        this.transitionGameTime = 5;
        this.transitionEndTime = 3;
        this.gameStateTimer = new THREE.Clock();
        this._player = new player_entity_1.default(this.optionService);
        this.stats = (0, stats_module_js_1.default)();
    }
    /**
     * @method Destroy gets called when component destroys
     *
     * @description Unsubscribe from all subscriptions
     *
     * */
    ngOnDestroy() {
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
    ngAfterViewInit() {
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
    tick() {
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
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
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
        }), 750);
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
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.scene = new THREE.Scene();
            this.effectService.initalize(this.gameContainer.nativeElement, this.scene);
            this.effectService.initalizeMainSceneEffects();
            yield this.player.initialize(this.scene);
            yield this.planeService.initialize(this.scene);
            this.sunService.initialize(this.scene);
            this.inputService.initialize(this.scene);
            this.collisionService.initialize(this.player);
            this.scene.add(this.player.group);
            this.scene.add(new ambient_light_entity_1.default());
            this.audioService.initialize(this.mainCamera, this.debugCamera);
            this.effectService.initalizeDebugSceneEffects();
            yield this.synthWaveMountainService.initialize(this.scene);
            if (!this.isProduction) {
                //this.stats.showPanel(0);
                //document.body.appendChild(this.stats.dom);
                this.effectService.initalizeDebugSceneEffects();
                //this.initializeDebugManager();
            }
            this.initializeDebugManager();
            this.initEscapeSub();
        });
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
            this.inputService.handleInput(this.player, this.mainCamera, this.planeService.planeBuffer, this.debugCamera, this.skybox);
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
        });
        ;
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
    handleTheGameStates() {
        if (this.gameStateService.state == game_states_1.GameStates.Transition) {
            if (this.gameStateTimer.getElapsedTime() >= this.transitionGameTime) {
                this.gameStateTimer = new THREE.Clock();
                this.gameStateTimer.start();
                this.gameStateService.state = game_states_1.GameStates.TransitionEnd;
            }
        }
        if (this.gameStateService.state == game_states_1.GameStates.TransitionEnd) {
            if (this.gameStateTimer.getElapsedTime() >= this.transitionEndTime) {
                this.gameStateTimer = new THREE.Clock();
                this.gameStateTimer.start();
                this.gameStateService.state = game_states_1.GameStates.Normal;
                this.synthWaveMountainService.reshufflePositions();
            }
        }
        if (this.gameStateService.state == game_states_1.GameStates.Normal) {
            if (this.gameStateTimer.getElapsedTime() >= this.normalGameTime) {
                this.gameStateTimer = new THREE.Clock();
                this.gameStateTimer.start();
                this.gameStateService.state = game_states_1.GameStates.Transition;
            }
        }
    }
    initializeDebugManager() {
        this.debugService.initialize();
        this.debugService.playerDebugOptions(this.player);
        this.debugService.gameCameraOptions(this.mainCamera);
        this.debugService.debugCameraOptions(this.debugCamera);
        this.debugService.LightOptions();
        this.debugService.planeDebugOptions();
    }
    initCollisionSub() {
        this.sub = this.subscriptionService.collisionOccurred$.pipe((0, rxjs_1.debounceTime)(200), (0, rxjs_1.takeUntil)(this.destroyed$)).subscribe(value => {
            // should die
            if (value) {
                this.signalService.playerSignal = 0;
                if (this.signalService.playerSignal <= 0 && !this.modalIsOpen) {
                    this.modalService.open(this.gameoverModal, { centered: true, keyboard: false, backdrop: 'static' });
                    this.modalIsOpen = true;
                    this.optionService.PlaneConfig.isAnimating = false;
                }
            }
            else {
                this.signalService.damagePlayerSignal();
                if (this.signalService.playerSignal <= 0 && !this.modalIsOpen) {
                    this.modalService.open(this.gameoverModal, { centered: true, keyboard: false, backdrop: 'static' });
                    this.modalIsOpen = true;
                    this.optionService.PlaneConfig.isAnimating = false;
                }
            }
        });
    }
    handleESCAction() {
        if (this.modalIsOpen || this.pauseModalIsOpen)
            return;
        this.modalService.open(this.pauseModal, {
            centered: true,
            backdrop: 'static',
            beforeDismiss: () => {
                this.pauseModalIsOpen = false;
                this.optionService.PlaneConfig.isAnimating = true;
                setTimeout(() => this.initEscapeSub(), 250);
                return true;
            }
        });
        this.pauseModalIsOpen = true;
        this.optionService.PlaneConfig.isAnimating = false;
        this.initEscapeSub();
    }
    initEscapeSub() {
        if (this.escSub)
            this.escSub.unsubscribe();
        this.escSub = this.inputService.handleESCInput.pipe((0, rxjs_1.take)(1), (0, rxjs_1.takeUntil)(this.destroyed$)).subscribe(result => this.handleESCAction());
    }
};
__decorate([
    (0, core_1.ViewChild)('gameover'),
    __metadata("design:type", Object)
], GameComponent.prototype, "gameoverModal", void 0);
__decorate([
    (0, core_1.ViewChild)('pausemenu'),
    __metadata("design:type", Object)
], GameComponent.prototype, "pauseModal", void 0);
__decorate([
    (0, core_1.ViewChild)('gameContainer'),
    __metadata("design:type", core_1.ElementRef)
], GameComponent.prototype, "gameContainer", void 0);
__decorate([
    (0, core_1.ViewChild)('signal'),
    __metadata("design:type", signal_component_1.SignalComponent)
], GameComponent.prototype, "signalComponent", void 0);
__decorate([
    (0, core_1.ViewChild)('speedingUpComponent'),
    __metadata("design:type", speeding_up_component_1.SpeedingUpComponent)
], GameComponent.prototype, "speedingUpComponent", void 0);
GameComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-game',
        templateUrl: './game.component.html',
        styleUrls: ['./game.component.scss'],
        providers: [
            audio_service_1.AudioService,
            camera_service_1.CameraService,
            collision_service_1.CollisionService,
            cube_service_1.CubeService,
            debug_service_1.DebugService,
            effects_service_1.EffectsService,
            input_service_1.InputService,
            loader_service_1.LoaderService,
            plane_service_1.PlaneService,
            options_service_1.OptionsService,
            subscription_service_1.SubscriptionService,
            score_service_1.ScoreService,
            progression_service_1.ProgressionService,
            signal_service_1.SignalService,
            sun_service_1.SunService,
            synth_mountains_service_1.SynthMountainsService,
            game_state_service_1.GameStateService
        ]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        camera_service_1.CameraService,
        plane_service_1.PlaneService,
        debug_service_1.DebugService,
        input_service_1.InputService,
        effects_service_1.EffectsService,
        cube_service_1.CubeService,
        collision_service_1.CollisionService,
        audio_service_1.AudioService,
        options_service_1.OptionsService,
        services_1.ElectronService,
        subscription_service_1.SubscriptionService,
        ng_bootstrap_1.NgbModal,
        score_service_1.ScoreService,
        progression_service_1.ProgressionService,
        signal_service_1.SignalService,
        sun_service_1.SunService,
        synth_mountains_service_1.SynthMountainsService,
        game_state_service_1.GameStateService])
], GameComponent);
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map