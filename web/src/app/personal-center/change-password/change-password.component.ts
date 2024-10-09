import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  oldPassword: string;
  newPassword: string;

  constructor(private userService: UserService) {}

  onSubmit() {
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(
      (response) => {
        // 处理成功响应
        console.log('Password changed successfully', response);
      },
      (error) => {
        // 处理错误响应
        console.error('Error changing password', error);
      }
    );
  }
}
