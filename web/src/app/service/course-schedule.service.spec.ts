import { TestBed } from '@angular/core/testing';

import { CourseScheduleService } from './course-schedule.service';

describe('CourseScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseScheduleService = TestBed.get(CourseScheduleService);
    expect(service).toBeTruthy();
  });
});
