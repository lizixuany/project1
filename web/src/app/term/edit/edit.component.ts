import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {Term} from '../../entity/term';
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
   * 学期名称.
   */
  nameFormControl = new FormControl('', Validators.required);

  term = {
    id: 1,
    name: '',
    start_time: new Date(),
    end_time: new Date(),
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
    start_time: new FormControl(null, Validators.required),
    end_time: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required)
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
    console.log(this.term.name);
    this.httpClient.post<Term>(`api/term/edit/${id}`, id)
      .subscribe(term => {
        console.log('接收到了term', term);
        this.term = term;
        this.nameFormControl.patchValue(term[0].name);
        this.formGroup.get('start_time').setValue(term[0].start_time);
        this.formGroup.get('end_time').setValue(term[0].end_time);
        this.formGroup.get('school_id').setValue(term[0].school_id);
      }, error => console.log(error));
  }

  onSchoolChange($event: number): void {
    console.log('接收到了选择的teacherId', $event);
    this.formGroup.get('school_id').setValue($event);
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.term[0].id);
    console.log(this.formGroup.value);
    const termId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const startTime = this.formGroup.get('start_time').value;
    const endTime = this.formGroup.get('end_time').value;
    const schooId = this.formGroup.get('school_id').value;
    const term = new Term({
      id: termId,
      name,
      start_time: startTime,
      end_time: endTime,
      school: new School({id: schooId})
    });
    console.log(term);
    this.httpClient.put<Term>(`/api/term/update`, term)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(term);
            this.sweetAlertService.showSuccess('编辑成功!', 'success');
          } catch (err) {
            console.log('Navigation failed', err);
          }
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
}
