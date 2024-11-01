import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CourseScheduleService} from '../service/course-schedule.service';

@Component({
  selector: 'app-course-schedule',
  templateUrl: './course-schedule.component.html',
  styleUrls: ['./course-schedule.component.css']
})
export class CourseScheduleComponent implements OnInit {
  courseTable: any[][] = []; // 确保已经初始化

  weeks: number[] = Array.from({ length: 20 }, (_, i) => i + 1);
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
    clazz: null as unknown as number,
    term: null as unknown as number,
    week: null as unknown as number
  };

  constructor(private courseScheduleService: CourseScheduleService,
              private httpClient: HttpClient) {}

  ngOnInit() {
  }

  onSearchSubmit(form: NgForm) {
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
}
