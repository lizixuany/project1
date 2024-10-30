import {Component, Inject} from '@angular/core';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedService} from '../../service/shared.service';
import {SweetAlertService} from '../../service/sweet-alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  id: number;
  oldPassword: string;
  newPassword: string;
  Password: string;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onSubmit() {
    this.id = this.sharedService.getData().id;
    this.userService.changePassword(this.id, this.oldPassword, this.newPassword)
      .subscribe((response) => {
        // 处理成功响应
        console.log('Password changed successfully', response);
        this.dialogRef.close(response);
      },
      (error) => {
        // 处理错误响应
        if (error.error.error === '旧密码不正确') {
          this.sweetAlertService.showError('修改密码失败', '旧密码不正确', '');
        }
        console.error('Error changing password', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
