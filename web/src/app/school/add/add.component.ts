import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  school = {
    name: ''
  };

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.httpClient.post('api/school/add', this.school).subscribe({
      next: (response) => {
        console.log(response);
        if (response['status'] === 'success') {
          this.dialogRef.close(response);
          this.sweetAlertService.showSuccess('新增成功!', 'success');
          window.location.href = 'http://127.0.0.1:8088/school';
        } else {
          // 检查message字段是否存在于响应中
          const errorMessage = response.hasOwnProperty('message') ? response['message'] : '未知错误';
          console.error('保存失败', errorMessage);
        }
      },
      error: (error) => {
        if (error.error.error === '学校已存在') {
          this.sweetAlertService.showError('新增失败', '学校已存在', '');
        } else {
          this.sweetAlertService.showError('新增失败', '', '');
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
