import {TestBed} from '@angular/core/testing';

import {TermService} from './term.service';

describe('TermService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TermService = TestBed.get(TermService);
    expect(service).toBeTruthy();
  });
});
