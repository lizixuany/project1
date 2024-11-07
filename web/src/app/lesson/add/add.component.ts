import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {CourseService} from '../../service/course.service';
import {Term} from '../../entity/term';
import {LoginService} from '../../service/login.service';
import {SharedService} from '../../service/shared.service';
import {User} from '../../entity/user';
import {Course} from '../../entity/course';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  terms = new Array<Term>();
  courses = new Array<Course>();
  me = new User();
  clazzId: number;
  beLogout = new EventEmitter<void>();

  lesson = {
    user_id: null,
    term_id: null as unknown as number,
    sory: null,
    course_id: null as unknown as number,
  };

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<AddComponent>,
              private sweetAlertService: SweetAlertService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private courseService: CourseService,
              private loginService: LoginService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.loginService.getCurrentUser().subscribe(
      user => {
        this.me = user;
        this.lesson.user_id = user.id;
        this.clazzId = user.clazz_id;
        this.getTermsBySchoolId(user.school_id);
        this.sharedService.setData(user);
      },
      error => {
        if (error.error.error === '无效的token') {
          this.handleInvalidToken();
        }
      }
    );
  }

  onSubmit(): void {
    const newLesson = {
      term_id: this.lesson.term_id,
      sory: this.lesson.sory,
      course_id: this.lesson.course_id,
      user_id: this.lesson.user_id,
    };
    console.log(newLesson.sory);
    console.log(newLesson);
    this.httpClient.post('/api/lesson/add/', newLesson)
      .subscribe(lesson => {
          this.dialogRef.close(newLesson);
          this.sweetAlertService.showSuccess('新增成功！', 'success');
          window.location.href = 'http://127.0.0.1:8088/lesson';
        },
        error => {
          if (error.error.error === '课程已存在') {
            this.sweetAlertService.showError('新增失败', '课程已存在', '');
          } else {
            this.sweetAlertService.showError('新增失败', '', '');
          }
          console.log('保存失败', error);
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTermsBySchoolId(schoolId: number) {
    this.courseService.getTermsBySchoolId(schoolId)
      .subscribe(terms => {
        this.terms = terms;
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  onTermChange(termId: number) {
    this.lesson.term_id = termId;
    console.log(this.lesson.term_id);
    this.getCoursesByTermIdWithoutClazzId(this.lesson.term_id);
  }

  getCoursesByTermId(termId: number) {
    this.courseService.getCoursesByTermId(termId)
      .subscribe(courses => {
        this.courses = courses;
      }, error => {
        console.error('获取课程失败', error);
      });
  }

  getCoursesByTermIdWithClazzId(termId: number, clazzId: number) {
    this.courseService.getCoursesByTermIdWithClazzId(termId, clazzId)
      .subscribe(courses => {
        this.courses = courses;
      }, error => {
        console.error('获取课程失败', error);
      });
  }

  getCoursesByTermIdWithoutClazzId(termId: number) {
      this.courseService.getCoursesByTermIdWithoutClazzId(termId)
        .subscribe(courses => {
          this.courses = courses;
        }, error => {
          console.error('获取课程失败', error);
        });
    }

  private handleInvalidToken(): void {
    this.sweetAlertService.showLogoutWarning('登录失效', '');
    setTimeout(() => {
      window.sessionStorage.removeItem('login');
      this.httpClient.post('/api/Login/logout', {}).subscribe(
        () => {
          console.log('logout');
          this.beLogout.emit();
          window.location.href = 'http://127.0.0.1:8088';
        },
        error => {
          console.error('注销失败', error);
        }
      );
    }, 1500);
  }
}
