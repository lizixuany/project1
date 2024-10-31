import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Clazz} from '../entity/clazz';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../service/sweet-alert.service';
import {UserService} from '../service/user.service';
import {School} from '../entity/school';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  user = {
    id: 1,
    username: '',
    password: '',
    sex: 1,
    role: 3,
    // tslint:disable-next-line:variable-name
    clazz_id: null as unknown as number,
    school_id: null as unknown as number,
    state: 1,
    name: '',
  };
  schools = new Array<School>();
  clazzes = new Array<Clazz>();

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              private router: Router,
              private userService: UserService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    // 获取所有学校
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(schools => this.schools = schools);
  }

  onSubmit(): void {
    console.log(this.user);
    this.httpClient.post('/api/user/add', this.user)
      .subscribe((result) => {
        console.log('接收到返回数据', result);
        this.dialogRef.close(result);
        this.sweetAlertService.showSuccess('新增成功!', 'success');
        window.location.href = 'http://127.0.0.1:8088/user';
      }, (error) => {
        if (error.error.error === '用户已存在') {
          this.sweetAlertService.showError('编辑失败', '用户已存在', '');
        } else if (error.error.error === '超级管理员有且只有一位') {
          this.sweetAlertService.showError('编辑失败', '超级管理员有且只有一位', '');
        } else {
          this.sweetAlertService.showError('编辑失败', '', '');
        }
        console.log('请求失败', error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSchoolChange(schoolId: number): void {
    this.user.school_id = schoolId;
    console.log(this.user.school_id);
    this.getClazzBySchoolId(this.user.school_id);
  }

  getClazzBySchoolId(schoolId: number) {
    this.userService.getClazzBySchoolId(schoolId)
      .subscribe(clazzes => {
        this.clazzes = clazzes;
      }, error => {
        console.error('获取班级失败', error);
      });
  }
}
