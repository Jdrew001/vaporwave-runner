import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { SignalComponent } from './components/signal/signal.component';
import { ScoreComponent } from './components/score/score.component';
import { SpeedingUpComponent } from './components/speeding-up/speeding-up.component';

export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [
    GameComponent,
    SignalComponent,
    ScoreComponent,
    SpeedingUpComponent
  ],
  providers: [
    
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ]
})
export class GameModule { }
