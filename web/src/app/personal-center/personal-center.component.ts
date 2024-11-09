import {Component, EventEmitter, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../service/shared.service';
import {LoginService} from '../service/login.service';
import {SweetAlertService} from '../service/sweet-alert.service';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {User} from '../entity/user';
import {RoleChangeComponent} from './role-change/role-change.component';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  me = new User();
  beLogout = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
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

  ngOnInit(): void {
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

  openPasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '1000px',
      height: '400px',
    });
  }

  openRoleDialog(): void {
    this.dialog.open(RoleChangeComponent, {
      width: '1000px',
      height: '275px',
    });
  }
}
