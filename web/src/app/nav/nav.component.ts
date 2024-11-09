import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../service/sweet-alert.service';
import {LoginService} from '../service/login.service';
import {User} from '../entity/user';
import {SharedService} from '../service/shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Output()
  beLogout = new EventEmitter<void>();
  private roles: any[];
  role = false;
  me = new User();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              protected loginService: LoginService) {
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

  ngOnInit(): void {
    this.loginService.roles$.subscribe(roles => {
      console.log(roles);
      this.roles = roles;
      const sessionRole = window.sessionStorage.getItem('role');
      console.log(sessionRole);
      if (sessionRole === 'true') {
        this.role = true;
        console.log('role true');
        window.sessionStorage.setItem('role', 'true');
      }
      if (this.roles.length !== 0) {
        // 这段代码会在 roles 为空数组时执行
        if (this.roles) {
          this.role = true;
          console.log('true');
          window.sessionStorage.setItem('role', 'true');
        } else {
          console.log('false');
          this.role = false;
          window.sessionStorage.setItem('role', 'false');
        }
      }
    });
  }

  onSubmit(): void {
    const url = '/api/Login/logout';
    this.httpClient.get(url)
      .subscribe(() => {
        this.beLogout.emit();
        this.sweetAlertService.showSuccess('注销成功！', '');
        },
        error => {
        this.sweetAlertService.showError('注销失败！', '', '');
        console.log('logout error', error);
        });
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
