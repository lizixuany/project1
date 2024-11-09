import {Component, EventEmitter, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Lesson} from '../entity/lesson';
import {SharedService} from '../service/shared.service';
import {LoginService} from '../service/login.service';
import {SweetAlertService} from '../service/sweet-alert.service';
import {User} from '../entity/user';
import {NgForm} from '@angular/forms';
import {AddComponent} from './add/add.component';
import {MatDialog} from '@angular/material/dialog';
import {Term} from '../entity/term';
import {CourseService} from '../service/course.service';
import {TermService} from '../service/term.service';
import {CreateComponent} from './create/create.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  constructor(private httpClient: HttpClient,
              private sharedService: SharedService,
              private loginService: LoginService,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private courseService: CourseService,
              private termService: TermService) {
  }

  // 默认显示第一条数据
  page = 0;
  // 每页默认五条
  size = 5;

  // 初始化一个有0条数据的
  pageData = new Page<Lesson>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });

  searchParameters = {
    course: null as unknown as number,
    clazz: null as unknown as number,
    school: null as unknown as number,
    userId: null as number,
    term: null as unknown as number,
    sory: null as unknown as number,
  };

  me = new User();
  beLogout = new EventEmitter<void>();
  terms = new Array<Term>();
  termsBySchool = new Array<Term>();


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

  protected readonly Object = Object;

  ngOnInit() {
    this.getTerms();
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

    // 确保在用户信息加载完成后设置userId
    this.loginService.getCurrentUser()
      .subscribe(
      user => {
        this.me = user;
        this.getTermsBySchoolId(user.school_id);
        this.sharedService.setData(user);
        // 用户信息加载完成后，设置搜索参数并发送请求
        this.searchParameters.userId = user.id;
        this.searchParameters.clazz = user.clazz_id;
        this.searchParameters.school = user.school_id;
        console.log(this.searchParameters);
        this.httpClient.post<Page<Lesson>>('/api/lesson', this.searchParameters, {params: httpParams})
          .subscribe(pageData => {
              // 在请求数据之后设置当前页
              this.page = page;
              console.log('lesson组件接收到返回数据，重新设置pageData');
              this.pageData = pageData;
              console.log(pageData);
            },
            error => {
              console.error('请求数据失败', error);
            }
          );
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
  }

  onSubmit(form: NgForm, page = 1) {
    console.log('调用了search');
    console.log(this.searchParameters);
    if (form.valid) {
      const course = form.value.course;
      console.log(this.searchParameters);
      const httpParams = new HttpParams()
        .append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<Lesson>>('/api/lesson', this.searchParameters, { params: httpParams })
        .subscribe(
          pageData => {
            // 在请求数据之后设置当前页
            this.page = page;
            console.log('lesson组件接收到查询返回数据，重新设置pageData');
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

  onDelete(index: number, id: number): void {
    this.sweetAlertService.showWarning('', '', '')
      .then(isConfirmed => {
        if (isConfirmed) {
          this.httpClient.delete(`/api/lesson/delete/${id}`)
            .subscribe(() => {
                console.log('删除成功');
                this.sweetAlertService.showSuccess('删除成功', 'success');
                this.pageData.content.splice(index, 1);
                this.loadByPage();
              },
              error => {
                if (error.error.error === '课程不存在') {
                  this.sweetAlertService.showError('删除失败', '课程已存在', 'error');
                } else {
                  this.sweetAlertService.showError('删除失败', '请稍后再试。', 'error');
                  console.log('删除失败', error);
                }
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
      this.loadByPage();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '1000px',
      height: '370px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadByPage();
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

  getTermsBySchoolId(schoolId: number) {
    this.courseService.getTermsBySchoolId(schoolId)
      .subscribe(terms => {
        this.termsBySchool = terms;
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  getTerms() {
    this.termService.getTerms()
      .subscribe(terms => {
        this.terms = terms;
      }, error => {
        console.error('获取学期失败', error);
      });
  }
}
