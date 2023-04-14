import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedingUpComponent } from './speeding-up.component';

describe('SpeedingUpComponent', () => {
  let component: SpeedingUpComponent;
  let fixture: ComponentFixture<SpeedingUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeedingUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedingUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
