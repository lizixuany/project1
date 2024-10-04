import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Assert } from '@yunzhi/ng-mock-api';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { School } from "../../../entity/school";
import { SchoolService } from "../../../service/school.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup;
  school: School;
  school_id: number | undefined;

  constructor(private activeRoute: ActivatedRoute,
              private httpClient: HttpClient,
              private router: Router,
              private schoolService: SchoolService,
              private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      console.log('路由参数发生了变化', params);
      this.school_id = +params.school_id;
      if (isNaN(this.school_id)) {
        console.error('接收到的id类型不正确');
        this.router.navigate(['/school']);
        return;
      }
      this.loadData(this.school_id);
    });
  }

  onSubmit(): void {
    const url = '/school/' + this.activeRoute.snapshot.params.school_id;
    this.httpClient.put(url, this.formGroup.value)
      .subscribe(data => {
          console.log('更新成功', data);
          this.router.navigate(['/school']);
        },
        error => {
          console.error('更新失败', error);
          alert('更新失败，请检查网络或联系管理员');
        });
  }

  /**
   * 根据ID加载学生信息
   */
  loadData(school_id: number): void {
    this.schoolService.getById(school_id)
      .subscribe(school => {
          this.formGroup.setValue({
            name: school.name
          });
        },
        error => {
          console.error('加载数据失败', error);
          alert('加载数据失败，请刷新页面重试');
        });
  }
}
