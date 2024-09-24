import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../entity/user';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  user = new User();

  @Output()
  beLogin = new EventEmitter<User>();

  /**
   * 是否显示错误信息
   */
  showError = false;

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log('点击了登录按钮');
    const authString = encodeURIComponent(this.user.username) + ':'
      + encodeURIComponent(this.user.password);
    const authToken = btoa(authString);

    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('Authorization', 'Basic ' + authToken);
    this.httpClient
      .post<User>(
        '/api/login',
        {headers: httpHeaders})
      .subscribe(user => this.beLogin.emit(user),
        error => {
          console.log('发生错误, 登录失败', error);
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
