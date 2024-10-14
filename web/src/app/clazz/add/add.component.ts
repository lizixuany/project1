import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {School} from '../../entity/school';
import {Clazz} from '../../entity/clazz';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  private url = 'api/clazz/add';
  clazz = {
    name: '',
    school_id: null as unknown as number
  };
  value = '';
  schools = new Array<School>();

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    // 获取所有教师
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(schools => this.schools = schools);
  }

  onSubmit(): void {
    const newClazz = new Clazz({
      name: this.clazz.name,
      school: new School({school_id: this.clazz.school_id})
    });
    console.log(newClazz);
    this.httpClient.post(this.url, newClazz)
      .subscribe(clazz => this.router.navigateByUrl('/api/clazz/add'),
        error => console.log('保存失败', error));
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    console.log('school_id', school_id);
    this.clazz.school_id = school_id;
  }
}
