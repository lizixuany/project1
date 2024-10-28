import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SharedService} from '../service/shared.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {stringify} from '@angular/compiler/src/util';
import {UserService} from '../service/user.service';
import {LoginService} from '../service/login.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  me = new User();
  user: User = new User();

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private loginService: LoginService) {
    this.me = this.sharedService.getData();
    console.log(this.me.name);
    console.log('getCurrentUser-constructor');
    this.loginService.getCurrentUser().subscribe(user => {
      this.me = user;
    },
      error => {
        console.error('An error occurred:', error);
        // 在这里处理错误，例如显示错误消息给用户
      },
      () => {
        console.log('Completed');
        // 在这里处理完成时的逻辑
      }
    );
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '1000px',
      height: '400px',
    });
  }
}
