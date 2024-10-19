import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SchoolService} from '../../service/school.service';
import {School} from '../../entity/school';
import {FormGroup, FormControl} from '@angular/forms';
import {Clazz} from '../../entity/clazz';
import {Term} from '../../entity/term';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  schools: School[] = [];
  term = {
    name: '',
    start_time: new Date(),
    end_time: new Date(),
    school_id: null as unknown as number
  };
  formGroup: FormGroup;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private schoolService: SchoolService) {
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      start_time: new FormControl(''),
      end_time: new FormControl(Date),
      school_id: new FormControl(Date)
    });
  }

  ngOnInit() {
    console.log(this.term);
    this.getSchools();
  }

  // 获取学校列表
  getSchools() {
    this.schoolService.getList().subscribe(
      (data) => {
        this.schools = data;
      },
      (error) => {
        console.log('Error fetching schools', error);
      }
    );
  }

  onSubmit() {
    const newTerm = new Term({
      name: this.term.name,
      start_time: this.term.start_time,
      end_time: this.term.end_time,
      school: new School({id: this.term.school_id})
    });
    console.log(newTerm);
    this.httpClient.post('/api/term/add', newTerm)
      .subscribe(clazz => this.router.navigateByUrl('/clazz'),
        error => console.log('保存失败', error));
  }

  // tslint:disable-next-line:variable-name
  onSchoolChange(school_id: number): void {
    console.log('school_id', school_id);
    this.term.school_id = school_id;
  }
}
