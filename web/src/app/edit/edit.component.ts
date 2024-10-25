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
    school: {
      id: 1,
      name: ''
    },
    clazz: {
      id: 1,
      name: '',
    },
    role: 0,
    state: 0
  };
  value = '';
  School = new Array<School>();
  Clazz = new Array<Clazz>();
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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient,
              private sharedService: SharedService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
        this.user = user;
        this.nameFormControl.patchValue(user[0].name);
        this.formGroup.get('username').setValue(user[0].username);
        this.formGroup.get('sex').setValue(user[0].sex);
        this.formGroup.get('school_id').setValue(user[0].school_id);
        this.formGroup.get('clazz_id').setValue(user[0].clazz_id);
        this.formGroup.get('role').setValue(user[0].role);
        this.formGroup.get('state').setValue(user[0].state);
      }, error => console.log(error));
  }

  onSchoolChange($event: number): void {
    console.log('接收到了选择的schoolId', $event);
    this.formGroup.get('school_id').setValue($event);
  }

  onClazzChange($event: number): void {
    console.log('接收到了选择的clazzId', $event);
    this.formGroup.get('clazz_id').setValue($event);
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.user[0].id);
    console.log(this.formGroup.value);
    const userId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const username = this.formGroup.get('username').value;
    const sex = this.formGroup.get('sex').value;
    const schoolId = this.formGroup.get('school_id').value;
    const clazzId = this.formGroup.get('clazz_id').value;
    const role = this.formGroup.get('role').value;
    const state = this.formGroup.get('state').value;
    const user = new User({
      id: userId,
      name,
      username,
      sex,
      school: new School({id: schoolId}),
      clazz: new Clazz({id: clazzId}),
      role,
      state
    });
    console.log(user);
    this.httpClient.put<Term>(`/api/user/update`, user)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(user);
            console.log('Navigation successful');
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => console.log(error));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get school_id() {
    console.log('school_id');
    return this.formGroup.get('school_id');
  }
}
