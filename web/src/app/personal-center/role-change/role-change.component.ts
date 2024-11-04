import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {User} from '../../entity/user';
import {LoginService} from '../../service/login.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-role-change',
  templateUrl: './role-change.component.html',
  styleUrls: ['./role-change.component.css']
})
export class RoleChangeComponent implements OnInit {
  id: number;
  users = new Array<User>();
  me = new User();
  user =  new User();
  roleData = {
    userChangedId: null,
    userId: null,
  };

  constructor(private userService: UserService,
              private sharedService: SharedService,
              private loginService: LoginService,
              private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<RoleChangeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.sharedService.setData(user);
      }
    );
  }

  ngOnInit(): void {
    console.log('roleChange组件调用ngOnInit()');
    this.getUser();
  }

  onSubmit() {
    console.log(this.roleData);
    this.roleData.userChangedId = this.me.id;
    console.log(this.roleData);
    this.httpClient.post('api/user/roleChange', this.roleData)
      .subscribe(response => {
          this.dialogRef.close(response);
          this.sweetAlertService.showSuccess('修改成功!', 'success');
          this.sweetAlertService.returnLogin();
        },
        error => {
            this.sweetAlertService.showError('新增失败', '', '');
            console.log(error);
        });

  }

  getUser() {
    this.httpClient.get<User[]>('api/user/getRoleUser')
      .subscribe(
        (response) => {
          console.log(response);
          this.users = response;
          console.log(this.users);
        });
    return this.users;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
