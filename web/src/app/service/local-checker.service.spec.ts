import { TestBed } from '@angular/core/testing';

import { SessionCheckerService } from './local-checker.service';

describe('SessionCheckerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionCheckerService = TestBed.get(SessionCheckerService);
    expect(service).toBeTruthy();
  });
});
