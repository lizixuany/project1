import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = '/api/login'; // 登录API的URL
  private currentUserUrl = '/api/login/currentUser'; // 获取当前登录用户信息的API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.currentUserUrl).pipe(
      map(response => response)
    );
  }
}
