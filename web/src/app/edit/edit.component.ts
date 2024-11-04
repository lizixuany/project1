import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Clazz} from '../entity/clazz';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../entity/school';
import {Term} from '../entity/term';
import {SharedService} from '../service/shared.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../entity/user';
import {SweetAlertService} from '../service/sweet-alert.service';
import {UserService} from '../service/user.service';
import {LoginService} from '../service/login.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  /**
   * 用户名称.
   */
  nameFormControl = new FormControl('', Validators.required);

  user = {
    id: 1,
    name: '',
    username: '',
    sex: 0,
    role: 3,
    state: 0,
    school_id: null as unknown as number,
    clazz_id: null as unknown as number
  };
  users = new User();
  value = '';
  schools = new Array<School>();
  clazzes = new Array<Clazz>();
  me = new User();

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    username: new FormControl(null, Validators.required),
    sex: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
    role: new FormControl(null, Validators.required),
    state: new FormControl(null, Validators.required)
  });
  private role: number;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private loginService: LoginService,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.sharedService.setData(user);
      }
    );
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.loadById(+id);
  }

  /**
   * 由后台加载预编辑的班级.
   * @param id 班级id.
   */
  loadById(id: number): void {
    console.log('loadById');
    id = this.sharedService.getId();
    console.log(id);
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    console.log(this.user.name);
    this.httpClient.post<User>(`api/user/edit/${id}`, id)
      .subscribe(user => {
        console.log('接收到了user', user);
        this.users = user;
        this.nameFormControl.patchValue(user[0].name);
        this.formGroup.get('username').setValue(user[0].username);
        this.formGroup.get('sex').setValue(user[0].sex);
        this.formGroup.get('school_id').setValue(user[0].school_id);
        this.formGroup.get('clazz_id').setValue(user[0].clazz_id);
        this.formGroup.get('role').setValue(user[0].role);
        this.formGroup.get('state').setValue(user[0].state);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    const userId = this.users[0].id;
    const name = this.nameFormControl.value;
    const username = this.formGroup.get('username').value;
    const sex = this.formGroup.get('sex').value;
    const schoolId = this.formGroup.get('school_id').value;
    const clazzId = this.formGroup.get('clazz_id').value;
    this.role = this.formGroup.get('role').value;
    if (this.role) {
      this.role = 3;
    }
    const state = this.formGroup.get('state').value;
    const user = new User({
      id: userId,
      name,
      username,
      sex,
      school: new School({id: schoolId}),
      clazz: new Clazz({id: clazzId}),
      role: this.role,
      state
    });
    console.log(user);
    this.httpClient.put<Term>(`/api/user/update`, user)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(user);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
            window.location.href = 'http://127.0.0.1:8088/user';
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '用户已存在') {
            this.sweetAlertService.showError('新增失败', '用户已存在', '');
          } else if (error.error.error === '超级管理员有且只有一位') {
            this.sweetAlertService.showError('新增失败', '超级管理员有且只有一位', '');
          } else {
            this.sweetAlertService.showError('新增失败', '', '');
          }
          console.log(error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get school_id() {
    console.log('school_id');
    return this.formGroup.get('school_id');
  }

  getClazzBySchoolId(schoolId: number) {
    this.userService.getClazzBySchoolId(schoolId)
      .subscribe(clazzes => {
        this.clazzes = clazzes;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  onSchoolChange(schoolId: number) {
    this.user.school_id = schoolId;
    console.log(this.user.school_id);
    this.getClazzBySchoolId(this.user.school_id);
  }
}
