import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Confirm} from 'notiflix';
import {Page} from '../entity/page';
import {School} from '../entity/school';
import {SharedService} from '../service/shared.service';
import {FormGroup, NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  searchParameters = {
    name: ''
  };

  // 默认显示第一条数据
  page = 0;
  // 每页默认三条
  size = 3;

  // 初始化一个有0条数据的
  pageData = new Page<School>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });
  constructor(private httpClient: HttpClient,
              private sharedService: SharedService,
              private dialog: MatDialog) { }

  form = new FormGroup({});

  ngOnInit() {
    console.log('school组件调用ngOnInit()');
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
    this.httpClient.post<Page<School>>('/api/school', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('school组件接收到返回数据，重新设置pageData');
          this.pageData = pageData;
          console.log(pageData);
        },
        error => {
          console.error('请求数据失败', error);
        }
      );
  }

  onDelete(index: number, id: number): void {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
      this.httpClient.delete(`/api/school/delete/${id}`)
        .subscribe(() => {
          console.log('删除成功');
          this.pageData.content.splice(index, 1);
        },
          error => console.log('删除失败', error));
    });
  }

  openAddDialog(): void {
    this.dialog.open(AddComponent, {
      width: '900px',
      height: '300px',
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    console.log(id);
    this.sharedService.setId(id);
    this.dialog.open(EditComponent, {
      width: '900px',
      height: '300px',
    });
  }

  onSubmit(form: NgForm, page = 0) {
    console.log('调用了search');
    if (form.valid) {
      console.log('提交的查询参数:', this.searchParameters);
      const httpParams = new HttpParams().append('page', this.page.toString())
        .append('size', this.size.toString());
      this.httpClient.post<Page<School>>('/api/school', this.searchParameters, {params: httpParams}).subscribe(
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
}
