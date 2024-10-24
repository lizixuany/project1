import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../service/shared.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './change-password/change-password.component';

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
              private sharedService: SharedService) {
    this.user = this.sharedService.getData();
  }

  ngOnInit(): void {
    console.log(new Date().toTimeString(), '子组件进行了数据弹射', this.user);
    console.log('请求当前登录用户成功');
    this.me = this.user;
    console.log(this.me);
    console.log(this.user.name);
  }

  openDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '1000px',
      height: '400px',
    });
  }
}
