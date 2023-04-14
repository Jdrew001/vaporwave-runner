import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as THREE from "three";
import { ProgressionModel } from '../models/progression.model';

@Injectable()
export class SubscriptionService {

  public redrawCube$: Subject<{row: any, vector3: Array<THREE.Vector3>}> = new Subject();
  public checkForCubeIntersection$: Subject<any> = new Subject();
  public destroyPlanes$: Subject<any> = new Subject();
  public destoryCubes$: Subject<any> = new Subject();

  public collisionOccurred$: Subject<any> = new Subject();
  public restart$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public updateDifficulty$: Subject<ProgressionModel> = new Subject();
  public progressionTransition$: Subject<boolean> = new Subject();
  public update$: Subject<any> = new Subject();
}
