import { TestBed } from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { SchoolService } from './school.service';

describe('SchoolService', () => {
  let service: SchoolService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SchoolService]
    })
  });

  it('should be created', () => {
    const service: SchoolService = TestBed.get(SchoolService);
    expect(service).toBeTruthy();
  });
});
