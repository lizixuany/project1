import {Component, OnInit} from '@angular/core';
import {User} from '../entity/user';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../service/shared.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  me = new User();
  user: User = new User();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService) {
    this.user = this.sharedService.getData();
  }

  ngOnInit(): void {
    console.log(new Date().toTimeString(), '子组件进行了数据弹射', this.user);
    console.log('请求当前登录用户成功');
    this.me = this.user;
    console.log(this.me);
    console.log(this.user.name);
  }
}
