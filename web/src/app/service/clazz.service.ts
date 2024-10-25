import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Clazz} from '../entity/clazz';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {School} from '../entity/school';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClazzService {
  private value: any;
  private clazzs: Clazz[];

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

  setClazzes(Clazzes: Clazz[]) {
    this.value = Clazzes;
    console.log(Clazzes);
  }

  getClazzes() {
    console.log(this.value);
    return this.value;
  }
}
