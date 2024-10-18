import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Assert} from '@yunzhi/ng-mock-api';
import {ActivatedRoute, Router} from '@angular/router';
import {TermService} from '../../service/term.service';
import {School} from '../../entity/school';
import {HttpClient} from '@angular/common/http';
import {Term} from '../../entity/term';
import {YzAsyncValidators} from '../../yz-async-validators';
import {YzValidators} from '../../yz-validators';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup;
  id: number | undefined;

  constructor(private yzAsyncValidators: YzAsyncValidators,
              private activatedRoute: ActivatedRoute,
              private termService: TermService,
              private router: Router) {
    console.log(this.activatedRoute);
    this.formGroup = new FormGroup({
      term: new FormControl('', Validators.required),
      start_time: new FormControl(Date),
      end_time: new FormControl(Date),
      schoolId: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.id = +this.activatedRoute.snapshot.params.id;
    Assert.isNumber(this.id, '接收到的id类型不正确');
    this.loadData(this.id);
  }

  /**
   * 更新
   * @param id id
   * @param formGroup 表单组
   */
  onSubmit(id: number | undefined, formGroup: FormGroup): void {
    const formValue = formGroup.value as { term: string, start_time: Date, end_time: Date, schoolId: number };
    // Assert.isString(formValue.name, formValue.phone, formValue.email, '类型必须为字符串');
    // Assert.isNumber(formValue.clazzId, '类型必须为number');
    // Assert.isNumber(id, 'id类型必须为number');
    this.termService.update(id as number, {
      term: formValue.term,
      start_time: formValue.start_time,
      end_time: formValue.end_time,
      school: {id: formValue.schoolId}
    }).subscribe(() => {
      this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
    });
  }

  /**
   * 根据ID加载学期信息
   * @param id 学期ID
   */
  loadData(id: number): void {
    this.termService.getById(id)
      .subscribe(term => {
        this.formGroup.setValue({
          term: term.term,
          start_time: term.start_time,
          end_time: term.end_time,
          schoolId: term.school.id
        });
      });
  }
}
