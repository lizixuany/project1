import { Component, OnInit } from '@angular/core';
import { SchoolService} from "../../service/school.service";
import { HttpClient } from '@angular/common/http';
import { Confirm } from 'notiflix';
import {Router} from "@angular/router";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  school = {
    name: ''
  };
  // 定义学校数组
  schools: any[];

  constructor(private schoolService: SchoolService,
              private httpClient: HttpClient,
              private router: Router) { }

  ngOnInit() {
    this.fetchSchools();
  }

  fetchSchools() {
    this.schoolService.getList().subscribe(
      (data) => {
        this.schools = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  onDelete(index: number, school_id: number): void {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
      this.httpClient.delete(`/api/school/delete/${school_id}`)
        .subscribe(() => {
          console.log('删除成功');
          this.schools.splice(index, 1);
        },
          error => console.log('删除失败', error));
    });
  }
}
