import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  me = new User();

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    const url = '/api/User';
    this.httpClient.get<User>(url)
      .subscribe(user => {
          console.log('请求当前登录用户成功');
          console.log(user);
          this.me = user;
        },
        error => console.log('请求当前登录用户发生错误', error));
  }
}
