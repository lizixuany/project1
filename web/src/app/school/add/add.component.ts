import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
              private router: Router,
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
        } else {
          // 检查message字段是否存在于响应中
          const errorMessage = response.hasOwnProperty('message') ? response['message'] : '未知错误';
          console.error('保存失败', errorMessage);
        }
      },
      error: (error) => {
        console.error('保存失败', error);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
