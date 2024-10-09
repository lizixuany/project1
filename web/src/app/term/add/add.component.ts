import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SchoolService} from '../../service/school.service';
import {School} from '../../../entity/school';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  schools: School[] = [];
  term = {
    term: '',
    start_time: '',
    end_time: '',
    school_id: ''
  };
  formGroup: FormGroup;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private schoolService: SchoolService) {
    this.formGroup = new FormGroup({
      term: new FormControl(''),
      start_time: new FormControl(''),
      end_time: new FormControl(''),
      school_id: new FormControl('')
    });
  }

  ngOnInit() {
    console.log(this.term);
    this.getSchools();
  }

  // 获取学校列表
  getSchools() {
    this.schoolService.getList().subscribe(
      (data) => {
        this.schools = data;
      },
      (error) => {
        console.log('Error fetching schools', error);
      }
    );
  }

  onSubmit() {
    this.httpClient.post('api/term/add', this.term).subscribe({
      next: (response) => {
        console.log(response);
        if (response['status'] === 'success') {
          this.router.navigate(['/term']);
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
