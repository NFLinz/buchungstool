import { TestBed, inject } from '@angular/core/testing';

import { CloseddayService } from './closedday.service';

describe('CloseddayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloseddayService]
    });
  });

  it('should be created', inject([CloseddayService], (service: CloseddayService) => {
    expect(service).toBeTruthy();
  }));
});
