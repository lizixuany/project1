import {Component, EventEmitter, OnInit} from '@angular/core';
import {Page} from '../entity/page';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from '../entity/course';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {SharedService} from '../service/shared.service';
import {NgForm} from '@angular/forms';
import {CourseService} from '../service/course.service';
import {SweetAlertService} from '../service/sweet-alert.service';
import {User} from '../entity/user';
import {LoginService} from '../service/login.service';
import {LessonService} from '../service/lesson.service';
import {Term} from '../entity/term';
import {Clazz} from '../entity/clazz';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  // 默认显示第一条数据
  page = 0;
  // 每页默认五条
  size = 5;
  // 初始化一个有0条数据的

  searchParameters = {
    school: null as unknown as number,
    clazz: null as unknown as number,
    term: null as unknown as number,
    name: ''
  };

  pageData = new Page<Course>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });

  me = new User();
  beLogout = new EventEmitter<void>();

  terms = new Array<Term>();
  term = new Term();
  clazzes = new Array<Clazz>();

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
  protected role: number;

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              private courseService: CourseService,
              private lessonService: LessonService,
              private loginService: LoginService) {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.sharedService.setData(user);
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
  }

  ngOnInit() {
    const sessionRole = window.sessionStorage.getItem('role');
    if (sessionRole !== 'true') {
      this.role = 3;
    }
    console.log('学期组件调用ngOnInit()');
    // 使用默认值 page = 0 调用loadByPage()方法
    this.loadByPage();
  }

  onPage(page: number): void {
    this.loadByPage(page);
  }

  // 方法来获取天的名称
  getDayName(value: number): string {
    const day = this.days.find(d => d.value === value);
    return day ? day.name : '';
  }

  // 方法来获取时间段的名称
  getPeriodName(value: number): string {
    const period = this.periods.find(p => p.value === value);
    return period ? period.name : '';
  }

  loadByPage(page = 1): void {
    console.log('触发loadByPage方法');
    const httpParams = new HttpParams().append('page', page.toString())
      .append('size', this.size.toString());
    this.httpClient.post<Page<Course>>('/api/course', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('课表组件接收到返回数据，重新设置pageData');
          this.pageData = pageData;
          console.log(pageData);
        },
        error => {
          console.error('请求数据失败', error);
        }
      );
  }

  onDelete(index: number, id: number): void {
    this.sweetAlertService.showWarning('', '', '')
      .then(isConfirmed => {
        if (isConfirmed) {
          this.httpClient.delete(`/api/course/delete/${id}`)
            .subscribe(() => {
                console.log('删除成功');
                this.sweetAlertService.showSuccess('删除成功', 'success');
                this.pageData.content.splice(index, 1);
                // 检查当前页是否还有记录
                if (this.pageData.content.length === 0 && this.page > 1) {
                  this.page--; // 如果当前页没有其他记录，跳转到上一页
                }
                this.loadByPage(this.page); // 重新加载当前页数据
              },
              error => {
                  this.sweetAlertService.showError('删除失败', '检查数据是否清除干净，请稍后再试。', 'error');
                  console.log('删除失败', error);
              });
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '1000px',
      height: '370px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadByPage(this.page);
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    console.log(id);
    this.sharedService.setId(id);
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadByPage(this.page);
    });
  }

  addLesson(courseId: number): void {
    console.log('addLesson');
    const userId = this.me.id;
    this.lessonService.addLesson(courseId, userId).subscribe(
      response => {
        console.log('Lesson added successfully', response);
        this.sweetAlertService.showSuccess('添加成功', '');
      },
      error => {
        console.log(error.error.error);
        if (error.error.error === '课程已存在') {
          this.sweetAlertService.showError('添加失败', '课程已存在', '');
        } else if (error.error.error === '用户和课程必须属于同一所学校') {
          this.sweetAlertService.showError('添加失败', '用户和课程必须属于同一所学校', '');
        } else {
          console.error('Failed to add lesson', error);
          this.sweetAlertService.showError('添加失败', '', '');
        }
      }
    );
  }

  onSubmit(form: NgForm, page = 1) {
    console.log('调用了search');
    if (form.valid) {
      const school = form.value.school_id;
      const clazz = form.value.clazz_id;
      const term = form.value.term_id;
      const name = form.value.name;
      console.log('提交的查询参数:', { school, clazz, term, name });
      const httpParams = new HttpParams()
        .append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<Course>>('/api/course', this.searchParameters, { params: httpParams })
        .subscribe(
        pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('course组件接收到查询返回数据，重新设置pageData');
          console.log(pageData);
          this.pageData = pageData;
          this.loadByPage(page);
        },
        error => {
          console.error('请求数据失败', error);
        }
      );
    }
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
    this.searchParameters.school = schoolId;
    console.log(this.searchParameters.school);
    this.getClazzBySchoolId(this.searchParameters.school);
    this.getTermsBySchoolId(this.searchParameters.school);
  }
}
