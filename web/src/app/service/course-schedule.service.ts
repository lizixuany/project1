import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseScheduleService {

  constructor(private httpClient: HttpClient) { }

  getCourseTable(schoolId: number, clazzId: number, termId: number, week: number): Observable<any> {
    const searchParameters = {
      school: schoolId,
      clazz: clazzId,
      term: termId,
      weekNumber: week
    };
    console.log(searchParameters);
    return this.httpClient.post(`/api/Schedule/`, searchParameters);
  }
}
