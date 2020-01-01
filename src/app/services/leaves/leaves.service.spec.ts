import {TestBed} from '@angular/core/testing';

import {LeavesService} from './leaves.service';

describe('LeavesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeavesService = TestBed.get(LeavesService);
    expect(service).toBeTruthy();
  });
});
