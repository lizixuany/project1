import { TestBed } from '@angular/core/testing';

import { LocalCheckerService } from './local-checker.service';

describe('SessionCheckerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalCheckerService = TestBed.get(LocalCheckerService);
    expect(service).toBeTruthy();
  });
});
