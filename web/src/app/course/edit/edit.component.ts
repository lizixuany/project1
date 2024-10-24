import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {Term} from '../../entity/term';
import {Clazz} from '../../entity/clazz';
import {Course} from '../../entity/course';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {SharedService} from '../../service/shared.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  /**
   * 课表名称.
   */
  nameFormControl = new FormControl('', Validators.required);
  weekFormControl = new FormControl(null, Validators.required);

  course = {
    id: 1,
    name: '',
    week: 1,
    school: {
      id: 1,
      name: ''
    },
    clazz: {
      id: 1,
      name: '',
      school_id: 1
    },
    term: {
      id: 1,
      name: '',
      school_id: 1,
      start_time: new Date(),
      end_time: new Date()
    }
  };
  value = '';
  School = new Array<School>();
  Term = new Array<Term>();
  Clazz = new Array<Clazz>();
  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    week: this.weekFormControl,
    school_id: new FormControl(null, Validators.required),
    term_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required)
  });

  constructor(private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private sharedService: SharedService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.loadById(+id);
  }

  /**
   * 由后台加载预编辑的课表.
   * @param id 课表id.
   */
  loadById(id: number): void {
    console.log('loadById');
    id = this.sharedService.getId();
    console.log(id);
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    this.httpClient.post<Course>(`api/course/edit/${id}`, id)
      .subscribe(course => {
        console.log('接收到了course', course);
        this.nameFormControl.patchValue(course[0].name);
        this.weekFormControl.patchValue(course[0].week);
        this.formGroup.get('school_id').setValue(course[0].school_id);
        this.formGroup.get('term_id').setValue(course[0].term_id);
        this.formGroup.get('clazz_id').setValue(course[0].clazz_id);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.formGroup.value);
    const courseId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const week = this.weekFormControl.value;
    const clazzId = this.formGroup.get('clazz_id').value;
    const schoolId = this.formGroup.get('school_id').value;
    const termId = this.formGroup.get('term_id').value;
    const course = new Course({
      id: courseId,
      name,
      week,
      school: new School({id: schoolId}),
      clazz: new Clazz({id: clazzId}),
      term: new Term({id: termId})
    });
    console.log(course);
    this.httpClient.put<Course>(`/api/course/update`, course)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(course);
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
