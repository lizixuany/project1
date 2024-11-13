import {Component, Inject, OnInit} from '@angular/core';
import {LoginService} from '../../service/login.service';
import {User} from '../../entity/user';
import {School} from '../../entity/school';
import {Clazz} from '../../entity/clazz';
import {Term} from '../../entity/term';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../service/course.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lesson = {
    name: '',
    school_id: null as unknown as number,
    term_id: null as unknown as number,
    clazz_id: null as unknown as number,
    user_id: null as unknown as number,
    sory: 0,
    week: [],
    day: null as unknown as number,
    period: null as unknown as number
  };

  semesterStartDate: Date;
  semesterEndDate: Date;

  weeks: number[] = [];
  days = [
    {name: '周一', value: 1},
    {name: '周二', value: 2},
    {name: '周三', value: 3},
    {name: '周四', value: 4},
    {name: '周五', value: 5},
    {name: '周六', value: 6},
    {name: '周日', value: 7},
  ];
  periods = [
    {name: '第一大节', value: 1},
    {name: '第二大节', value: 2},
    {name: '第三大节', value: 3},
    {name: '第四大节', value: 4},
    {name: '第五大节', value: 5}
  ];

  me = new User();
  terms = new Array<Term>();

  constructor(private loginService: LoginService,
              private httpClient: HttpClient,
              private courseService: CourseService,
              public dialogRef: MatDialogRef<CreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.getTermsBySchoolId(user.school_id);
        this.lesson.school_id = user.school_id;
        this.lesson.clazz_id = user.clazz_id;
        this.lesson.user_id = user.id;
      }
    );
  }

  onSubmit(): void {
    const newCourse = {
      name: this.lesson.name,
      sory: this.lesson.sory,
      week: this.lesson.week,
      day: this.lesson.day,
      period: this.lesson.period,
      school: new School({id: this.lesson.school_id}),
      clazz: new Clazz({id: this.lesson.clazz_id}),
      term: new Term({id: this.lesson.term_id}),
      user: this.lesson.user_id
    };
    console.log(newCourse.sory);
    console.log(newCourse);
    this.httpClient.post('api/course/add', newCourse)
      .subscribe(clazz => {
          this.dialogRef.close(newCourse);
          this.sweetAlertService.showSuccess('新增成功！', 'success');
        },
        error => {
          if (error.error.error === '课程已存在') {
            this.sweetAlertService.showError('新增失败', '课程已存在', '');
          } else if (error.error.error === '与已有课程的时间冲突') {
            this.sweetAlertService.showError('新增失败', '与已有课程的时间冲突', '');
          } else {
            this.sweetAlertService.showError('新增失败', '', '');
          }
          console.log('保存失败', error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTermsBySchoolId(schoolId: number) {
    this.courseService.getTermsBySchoolId(schoolId)
      .subscribe(terms => {
        this.terms = terms;
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  onTermChange(termId: number) {
    this.lesson.term_id = termId;
    console.log(this.lesson.term_id);
    this.courseService.getTerm(termId)
      .subscribe(term => {
        console.log(term);
        console.log(term[0].start_time);
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

    this.weeks = [];
    // 创建周数数组
    for (let i = 1; i <= numberOfWeeks; i++) {
      this.weeks.push(i);
    }
    console.log(this.weeks);
  }

}
