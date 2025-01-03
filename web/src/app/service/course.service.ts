import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Clazz} from '../entity/clazz';
import {Observable} from 'rxjs';
import {Term} from '../entity/term';
import {Course} from '../entity/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient) {}

  getClazzBySchoolId(schoolId: number): Observable<Array<Clazz>> {
    return this.httpClient.get<Array<Clazz>>(`api/course/getClazzBySchoolId?schoolId=${schoolId}`);
  }
  getTermsBySchoolId(schoolId: number): Observable<Array<Term>> {
    return this.httpClient.get<Array<Term>>(`api/course/getTermsBySchoolId?schoolId=${schoolId}`);
  }
  getTerm(termId: number): Observable<Term> {
    return this.httpClient.get<Term>(`api/course/getTerm?termId=${termId}`);
  }
  getCoursesByTermId(termId: number): Observable<Array<Course>> {
    return this.httpClient.get<Array<Course>>(`api/course/getCoursesByTermId?termId=${termId}`);
  }
  getCoursesByTermIdWithClazzId(termId: number, clazzId: number): Observable<Array<Course>> {
    return this.httpClient.get<Array<Course>>(`api/course/getCoursesByTermIdWithClazzId?termId=${termId}&&clazzId=${clazzId}`);
  }
  getCoursesByTermIdWithoutClazzId(termId: number): Observable<Array<Course>> {
    return this.httpClient.get<Array<Course>>(`api/course/getCoursesByTermIdWithoutClazzId?termId=${termId}`);
  }
}
