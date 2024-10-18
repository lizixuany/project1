import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {School} from '../../entity/school';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-school-select',
  templateUrl: './school-select.component.html',
  styleUrls: ['./school-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return SchoolSelectComponent;
      })
    }
  ]
})
export class SchoolSelectComponent implements OnInit, ControlValueAccessor {
  schools = new Array<School>();
  schoolId = new FormControl();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // 获取所有学校
    this.httpClient.get<{ content: School[] }>('api/school/')
      .subscribe(
        (response) => {
          this.schools = response.content;
        });
  }

  registerOnChange(fn: (data: number) => void): void {
    this.schoolId.valueChanges
      .subscribe(schoolId => fn(schoolId));
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched尚未实现');
  }

  writeValue(obj: number): void {
    this.schoolId.setValue(obj);
  }
}
