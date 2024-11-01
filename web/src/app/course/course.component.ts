import {Component, OnInit} from '@angular/core';
import {Page} from '../entity/page';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from '../entity/course';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from './add/add.component';
import {Confirm} from 'notiflix';
import {EditComponent} from './edit/edit.component';
import {SharedService} from '../service/shared.service';
import {NgForm} from '@angular/forms';
import {CourseService} from '../service/course.service';
import {SweetAlertService} from '../service/sweet-alert.service';

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

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private sweetAlertService: SweetAlertService,
              private courseService: CourseService) { }

  ngOnInit() {
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

  loadByPage(page = 0): void {
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
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.httpClient.delete(`/api/course/delete/${id}`)
          .subscribe(() => {
              console.log('删除成功');
              this.sweetAlertService.showSuccess('删除成功', 'success');
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

}
