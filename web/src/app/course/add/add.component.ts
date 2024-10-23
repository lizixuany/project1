import {Component, Inject, OnInit} from '@angular/core';
import {School} from '../../entity/school';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Clazz} from '../../entity/clazz';
import {Term} from '../../entity/term';
import {Course} from '../../entity/course';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  private url = 'api/course/add';
  course = {
    name: '',
    week: '',
    school_id: null as unknown as number,
    clazz_id: null as unknown as number,
    term_id: null as unknown as number
  };
  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  clazzes = new Array<Clazz>();

  constructor(private httpClient: HttpClient,
              private router: Router,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    // 获取所有学校
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(schools => this.schools = schools);
    // 获取所有班级
    this.httpClient.get<Array<Clazz>>('api/clazz')
      .subscribe(clazzes => this.clazzes = clazzes);
    // 获取所有学期
    this.httpClient.get<Array<Term>>('api/term')
      .subscribe(terms => this.terms = terms);
  }

  onSubmit(): void {
    const newCourse = new Course({
      name: this.course.name,
      week: this.course.week,
      school: new School({id: this.course.school_id}),
      clazz: new Clazz({id: this.course.clazz_id}),
      term: new Term({id: this.course.term_id})
    });
    console.log(newCourse);
    this.httpClient.post(this.url, newCourse)
      .subscribe(clazz => this.dialogRef.close(newCourse),
        error => console.log('保存失败', error));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    console.log('school_id', school_id);
    this.course.school_id = school_id;
  }
  // tslint:disable-next-line:variable-name
  onClazzChange(clazz_id: number): void {
    console.log('clazz_id', clazz_id);
    this.course.clazz_id = clazz_id;
  }// tslint:disable-next-line:variable-name
  onTermChange(term_id: number): void {
    console.log('term_id', term_id);
    this.course.term_id = term_id;
  }
}
