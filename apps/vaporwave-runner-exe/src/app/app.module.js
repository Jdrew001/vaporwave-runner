"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.playerFactory = void 0;
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/common/http");
const core_module_1 = require("./core/core.module");
const shared_module_1 = require("./shared/shared.module");
const app_routing_module_1 = require("./app-routing.module");
// NG Translate
const core_2 = require("@ngx-translate/core");
const http_loader_1 = require("@ngx-translate/http-loader");
const home_module_1 = require("./home/home.module");
const app_component_1 = require("./app.component");
const game_module_1 = require("./game/game.module");
const common_1 = require("@angular/common");
const ngx_lottie_1 = require("ngx-lottie");
const lottie_web_1 = require("lottie-web");
// AoT requires an exported function for factories
const httpLoaderFactory = (http) => new http_loader_1.TranslateHttpLoader(http, './assets/i18n/', '.json');
function playerFactory() {
    return lottie_web_1.default;
}
exports.playerFactory = playerFactory;
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [app_component_1.AppComponent],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpClientModule,
            core_module_1.CoreModule,
            shared_module_1.SharedModule,
            home_module_1.HomeModule,
            game_module_1.GameModule,
            app_routing_module_1.AppRoutingModule,
            core_2.TranslateModule.forRoot({
                loader: {
                    provide: core_2.TranslateLoader,
                    useFactory: httpLoaderFactory,
                    deps: [http_1.HttpClient]
                }
            }),
            ngx_lottie_1.LottieModule.forRoot({ player: playerFactory })
        ],
        providers: [
            {
                provide: common_1.LocationStrategy,
                useClass: common_1.HashLocationStrategy
            }
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map