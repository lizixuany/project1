import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Clazz} from '../../entity/clazz';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedService} from '../../service/shared.service';
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

  clazz = {
    id: 1,
    name: '',
    school: {
      id: 1,
      name: ''
    }
  };
  value = '';
  School = new Array<School>();
  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    school_id: new FormControl(null, Validators.required)
  });

  constructor(private activatedRoute: ActivatedRoute,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              private httpClient: HttpClient,
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
    console.log(this.clazz.name);
    this.httpClient.post<Clazz>(`api/clazz/edit/${id}`, id)
      .subscribe(clazz => {
        console.log('接收到了clazz', clazz);
        this.clazz = clazz;
        this.nameFormControl.patchValue(clazz[0].name);
        this.formGroup.get('school_id').setValue(clazz[0].school_id);
      }, error => console.log(error));
  }

  onSchoolChange($event: number): void {
    console.log('接收到了选择的schoolId', $event);
    this.formGroup.get('school_id').setValue($event);
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.clazz[0].id);
    console.log(this.formGroup.value);
    const clazzId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const schooId = this.formGroup.get('school_id').value;
    const clazz = new Clazz({
      id: clazzId,
      name,
      school: new School({id: schooId})
    });
    console.log(clazz);
    this.httpClient.put<Clazz>(`/api/clazz/update`, clazz)
      .subscribe(() => {
          // 更新成功后，关闭弹窗
            this.dialogRef.close(clazz);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
        },
        error => {
          if (error.error.error === '班级已存在') {
            this.sweetAlertService.showError('编辑失败', '班级已存在', '');
          } else if (error.error.error === '与已有课程的时间冲突') {
            this.sweetAlertService.showError('编辑失败', '与已有课程的时间冲突', '');
          } else {
            this.sweetAlertService.showError('编辑失败', '', '');
          }
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get school_id() {
    console.log('school_id');
    return this.formGroup.get('school_id');
  }
}
