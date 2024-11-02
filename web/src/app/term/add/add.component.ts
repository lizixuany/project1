import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SchoolService} from '../../service/school.service';
import {School} from '../../entity/school';
import {FormGroup, FormControl} from '@angular/forms';
import {Term} from '../../entity/term';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  schools: School[] = [];
  term = {
    name: '',
    start_time: null,
    end_time: null,
    school_id: null as unknown as number
  };
  formGroup: FormGroup;

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              private schoolService: SchoolService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      start_time: new FormControl(''),
      end_time: new FormControl(Date),
      school_id: new FormControl(Date)
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
    const newTerm = new Term({
      name: this.term.name,
      start_time: this.term.start_time,
      end_time: this.term.end_time,
      school: new School({id: this.term.school_id})
    });
    console.log(newTerm);
    this.httpClient.post('/api/term/add', newTerm)
      .subscribe(clazz => {
        this.dialogRef.close(newTerm);
        this.sweetAlertService.showSuccess('新增成功！', 'success');
          window.location.href = 'http://127.0.0.1:8088/term';
        },
        error => {
          if (error.error.error === '同名学期已存在') {
            this.sweetAlertService.showError('新增失败', '同名学期已存在', '');
          } else if (error.error.error === '相同开始时间的学期已存在') {
            this.sweetAlertService.showError('新增失败', '相同开始时间的学期已存在', '');
          } else if (error.error.error === '相同结束时间的学期已存在') {
              this.sweetAlertService.showError('新增失败', '相同结束时间的学期已存在', '');
          } else if (error.error.error === '相似时间的学期已存在') {
            this.sweetAlertService.showError('新增失败', '相似时间的学期已存在', '');
          } else if (error.error.error === '学期时间设置异常') {
            this.sweetAlertService.showError('新增失败', '学期时间设置异常', '');
          } else {
            this.sweetAlertService.showError('新增失败', '', '');
          }
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    console.log('school_id', school_id);
    this.term.school_id = school_id;
  }
}
