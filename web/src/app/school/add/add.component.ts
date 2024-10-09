import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {School} from '../../../entity/school';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  school = {
    name: ''
  };
  schools: any[] = [];
  private url: 'school';

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.httpClient.post('api/school/add', this.school).subscribe({
      next: (response) => {
        console.log(response);
        if (response['status'] === 'success') {
          this.router.navigate(['/school']);
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
}
