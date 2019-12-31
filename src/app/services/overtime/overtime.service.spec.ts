import {TestBed} from '@angular/core/testing';

import {OvertimeService} from './overtime.service';

describe('OvertimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OvertimeService = TestBed.get(OvertimeService);
    expect(service).toBeTruthy();
  });
});
