import * as THREE from 'three';
import { OptionsService } from '../services/options.service';

export default class AmbientLightEntity extends THREE.AmbientLightProbe {
    
    constructor() {
        super(0xFFFFFF, 1);
    }

    initialize() {
    }
}