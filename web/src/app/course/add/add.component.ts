import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {School} from '../../entity/school';
import {Term} from '../../entity/term';
import {Clazz} from '../../entity/clazz';
import {HttpClient} from '@angular/common/http';
import {Course} from '../../entity/course';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../service/course.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {User} from '../../entity/user';
import {LoginService} from '../../service/login.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  private url = 'api/course/add';
  course = {
    name: '',
    school_id: null as unknown as number,
    term_id: null as unknown as number,
    clazz_id: null as unknown as number,
    user_id: null as unknown as number,
    sory: 1,
    week: [],
    day: null as unknown as number,
    period: null as unknown as number
  };
  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  term = new Term();
  clazzes = new Array<Clazz>();
  users = new Array<User>();

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
  beLogout = new EventEmitter<void>();

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<AddComponent>,
              private loginService: LoginService,
              private userService: UserService,
              private sweetAlertService: SweetAlertService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private courseService: CourseService) { }

  ngOnInit() {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
    // 获取所有学校
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(schools => this.schools = schools);
  }

  onSubmit(): void {
    const newCourse = {
      name: this.course.name,
      sory: this.course.sory,
      week: this.course.week,
      day: this.course.day,
      period: this.course.period,
      school: new School({id: this.course.school_id}),
      clazz: new Clazz({id: this.course.clazz_id}),
      term: new Term({id: this.course.term_id}),
      user: this.course.user_id
    };
    console.log(newCourse.sory);
    console.log(newCourse);
    this.httpClient.post(this.url, newCourse)
      .subscribe(clazz => {
        this.dialogRef.close(newCourse);
        this.sweetAlertService.showSuccess('新增成功！', 'success');
        window.location.href = 'http://127.0.0.1:8088/course';
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
        console.log(term[0].start_time);
        this.semesterEndDate = term[0].end_time;
        this.semesterStartDate = term[0].start_time;
        this.calculateWeeks();
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  onSoryChange() {
    this.userService.getUserWhenSoryChange(this.course.school_id, this.course.clazz_id)
      .subscribe(users => {
        this.users = users;
      }, error => {
        console.error('获取用户失败', error);
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
    for (let i = 1; i <= numberOfWeeks; i++) {
      this.weeks.push(i);
    }
    console.log(this.weeks);
  }

  private handleInvalidToken(): void {
    this.sweetAlertService.showLogoutWarning('登录失效', '');
    setTimeout(() => {
      window.sessionStorage.removeItem('login');
      this.httpClient.post('/api/Login/logout', {}).subscribe(
        () => {
          console.log('logout');
          this.beLogout.emit();
          window.location.href = 'http://127.0.0.1:8088/';
        },
        error => {
          console.error('注销失败', error);
        }
      );
    }, 1500);
  }
}
