import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  login = false;

  constructor(private userService: UserService) {
    console.log('index组件成功注入userService', userService);
  }

  ngOnInit(): void {
    // 获取缓存中的login，能获取到则设置login为true
    if (window.sessionStorage.getItem('login') !== null) {
      this.login = true;
    }
    this.userService.unUserSubject
      .subscribe(() => {
        console.log('接收到未认证的通知');
        if (this.login) {
          this.login = false;
        }
      });
  }

  onLogin(user: User): void {
    console.log(new Date().toTimeString(), '子组件进行了数据弹射', user);
    this.login = true;
    // 将登录状态写入缓存
    window.sessionStorage.setItem('login', 'true');
  }

  onLogout(): void {
    console.log('接收到注销组件的数据弹射，开始注销');
    this.login = false;
    window.sessionStorage.removeItem('login');
  }
}
