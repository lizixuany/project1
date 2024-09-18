import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../entity/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('api/index/login', {username, password});
  }
}
