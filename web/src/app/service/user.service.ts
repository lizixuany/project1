import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private key;
  private apiUrl = '/api/login';
  /**
   * Subject是个大V.
   * 本大V只需要发送一个未认证的通知，并不需要传递具体数据，所以泛型为void
   */
  public unUserSubject = new Subject<void>();

  constructor(private http: HttpClient) {
    console.log('UserService构造函数被调用');
    this.key = Math.random();
  }

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
