import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../entity/user';
import {School} from '../entity/school';
import {Clazz} from '../entity/clazz';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
    role: 1,
    // tslint:disable-next-line:variable-name
    clazz_id: 1,
    school_id: 1,
    state: 1,
    name: '',
  };

  clazzs = new Array<Clazz>();

  constructor(private httpClient: HttpClient,
              private router: Router,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.httpClient.get<Array<Clazz>>('api/clazz')
      .subscribe(clazzs => this.clazzs = clazzs);
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.user);
    this.httpClient.post('/api/user/add', this.user)
      .subscribe((result) => {
        console.log('接收到返回数据', result);
        this.dialogRef.close(result);
      }, (error) => {
        console.log('请求失败', error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    console.log('school_id', school_id);
    this.user.school_id = school_id;
  }

  // tslint:disable-next-line:variable-name
  onClazzChange(clazz_id: number): void {
    console.log('clazz_id', clazz_id);
    this.user.clazz_id = clazz_id;
  }
}
