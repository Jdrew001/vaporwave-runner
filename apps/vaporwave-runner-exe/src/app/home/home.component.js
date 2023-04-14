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
exports.HomeComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const services_1 = require("../core/services");
let HomeComponent = class HomeComponent {
    constructor(router, electronService) {
        this.router = router;
        this.electronService = electronService;
        this.showMenu = true;
        if (sessionStorage.getItem('restart')) {
            sessionStorage.clear();
            this.gameStart();
        }
    }
    ngOnInit() {
    }
    gameStart() {
        this.router.navigate(['/game']);
    }
    quitGame() {
        this.electronService.quitGame();
    }
};
HomeComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router,
        services_1.ElectronService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map