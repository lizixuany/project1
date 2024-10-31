import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Clazz} from '../../entity/clazz';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {SharedService} from '../../service/shared.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  /**
   * 班级名称.
   */
  nameFormControl = new FormControl('', Validators.required);

  school = {
    id: 1,
    name: '',
  };
  value = '';
  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
  });

  constructor(private activatedRoute: ActivatedRoute,
              private sweetAlertService: SweetAlertService,
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
    console.log(this.school.name);
    this.httpClient.post<School>(`api/school/edit/${id}`, id)
      .subscribe(school => {
        console.log('接收到了clazz', school);
        this.school = school;
        this.nameFormControl.patchValue(school[0].name);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.school[0].id);
    console.log(this.formGroup.value);
    const schoolId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const school = new School({
      id: schoolId,
      name,
    });
    console.log(school);
    this.httpClient.put<School>(`/api/school/update`, school)
      .subscribe(() => {
        this.dialogRef.close(school);
        this.sweetAlertService.showSuccess('编辑成功!', 'success');
          window.location.href = 'http://127.0.0.1:8088/school';
        },
        error => {
          if (error.error.error === '学校已存在') {
            this.sweetAlertService.showError('编辑失败', '学校已存在', '');
          } else {
            this.sweetAlertService.showError('编辑失败', '', '');
          }
          console.log(error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
