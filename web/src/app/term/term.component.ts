import {Component, OnInit} from '@angular/core';
import {Confirm} from 'notiflix';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Term} from '../entity/term';
import {FormGroup, NgForm} from '@angular/forms';
import {SharedService} from '../service/shared.service';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 默认显示第一条数据
  page = 0;
  // 每页默认三条
  size = 5;

  // 初始化一个有0条数据的
  pageData = new Page<Term>({
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

  form = new FormGroup({});

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService,
              private dialog: MatDialog) { }

  ngOnInit() {
    console.log('term组件调用ngOnInit()');
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
    this.httpClient.post<Page<Term>>('/api/term', this.searchParameters, {params: httpParams})
      .subscribe(pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('term组件接收到返回数据，重新设置pageData');
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
        this.httpClient.delete(`/api/term/delete/${id}`)
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
      height: '455px',
    });
  }

  openEditDialog(id: number): void {
    console.log('edit dialog');
    console.log(id);
    this.sharedService.setId(id);
    this.dialog.open(EditComponent, {
      width: '900px',
      height: '400px',
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
      this.httpClient.post<Page<Term>>('/api/clazz', this.searchParameters, {params: httpParams}).subscribe(
        pageData => {
          // 在请求数据之后设置当前页
          this.page = page;
          console.log('term组件接收到查询返回数据，重新设置pageData');
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
