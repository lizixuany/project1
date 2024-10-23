import {Component, OnInit} from '@angular/core';
import {Page} from '../entity/page';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from '../entity/course';
import {Confirm} from 'notiflix';
import {AddComponent} from './add/add.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  // 默认显示第一条数据
  page = 0;
  // 每页默认三条
  size = 3;
  // 初始化一个有0条数据的

  pageData = new Page<Course>({
    content: [],
    number: this.page,
    size: this.size,
    numberOfElements: 0
  });
  constructor(private httpClient: HttpClient,
              private dialog: MatDialog) { }

  ngOnInit() {
    console.log('学期组件调用ngOnInit()');
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
    this.httpClient.get<Page<Course>>('/api/course', {params: httpParams})
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
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.httpClient.delete(`/api/course/delete/${id}`)
          .subscribe(() => {
              console.log('删除成功');
              this.pageData.content.splice(index, 1);
            },
            error => console.log('删除失败', error));
      });
  }

  openAddDialog(): void {
    this.dialog.open(AddComponent, {
      width: '1000px',
      height: '370px',
    });
  }

}
