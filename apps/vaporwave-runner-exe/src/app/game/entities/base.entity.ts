import * as THREE from 'three';
import { OptionsService } from '../services/options.service';
import {MtlObjLoadersService} from "../utils/loaders.util";

export default abstract class BaseEntity {
    
    mtlObjLoadersService = new MtlObjLoadersService();
    group: THREE.Group;

    constructor(
        protected optionService: OptionsService
    ) { }
    abstract initialize(mtl?, index?);
    abstract update();
    abstract destroy();
}