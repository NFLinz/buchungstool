import { TestBed, inject } from '@angular/core/testing';

import { MitreisenderService } from './mitreisender.service';

describe('MitreisenderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MitreisenderService]
    });
  });

  it('should be created', inject([MitreisenderService], (service: MitreisenderService) => {
    expect(service).toBeTruthy();
  }));
});
