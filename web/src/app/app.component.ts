import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './entity/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // 初始化教师数组
  users = [
    {name: 'zhangsan', username: 'username'} as User
  ] as User[];

  constructor(private httpClient: HttpClient) {
    console.log(httpClient);
  }

  /**
   * 组件初始化完成后将被自动执行一次
   */
  ngOnInit(): void {
    this.httpClient.get<User[]>('/api/login')
      .subscribe(users => {
        this.users = users;
        console.log(this.users, 'value');
      });
  }

  onDelete(id: number): void {
    const url = `/user/${id}`;
    this.httpClient.delete(url)
      .subscribe(() => this.ngOnInit(),
        error => console.log('删除失败', error));
  }
}
