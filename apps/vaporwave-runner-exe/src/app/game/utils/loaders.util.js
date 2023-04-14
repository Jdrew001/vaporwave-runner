"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.MtlObjLoadersService = void 0;
const core_1 = require("@angular/core");
const three_1 = require("three");
const MTLLoader_1 = require("three/examples/jsm/loaders/MTLLoader");
const OBJLoader_1 = require("three/examples/jsm/loaders/OBJLoader");
let MtlObjLoadersService = class MtlObjLoadersService {
    constructor() {
        this._mtlLoader = new MTLLoader_1.MTLLoader();
        this._objLoader = new OBJLoader_1.OBJLoader();
    }
    get mtlLoader() { return this._mtlLoader; }
    get objLoader() { return this._objLoader; }
    /**
     * Load the entity by providing the asset url
     * @param pathToEntityMtl - Ex: 'assets/{entity}.mtl
     * @param pathToEntityMtl - Ex: 'assets/{entity}.obj
     */
    loadEntity(pathToEntityMtl, pathToEntityObj) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setMaterialsToMTL(yield this.loadEntityMtl(pathToEntityMtl));
            return yield this.objLoader.loadAsync(pathToEntityObj);
        });
    }
    loadEntityObj(mtl, pathToEntityObj) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setMaterialsToMTL(mtl);
            return yield this.objLoader.loadAsync(pathToEntityObj);
        });
    }
    loadEntityMtl(pathToMTL) {
        return __awaiter(this, void 0, void 0, function* () {
            const mtl = yield this.mtlLoader.loadAsync(pathToMTL);
            mtl.preload();
            return mtl;
        });
    }
    setMaterialsToMTL(entityMTL) {
        var _a, _b;
        let mtl = this.objLoader.setMaterials(entityMTL);
        let neon = (_a = mtl.materials) === null || _a === void 0 ? void 0 : _a.materials['Neon'];
        let floorNeon = (_b = mtl.materials) === null || _b === void 0 ? void 0 : _b.materials['floorNeon'];
        let floorBase = mtl.materials.materials['floorBase'];
        if (neon) {
            neon.color = new three_1.Color(0x33FF2C);
        }
        if (floorNeon) {
            floorNeon.color = new three_1.Color(0x00B1FF);
            floorNeon.opacity = 0.2;
            floorNeon.fog = true;
        }
    }
};
MtlObjLoadersService = __decorate([
    (0, core_1.Injectable)()
], MtlObjLoadersService);
exports.MtlObjLoadersService = MtlObjLoadersService;
//# sourceMappingURL=loaders.util.js.map