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

  /**
   * 当前登录用户的分页信息
   * @param data 分页信息
   */
  pageOfCurrentTeacher({page = 0, size = 20}: { page?: number, size?: number }): Observable<Page<Clazz>> {
    const httpParams = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());
    return this.httpClient.get<Page<Clazz>>('/clazz/pageOfCurrentTeacher', {params: httpParams});
  }

  /**
   * 删除
   * @param id 学生ID
   */
  delete(id: number): Observable<void> {
    const url = '/clazz/' + id.toString();
    return this.httpClient.delete<void>(url);
  }

  /**
   * 批量删除
   * @param ids 学生ID数组
   */
  batchDelete(ids: number[]): Observable<void> {
    const stringIds = ids.map(id => id.toString());
    return this.httpClient.delete<void>('/clazz/batchDeleteIds', {params: {ids: stringIds}});
   }

  /**
   * 获取学生
   * @param id 学生ID
   */
  getById(id: number): Observable<Clazz> {
    return this.httpClient.get<Clazz>('/clazz/' + id.toString());
  }

  /**
   * 更新学生
   * @param id 学生ID
   * @param clazz 学生信息
   */
  update(id: number, clazz: {name: string, number: string, phone: string, email: string, clazz: { id: number } }): Observable<Clazz> {
    return this.httpClient.put<Clazz>(`/clazz/${id}`, clazz);
  }
}
