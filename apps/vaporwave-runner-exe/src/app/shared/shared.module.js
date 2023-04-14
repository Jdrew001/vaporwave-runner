"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const core_2 = require("@ngx-translate/core");
const components_1 = require("./components/");
const directives_1 = require("./directives/");
const forms_1 = require("@angular/forms");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [components_1.PageNotFoundComponent, directives_1.WebviewDirective],
        imports: [common_1.CommonModule, core_2.TranslateModule, forms_1.FormsModule],
        exports: [core_2.TranslateModule, directives_1.WebviewDirective, forms_1.FormsModule]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map