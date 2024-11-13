import {Component, EventEmitter, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CourseScheduleService} from '../service/course-schedule.service';
import {LoginService} from '../service/login.service';
import {SharedService} from '../service/shared.service';
import {User} from '../entity/user';
import {SweetAlertService} from '../service/sweet-alert.service';
import {CourseService} from '../service/course.service';
import {Clazz} from '../entity/clazz';
import {Term} from '../entity/term';
import {TermService} from '../service/term.service';

@Component({
  selector: 'app-course-schedule',
  templateUrl: './course-schedule.component.html',
  styleUrls: ['./course-schedule.component.css']
})
export class CourseScheduleComponent implements OnInit {
  courseTable: any[][] = []; // 确保已经初始化
  clazzes = new Array<Clazz>();
  terms = new Array<Term>();
  term = new Term();
  semesterStartDate: Date;
  semesterEndDate: Date;

  weeks: number[] = [];
  dates: Date[] = [];
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
  searchParameters = {
    school: null as unknown as number,
    clazz: null,
    term: null,
    week: null
  };

  me = new User();
  beLogout = new EventEmitter<void>();

  constructor(private courseScheduleService: CourseScheduleService,
              private httpClient: HttpClient,
              private loginService: LoginService,
              private termService: TermService,
              private sweetAlertService: SweetAlertService,
              private courseService: CourseService) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        if (this.searchParameters.school === null) {
          this.searchParameters.school = user.school_id;
        }
        if (this.searchParameters.clazz === null) {
          this.searchParameters.clazz = user.clazz_id;
          console.log(this.searchParameters.clazz);
        }
        if (this.searchParameters.term === null) {
          this.termService.getCurrentTerm(this.searchParameters.school)
            .subscribe(response => {
                this.searchParameters.term = response.term.id;
                this.semesterStartDate = response.term.start_time;
                this.semesterEndDate = response.term.end_time;
                this.calculateWeeks();
                this.searchParameters.week = response.week_number;
                this.getWeekDates(this.searchParameters.week);
                console.log(this.searchParameters);
                this.onSearchSubmit();
            }, error => {
              if (error.error.error === '当前学期不存在，请先添加学期信息') {
                this.sweetAlertService.showWithoutTerm('未识别到当前学期信息', '请先添加学期信息。', '');
              } else if (error.error.error === '未识别到当前学校信息') {
                this.sweetAlertService.showWithoutTerm('未识别到当前学期信息', '当前日期不在任何学期的日期范围内', '');
              }
            });
        }
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
  }

  onSearchSubmit() {
    console.log('调用了onSearchSubmit()方法');
    console.log(this.searchParameters.school);
    console.log(this.searchParameters.clazz);
    console.log(this.searchParameters.term);
    console.log(this.searchParameters.week);
    this.courseScheduleService.getCourseTable(
      this.searchParameters.school,
      this.searchParameters.clazz,
      this.searchParameters.term,
      this.searchParameters.week
    ).subscribe(
      (response) => {
        console.log(response); // 查看完整的响应数据
        if (response.status === 'success') {
          this.processCourseData(response.data);
        } else {
          console.error('Error:', response.message);
        }
      },
      (error) => {
        console.error('HTTP error:', error);
      }
    );
  }

  processCourseData(courses: any[]) {
    // 初始化课表，最多7天，每天5个大节
    this.courseTable = Array.from({ length: 7 }, () => new Array(5).fill(''));

    courses.forEach((course) => {
      const dayIndex = course.day - 1; // 转换为整数并减1，因为数组索引从0开始
      const periodIndex = course.period - 1; // 转换为整数并减1

      // 检查索引是否在有效范围内
      if (dayIndex >= 0 && dayIndex < 7 && periodIndex >= 0 && periodIndex < 5) {
        // 直接将课程名称赋值到对应的位置
        this.courseTable[dayIndex][periodIndex] = course.name;
      } else {
        console.error('无效的课程表索引:', dayIndex, periodIndex);
      }
    });
  }

  private handleInvalidToken(): void {
    this.sweetAlertService.showLogoutWarning('登录失效', '');
    setTimeout(() => {
      window.sessionStorage.removeItem('login');
      this.httpClient.post('/api/Login/logout', {}).subscribe(
        () => {
          console.log('logout');
          this.beLogout.emit();
          window.location.href = 'http://127.0.0.1:8088';
        },
        error => {
          console.error('注销失败', error);
        }
      );
    }, 1500);
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
    this.searchParameters.clazz = null;
    this.searchParameters.term = null;
    this.searchParameters.week = null;
    this.searchParameters.school = schoolId;
    console.log(this.searchParameters.school);
    this.getClazzBySchoolId(this.searchParameters.school);
    this.getTermsBySchoolId(this.searchParameters.school);
  }

  onTermChange(termId: number) {
    this.searchParameters.week = null;
    this.searchParameters.term = termId;
    console.log(this.searchParameters.term);
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

  getWeekDates(weekNumber: number): void {
    const start = new Date(this.semesterStartDate);
    start.setDate(start.getDate() + (weekNumber - 1) * 7);
    const dates = []; // 创建一个空数组来存储格式化后的日期
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      // 格式化日期为YYYY-MM-DD
      const formattedDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2);
      dates.push(formattedDate); // 将格式化后的日期添加到数组中
      start.setDate(start.getDate() + 1); // 增加一天
    }
    this.dates = dates; // 返回包含格式化日期的数组
  }
}
