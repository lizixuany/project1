import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {User} from '../entity/user';
import {catchError} from 'rxjs/operators';
import {Clazz} from "../entity/clazz";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private key;
  private apiUrl = '/api';
  /**
   * Subject是个大V.
   * 本大V只需要发送一个未认证的通知，并不需要传递具体数据，所以泛型为void
   */
  public unUserSubject = new Subject<void>();

  constructor(private httpClient: HttpClient) {
    console.log('UserService构造函数被调用');
    this.key = Math.random();
  }

  /**
   * 获取学生
   * @param id ID
   */
  getById(id: number): Observable<User> {
    return this.httpClient.post<User>('/change-password/getById', id);
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<User> {
    // 发送请求到后端API以更新密码
    const body = {
      id,
      oldPassword,
      newPassword
    };
    return this.httpClient.post(this.apiUrl + '/ChangePassword', body)
      .pipe(
        catchError(this.handleError) // 处理HTTP请求错误
      );
  }

  private handleError(error: any): Observable<any> {
    // 处理错误，例如显示错误消息
    console.error('An error occurred:', error);
    return Observable.throw(error.message || 'Server error');
  }

  getClazzBySchoolId(schoolId: number): Observable<Array<Clazz>> {
    return this.httpClient.get<Array<Clazz>>(`api/user/getClazzBySchoolId?schoolId=${schoolId}`);
  }
}
