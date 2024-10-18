import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Clazz} from '../entity/clazz';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {School} from '../entity/school';

@Injectable({
  providedIn: 'root'
})
export class ClazzService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 新增班级.
   */
  add(data: { name: string, school: School }): Observable<Clazz> {
    const clazz = new Clazz({
      name: data.name,
      school: data.school,
    });
    // 将预请求信息返回
    return this.httpClient.post<Clazz>('/clazz', clazz);
  }

  searchClazz(name: string): Observable<Clazz> {
    return this.httpClient.get<Clazz>(`/api/clazz/search?name=${name}`);
  }
}
