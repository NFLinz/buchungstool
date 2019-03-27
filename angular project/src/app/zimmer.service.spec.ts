import { TestBed, inject } from '@angular/core/testing';

import { ZimmerService } from './zimmer.service';

describe('ZimmerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZimmerService]
    });
  });

  it('should be created', inject([ZimmerService], (service: ZimmerService) => {
    expect(service).toBeTruthy();
  }));
});
