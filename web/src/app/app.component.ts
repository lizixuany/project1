import {Component, EventEmitter, OnInit} from '@angular/core';
import {Page} from './entity/page';
import {User} from './entity/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormGroup, NgForm} from '@angular/forms';
import {SharedService} from './service/shared.service';
import {Confirm} from 'notiflix';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {Clazz} from './entity/clazz';
import {SweetAlertService} from './service/sweet-alert.service';
import {LoginService} from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // 默认显示第1页的内容
  page = 0;

  // 每页默认为5条
  size = 5;

  // 初始化一个有0条数据的
  pageData = new Page<User>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });

  searchParameters = {
    username: '',
    school: null as unknown as number,
    clazz: null as unknown as number,
    role: null as unknown as number,
    state: null as unknown as number
  };
  school: any;
  clazzs: Clazz[];

  me = new User();
  role = 0;
  beLogout = new EventEmitter<void>();

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
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

  form = new FormGroup({});

  ngOnInit(): void {
    // 导航栏隐藏，设置权限
    const sessionRole = window.sessionStorage.getItem('role');
    if (sessionRole !== 'true') {
      window.location.href = 'http://127.0.0.1:8088/';
      this.sweetAlertService.showError('无权限', '', '');
    }

    console.log('app组件调用ngOnInit()');
    this.getClazz();
    // 使用默认值 page = 0 调用loadByPage()方法
    this.loadByPage();
  }

  getClazz() {
    this.httpClient.get<{ content: Clazz[] }>('api/clazz/')
      .subscribe(
        (response) => {
          this.clazzs = response.content;
          console.log(this.clazzs);
        });
    return this.clazzs;
  }

  onPage(page: number): void {
    this.loadByPage(page);
  }

  loadByPage(page = 0): void {
    console.log('触发loadByPage方法');
    const httpParams = new HttpParams().append('page', page.toString())
      .append('size', this.size.toString());
    this.httpClient.post<Page<User>>('/api/user', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('clazz组件接收到返回数据，重新设置pageData');
          this.pageData = pageData;
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
          this.httpClient.delete(`/api/user/delete/${id}`)
            .subscribe(() => {
                console.log('删除成功');
                this.sweetAlertService.showSuccess('删除成功', 'success');
                this.pageData.content.splice(index, 1);
                this.loadByPage();
              },
              error => {
                this.sweetAlertService.showError('删除失败', '请稍后再试。', 'error');
                console.log('删除失败', error);
              });
        }
      });
  }

  onSchoolSelected(schoolId: number) {
    this.searchParameters.school = schoolId;
  }

  openAddDialog(): void {
    this.dialog.open(AddComponent, {
      width: '1000px',
      height: '580px',
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    console.log(id);
    this.sharedService.setId(id);
    this.dialog.open(EditComponent, {
      width: '1000px',
      height: '580px',
    });
  }

  onSubmit(form: NgForm, page = 0) {
    console.log('调用了search');
    console.log(this.searchParameters);
    if (form.valid) {
      const clazz = this.sharedService.getSomeValue();
      this.searchParameters.school = clazz;
      const username = this.searchParameters.username;
      console.log(this.sharedService.getSomeValue());
      console.log('提交的查询参数:', this.searchParameters);
      const httpParams = new HttpParams().append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<User>>('/api/user', this.searchParameters, {params: httpParams}).subscribe(
        pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('clazz组件接收到查询返回数据，重新设置pageData');
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
          window.location.href = 'http://127.0.0.1:8088';
        },
        error => {
          console.error('注销失败', error);
        }
      );
    }, 1500);
  }
}
