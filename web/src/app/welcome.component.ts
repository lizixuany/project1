import {Component, EventEmitter} from '@angular/core';
import {SharedService} from './service/shared.service';
import {LoginService} from './service/login.service';
import {SweetAlertService} from './service/sweet-alert.service';
import {HttpClient} from '@angular/common/http';
import {User} from './entity/user';

// 使用注解来标明它是一个组件
@Component({
  selector: 'app-welcome',
  template: `<h1 class="text-center mt-5 pt-5">
    欢迎使用课表查询系统</h1>`
})
export class WelcomeComponent {
  me = new User();
  beLogout = new EventEmitter<void>();

  constructor(
    private sharedService: SharedService,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private httpClient: HttpClient
  ) {
    this.me = this.sharedService.getData();
    console.log(this.me.name);
    console.log('getCurrentUser-constructor');

    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.sharedService.setData(user);
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
  }

  private handleInvalidToken(): void {
    this.sweetAlertService.showLogoutWarning('登录失效', '');
    setTimeout(() => {
      window.sessionStorage.removeItem('login');
      this.httpClient.post('/api/Login/logout', {}).subscribe(
        () => {
          console.log('logout');
          this.beLogout.emit();
          window.location.href = 'http://127.0.0.1:8088';
        },
        error => {
          console.error('注销失败', error);
        }
      );
    }, 1500);
  }
}
