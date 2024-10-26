import {Component, Inject, OnInit} from '@angular/core';
import {School} from '../../entity/school';
import {Term} from '../../entity/term';
import {Clazz} from '../../entity/clazz';
import {HttpClient} from '@angular/common/http';
import {Course} from '../../entity/course';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SchoolService} from '../../service/school.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  private url = 'api/course/add';
  course = {
    name: '',
    school_id: null as unknown as number,
    term_id: null as unknown as number,
    clazz_id: null as unknown as number,
    week: ''
  };
  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  clazzes = new Array<Clazz>();

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private schoolService: SchoolService) { }

  ngOnInit() {
    // 获取所有学校
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(schools => this.schools = schools);
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

  getClazzBySchoolId(schoolId: number) {
    this.httpClient.get<Array<Clazz>>(`api/course/getClazzBySchoolId?schoolId=${schoolId}`)
      .subscribe(clazzes => {
        this.clazzes = clazzes;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getTermsBySchoolId(schoolId: number) {
    this.httpClient.get<Term[]>(`api/course/getTermsBySchoolId?schoolId=${schoolId}`)
      .subscribe(terms => {
        this.terms = terms;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  onSchoolChange(schoolId: number) {
    this.course.school_id = schoolId;
    console.log(this.course.school_id);
    this.getClazzBySchoolId(this.course.school_id);
    this.getTermsBySchoolId(this.course.school_id);
  }

  onClazzChange(clazzId: number) {
    this.course.clazz_id = clazzId;
  }

  onTermChange(termId: number) {
    this.course.term_id = termId;
  }
}
