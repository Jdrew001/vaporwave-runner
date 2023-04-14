import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent {

  get playerScore() { return this.scoreService.score; }

  scoreOpts: AnimationOptions = {
    path: 'assets/ui/score/main.json',
    name: 'score',
    autoplay: false,
    loop: false,
    renderer: 'svg'
  }

  scoreStyles: Partial<CSSStyleDeclaration> = {
    width: "75%",
    margin: "auto"
  };

  constructor(
    private scoreService: ScoreService
  ) {}

  enterFrame(e) {
    
  }
}
