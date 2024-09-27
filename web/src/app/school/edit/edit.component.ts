import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute,
              private httpClient: HttpClient) { }

  ngOnInit() {
    const school_id = this.activeRoute.snapshot.params.school_id;
    console.log('获取到的路由参数school_id值为', school_id);

    // 拼接请求的URL
    const url = "api/school/edit/" + school_id;
    // 发起请求，成功时并打印结果，失败时打印失败结果
    this.httpClient.get(url)
      .subscribe(data => console.log('成功', data),
      error => console.log('失败', error)
      );
  }

}
