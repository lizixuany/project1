import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Clazz} from '../../entity/clazz';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  /**
   * 班级名称.
   */
  nameFormControl = new FormControl('', Validators.required);

  school = {
    id: 1,
    name: '',
  };
  value = '';
  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
  });

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.loadById(+id);
  }

  /**
   * 由后台加载预编辑的班级.
   * @param id 班级id.
   */
  loadById(id: number): void {
    console.log('loadById');
    console.log(id);
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    console.log(this.school.name);
    this.httpClient.post<School>(`api/school/edit/${id}`, id)
      .subscribe(school => {
        console.log('接收到了clazz', school);
        this.school = school;
        this.nameFormControl.patchValue(school[0].name);
      }, error => console.log(error));
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.school[0].id);
    console.log(this.formGroup.value);
    const schoolId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const school = new Clazz({
      id: schoolId,
      name,
    });
    console.log(school);
    this.httpClient.put<Clazz>(`/api/school/update`, school)
      .subscribe(
        () => this.router.navigate(['/school'], {relativeTo: this.activatedRoute}),
        error => console.log(error));
  }
}
