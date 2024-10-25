import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Clazz} from '../../entity/clazz';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {School} from '../../entity/school';
import {ClazzService} from '../../service/clazz.service';

@Component({
  selector: 'app-clazz-select',
  templateUrl: './clazz-select.component.html',
  styleUrls: ['./clazz-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return ClazzSelectComponent;
      })
    }
  ]
})
export class ClazzSelectComponent implements OnInit, ControlValueAccessor {
  clazzs = new Array<Clazz>();

  clazzId = new FormControl();

  @Input()
  set id(id: number) {
    // 使用接收到的id设置clazzId
    this.clazzId.setValue(id);
    console.log(this.clazzId);
  }

  @Output()
  beChange = new EventEmitter<number>();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService,
              private clazzService: ClazzService) {
  }

  ngOnInit(): void {
    // 获取所有班级
    console.log('班级选择组件初始化');
    // 关注clazzId
    this.clazzId.valueChanges
      .subscribe((data: number) => {
          this.beChange.emit(data);
          this.sharedService.setSomeValue(data);
        }
      );
    // 获取所有班级
    this.httpClient.get<{ content: Clazz[] }>('api/clazz/')
      .subscribe(
        (response) => {
          this.clazzs = response.content;
          console.log(this.clazzs);
          this.clazzService.setClazzes(this.clazzs);
        });
  }

  registerOnChange(fn: (data: number) => void): void {
    this.clazzId.valueChanges
      .subscribe(clazzId => fn(clazzId));
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched尚未实现');
  }

  writeValue(obj: number): void {
    this.clazzId.setValue(obj);
  }
}
