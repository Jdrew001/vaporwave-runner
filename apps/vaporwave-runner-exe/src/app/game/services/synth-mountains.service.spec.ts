import { TestBed } from '@angular/core/testing';

import { SynthMountainsService } from './synth-mountains.service';

describe('SynthMountainsService', () => {
  let service: SynthMountainsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynthMountainsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
