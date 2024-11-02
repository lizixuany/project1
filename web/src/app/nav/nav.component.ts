import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';
import {SweetAlertService} from '../service/sweet-alert.service';
import {LoginService} from '../service/login.service';

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

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private router: Router,
              private sweetAlertService: SweetAlertService,
              protected loginService: LoginService) {
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
}
