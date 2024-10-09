import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {School} from '../../entity/school';
import {Clazz} from '../../entity/clazz';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  private url = 'clazz';
  clazz = {
    name: '',
    school_id: null as unknown as number
  };

  schools = new Array<School>();

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    // 获取所有教师
    this.httpClient.get<Array<School>>('school')
      .subscribe(schools => this.schools = schools);
  }

  onSubmit(): void {
    const newClazz = new Clazz({
      name: this.clazz.name,
      school: new School({id: this.clazz.school_id})
    });
    this.httpClient.post(this.url, newClazz)
      .subscribe(clazz => this.router.navigateByUrl('/clazz'),
        error => console.log('保存失败', error));
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    this.clazz.school_id = school_id;
  }
}
