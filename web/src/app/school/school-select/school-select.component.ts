import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {School} from '../../entity/school';
import {HttpClient} from '@angular/common/http';
import {SharedService} from "../../service/shared.service";

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

  @Input()
  set id(id: number) {
    // 使用接收到的id设置schoolId
    this.schoolId.setValue(id);
    console.log(this.schoolId);
  }

  @Output()
  beChange = new EventEmitter<number>();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService) { }

  ngOnInit() {
    console.log('学校选择组件初始化');
    // 关注schoolId
    this.schoolId.valueChanges
      .subscribe((data: number) => {
          this.beChange.emit(data);
          this.sharedService.setSomeValue(data);
        }
      );
    // 获取所有学校
    this.httpClient.get<{ content: School[] }>('api/school/')
      .subscribe(
        (response) => {
          this.schools = response.content;
        });
  }

  registerOnChange(fn: (data: number) => void): void {
    this.schoolId.valueChanges
      .subscribe(data => fn(data));
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched尚未实现');
  }

  writeValue(obj: number): void {
    this.schoolId.setValue(obj);
  }
}
