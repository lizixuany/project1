import {Component, EventEmitter, OnInit} from '@angular/core';
import {Page} from '../entity/page';
import {Clazz} from '../entity/clazz';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormGroup, NgForm} from '@angular/forms';
import {SharedService} from '../service/shared.service';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {SweetAlertService} from '../service/sweet-alert.service';
import {LoginService} from '../service/login.service';
import {User} from '../entity/user';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  // 默认显示第1页的内容
  page = 0;

  // 每页默认为5条
  size = 5;

  // 初始化一个有0条数据的
  pageData = new Page<Clazz>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });

  searchParameters = {
    school: null as unknown as number,
    name: ''
  };
  school: any;

  me = new User();
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
    const sessionRole = window.sessionStorage.getItem('role');
    if (sessionRole !== 'true') {
      window.location.href = 'http://127.0.0.1:8088/';
      this.sweetAlertService.showError('无权限', '', '');
    }
    console.log('clazz组件调用ngOnInit()');
    // 使用默认值 page = 0 调用loadByPage()方法
    this.loadByPage();
  }

  onPage(page: number): void {
    this.loadByPage(page);
  }

  loadByPage(page = 0): void {
    console.log('触发loadByPage方法');
    const httpParams = new HttpParams().append('page', page.toString())
      .append('size', this.size.toString());
    this.httpClient.post<Page<Clazz>>('/api/clazz', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('clazz组件接收到返回数据，重新设置pageData');
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
          this.httpClient.delete(`/api/clazz/delete/${id}`)
            .subscribe(() => {
                console.log('删除成功');
                this.sweetAlertService.showSuccess('删除成功', 'success');
                this.pageData.content.splice(index, 1);
                this.loadByPage();
              },
              error => {
                if (error.error.error === '该班级仍有用户未清空') {
                  this.sweetAlertService.showError('删除失败', '该班级仍有用户未清空', '');
                } else {
                  this.sweetAlertService.showError('删除失败', '请稍后再试。', 'error');
                  console.log('删除失败', error);
                }
              });
        }
      });
  }

  openAddDialog(): void {
    this.dialog.open(AddComponent, {
      width: '1000px',
      height: '370px',
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    this.sharedService.setId(id);
    this.dialog.open(EditComponent, {
      width: '1000px',
      height: '370px',
    });
  }

  onSubmit(form: NgForm, page = 0) {
    console.log('调用了search');
    if (form.valid) {
      const school = this.sharedService.getSomeValue();
      this.searchParameters.school = school;
      const name = this.searchParameters.name;
      console.log(this.sharedService.getSomeValue());
      console.log('提交的查询参数:', this.searchParameters);
      const httpParams = new HttpParams().append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<Clazz>>('/api/clazz', this.searchParameters, {params: httpParams}).subscribe(
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
