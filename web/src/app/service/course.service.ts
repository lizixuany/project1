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

  getClazzBySchoolId(schoolId: number): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(`api/course/getClazzBySchoolId?schoolId=${schoolId}`);
  }
  getTermsBySchoolId(schoolId: number): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`api/course/getTermsBySchoolId?schoolId=${schoolId}`);
  }
}
