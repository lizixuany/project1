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
  // clazz: Clazz = new Clazz();
  // clazz = {
  //   clazz_id: null as unknown as number,
  //   name: '',
  //   school_id: null as unknown as number
  // };

 clazz = {
    clazz_id: 1,
    name: '',
    school: {
      school_id: 1,
      name: ''
    }
  };
  value = '';
  School = new Array<School>();
  /**
   * 表单组，用于存放多个formControl
   */
  formGroup = new FormGroup({
    id: new FormControl(null, Validators.required),
    name: this.nameFormControl,
    school_id: new FormControl(null, Validators.required)
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
    this.formGroup.get('id').setValue(id);
    console.log(this.formGroup.value);
    console.log(this.clazz.name);
    this.httpClient.post<Clazz>('api/clazz/edit/', id)
      .subscribe(clazz => {
        console.log('接收到了clazz', clazz);
        this.nameFormControl.patchValue(clazz[0].name);
        this.formGroup.get('school_id').setValue(clazz[0].school_id);
      }, error => console.log(error));
  }

  onSchoolChange($event: number): void {
    console.log('接收到了选择的teacherId', $event);
    this.formGroup.get('school_id').setValue($event);
  }

  onSubmit(): void {
    console.log('点击了提交按钮');
    console.log(this.clazz[0].clazz_id);
    console.log(this.formGroup.value);
    const clazzId = this.formGroup.get('id').value;
    const name = this.nameFormControl.value;
    const schooId = this.formGroup.get('school_id').value;
    const clazz = new Clazz({

      clazz_id: clazzId,
      name,
      school: new School({school_id: schooId})
    });
    console.log(clazz);
    this.httpClient.put<Clazz>(`/api/clazz/updata`, clazz)
      .subscribe(
        () => this.router.navigate(['../../'], {relativeTo: this.activatedRoute}),
        error => console.log(error));
  }

  get school_id() {
    console.log('school_id');
    return this.formGroup.get('school_id');
  }
}
