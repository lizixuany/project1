import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  passwordMismatch = false;

  constructor(private http: HttpClient) {}

  onChangePassword(form: NgForm) {
    if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    this.http.post('/api/Changepassword', this.passwordData).subscribe(
      (response) => {
        // Handle success
        console.log('Password changed successfully', response);
      },
      (error) => {
        // Handle error
        console.error('Error changing password', error);
      }
    );
  }
}
