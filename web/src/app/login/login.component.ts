import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../entity/user';
import {SharedService} from '../service/shared.service';
import { LoginService } from '../service/login.service';
import {SweetAlertService} from '../service/sweet-alert.service';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  user = new User();
  data: any;
  errorMessage: string;

  @Output()
  beLogin = new EventEmitter<User>();

  /**
   * 是否显示错误信息
   */
  showError = false;
  private code: any;

  constructor(private httpClient: HttpClient,
              private ngZone: NgZone,
              private loginService: LoginService,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService) {}

  ngOnInit(): void {
  }


  onSubmit(): void {
    console.log('点击了登录按钮');
    const authString = encodeURIComponent(this.user.username) + ':'
      + encodeURIComponent(this.user.password);
    const authToken = btoa(authString);
    const loginData = {
      username: this.user.username,
      password: this.user.password
    };
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('Authorization', 'Basic ' + authToken);
    this.httpClient
      .post<User>(
        '/api/login',
        loginData, {headers: httpHeaders})
      .subscribe(user => {
          console.log(user);
          if (user) {
            this.sharedService.setData(user);
            this.beLogin.emit(user);
            this.sweetAlertService.showSuccess('登录成功!', 'success');
            // tslint:disable-next-line:no-shadowed-variable
            this.loginService.getCurrentUser().subscribe(user => {
              console.log('Current User:', user);
            });
          } else {
            this.showErrorDelay();
          }
        },
        error => {
          console.log('发生错误, 登录失败。', error);
          this.showErrorDelay();
        });
  }

  /**
   * 延迟显示错误信息
   */
  showErrorDelay(): void {
    this.showError = true;
    this.ngZone.run(() => {
      setTimeout(() => {
        console.log('1.5秒后触发');
        this.showError = false;
      }, 1500);
    });
  }
}
