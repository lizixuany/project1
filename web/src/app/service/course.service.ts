import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from '../entity/course';
import {Page} from '../entity/page';
import {Clazz} from '../entity/clazz';
import {Observable} from 'rxjs';
import {Term} from '../entity/term';

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
}
