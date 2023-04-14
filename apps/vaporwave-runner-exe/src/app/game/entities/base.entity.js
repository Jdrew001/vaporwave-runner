"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loaders_util_1 = require("../utils/loaders.util");
class BaseEntity {
    constructor(optionService) {
        this.optionService = optionService;
        this.mtlObjLoadersService = new loaders_util_1.MtlObjLoadersService();
    }
}
exports.default = BaseEntity;
//# sourceMappingURL=base.entity.js.map