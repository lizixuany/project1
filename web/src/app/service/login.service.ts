import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = '/api/login'; // 登录API的URL
  private currentUserUrl = '/api/login/currentUser'; // 获取当前登录用户信息的API URL
  private user: any;

  private rolesSubject = new BehaviorSubject<any[]>([]); // 初始化为空数组或从服务器获取的初始数据
  public roles$: Observable<any[]> = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.currentUserUrl).pipe(
      map(response => response)
    );
  }

  getRoles(): Observable<any[]> {
    // 可以在这里发起HTTP请求来获取初始的角色数据，并更新BehaviorSubject
    this.http.get<any[]>('/api/login/getRole').subscribe(roles => {
      console.log(roles);
      this.rolesSubject.next(roles);
    });
    return this.roles$;
  }

  // 更新角色数据的方法（例如，在用户登录或权限更改时调用)
  updateRoles(newRoles: any[]): void {
    this.rolesSubject.next(newRoles);
  }
}
