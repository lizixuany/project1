import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {User} from '../entity/user';
import {catchError} from 'rxjs/operators';
import {Clazz} from '../entity/clazz';

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

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<User> {
    // 发送请求到后端API以更新密码
    const body = {
      id,
      oldPassword,
      newPassword
    };
    return this.httpClient.post<any>(this.apiUrl + '/ChangePassword', body);
  }

  getClazzBySchoolId(schoolId: number): Observable<Array<Clazz>> {
    return this.httpClient.get<Array<Clazz>>(`api/user/getClazzBySchoolId?schoolId=${schoolId}`);
  }
}
