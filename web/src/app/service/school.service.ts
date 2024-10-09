import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {School} from '../../entity/school';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = 'api/school';

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }

  /**
   * 获取学生
   */
  getById(school_id: number): Observable<any> {
    console.log(school_id);
    return this.httpClient.get<School>('/school/' + school_id.toString());
  }

  /**
   * 更新
   */
  update(school_id: number, school: {name: string}): Observable<School> {
    return this.httpClient.put<School>(`/school/${school_id}`, school);
  }
}
