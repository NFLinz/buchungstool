import { TestBed, inject } from '@angular/core/testing';

import { HuetteService } from './huette.service';

describe('HuetteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HuetteService]
    });
  });

  it('should be created', inject([HuetteService], (service: HuetteService) => {
    expect(service).toBeTruthy();
  }));
});
