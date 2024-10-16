import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Confirm} from 'notiflix';
import {Page} from '../entity/page';
import {School} from '../entity/school';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  school = {
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
  constructor(private httpClient: HttpClient) { }

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
    this.httpClient.get<Page<School>>('/api/school', {params: httpParams})
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
}
