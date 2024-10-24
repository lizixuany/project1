import {Component, Inject} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {UserService} from '../../service/user.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onSubmit() {
    // const id = this.id.toString();
    // this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(
    //   (response) => {
    //     // 处理成功响应
    //     console.log('Password changed successfully', response);
    //     this.dialogRef.close(response);
    //   },
    //   (error) => {
    //     // 处理错误响应
    //     console.error('Error changing password', error);
    //   }
    // );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
