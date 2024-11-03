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
import {CourseService} from '../../service/course.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {Subscription} from 'rxjs';

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

  course = {
    id: null as unknown as number,
    name: '',
    sory: null as unknown as number,
    school_id: null as unknown as number,
    clazz_id: null as unknown as number,
    term_id: null as unknown as number,
    week: [],
    day: [],
    period: [],
  };
  value = '';
  terms = new Array<Term>();
  clazzes = new Array<Clazz>();

  semesterStartDate: Date;
  semesterEndDate: Date;

  weeks: number[] = [];
  days: {name: string, value: number}[] = [
    {name: '周一', value: 1},
    {name: '周二', value: 2},
    {name: '周三', value: 3},
    {name: '周四', value: 4},
    {name: '周五', value: 5},
    {name: '周六', value: 6},
    {name: '周日', value: 7},
  ];
  periods: {name: string, value: number}[] = [
    {name: '第一大节', value: 1},
    {name: '第二大节', value: 2},
    {name: '第三大节', value: 3},
    {name: '第四大节', value: 4},
    {name: '第五大节', value: 5}
  ];

  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    sory: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    term_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
    week: new FormControl(null, Validators.required),
    day: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required)
  });
  private termIdSubscription: Subscription;
  // tslint:disable-next-line:variable-name
  term_id: number;


  constructor(private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private courseService: CourseService) { }

  ngOnInit(): void {
    // tslint:disable-next-line:no-non-null-assertion
    this.termIdSubscription = this.formGroup.get('term_id')!.valueChanges.subscribe(value => {
      console.log('Term ID changed to:', value);
      this.onTermChange(value);
    });
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
        this.formGroup.get('school_id').setValue(course[0].school_id);
        this.formGroup.get('term_id').setValue(course[0].term_id);
        this.formGroup.get('sory').setValue(course[0].sory);
        this.formGroup.get('clazz_id').setValue(course[0].clazz_id);
        this.formGroup.get('week').setValue(course[0].week);
        console.log(course[0].week);
        this.formGroup.get('period').setValue(course[0].period);
        this.formGroup.get('day').setValue(course[0].day);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.formGroup.value);
    const courseId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const clazzId = this.formGroup.get('clazz_id').value;
    const schoolId = this.formGroup.get('school_id').value;
    const sory = this.formGroup.get('sory').value;
    const week = this.formGroup.get('week').value;
    const day = this.formGroup.get('day').value;
    const period = this.formGroup.get('period').value;
    const termId = this.formGroup.get('term_id').value;
    const course = new Course({
      id: courseId,
      name,
      school: new School({id: schoolId}),
      clazz: new Clazz({id: clazzId}),
      term: new Term({id: termId}),
      week,
      day,
      period,
      sory
    });
    console.log(course);
    this.httpClient.put<Course>(`/api/course/update`, course)
      .subscribe(() => {
          // 更新成功后，导航回主列表页面
          try {
            this.dialogRef.close(course);
            this.sweetAlertService.showSuccess('编辑成功！', 'success');
            window.location.href = 'http://127.0.0.1:8088/course';
          } catch (err) {
            console.log('Navigation failed', err);
          }
        },
        error => {
          if (error.error.error === '课程已存在') {
            this.sweetAlertService.showError('新增失败', '课程已存在', '');
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
    this.courseService.getClazzBySchoolId(schoolId)
      .subscribe(clazzes => {
        this.clazzes = clazzes;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getTermsBySchoolId(schoolId: number) {
    this.courseService.getTermsBySchoolId(schoolId)
      .subscribe(terms => {
        this.terms = terms;
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  onSchoolChange(schoolId: number) {
    this.course.school_id = schoolId;
    console.log(this.course.school_id);
    this.getClazzBySchoolId(this.course.school_id);
    this.getTermsBySchoolId(this.course.school_id);
  }

  onTermChange(termId: number) {
    this.course.term_id = termId;
    console.log(this.course.term_id);
    this.courseService.getTerm(termId)
      .subscribe(term => {
        console.log(term);
        console.log(term.start_time);
        this.semesterEndDate = term[0].end_time;
        this.semesterStartDate = term[0].start_time;
        this.calculateWeeks();
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  calculateWeeks(): void {
    const oneDay = 1000 * 60 * 60 * 24;
    const startTime = new Date(this.semesterStartDate);
    const endTime = new Date(this.semesterEndDate);
    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / oneDay); // 使用ceil确保包含最后一天
    const numberOfWeeks = Math.ceil(diffInDays / 7);

    // 创建周数数组
    console.log(numberOfWeeks);
    for (let i = 1; i <= numberOfWeeks; i++) {
      this.weeks.push(i);
      console.log(this.weeks);
    }
  }
}
