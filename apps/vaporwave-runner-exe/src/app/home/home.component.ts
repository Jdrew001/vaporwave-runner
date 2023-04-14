import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showMenu = true;

  constructor(
    private router: Router,
    private electronService: ElectronService) {
      if (sessionStorage.getItem('restart')) {
        sessionStorage.clear();
        this.gameStart();
      }
    }

  ngOnInit(): void {
  }

  gameStart() {
    this.router.navigate(['/game']);
  }

  quitGame() {
    this.electronService.quitGame();
  }
}
