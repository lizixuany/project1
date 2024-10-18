import {Component, OnInit, EventEmitter, Output, Input, forwardRef} from '@angular/core';
import {School} from '../../entity/school';
import {HttpClient} from '@angular/common/http';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SharedService} from '../../service/shared.service';

@Component({
  selector: 'app-klass-select',
  templateUrl: './klass-select.component.html',
  styleUrls: ['./klass-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        console.log('useExisting->forwardRef中的回调方法被调用一次');
        return KlassSelectComponent;
      })
    }
  ]
})
export class KlassSelectComponent implements OnInit, ControlValueAccessor {
  schools = new Array<School>();
  schoolId = new FormControl();
  // private schools: Array<School>;

  @Input()
  set id(id: number) {
    // 使用接收到的id设置schoolId
    this.schoolId.setValue(id);
    console.log(this.schoolId);
  }

  @Output()
  beChange = new EventEmitter<number>();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService) {
  }

  /**
   * 将FormControl中的值通过此方法写入
   * FormControl的值每变换一次，该方法将被重新执行一次
   * 相当于@Input() set xxx
   * @param obj 此类型取决于当前组件的接收类型，比如此时我们接收一个类型为number的schoolId
   */
  writeValue(obj: number): void {
    console.log('writeValue is called');
    this.schoolId.setValue(obj);
  }

  /**
   * 组件需要向父组件弹值时，直接调用参数中的fn方法
   * 相当于@Output()
   * @param fn 此类型取决于当前组件的弹出值类型，比如我们当前将弹出一个类型为number的schoolId
   */
  registerOnChange(fn: (data: number) => void): void {
    console.log(`registerOnChange is called`);
    this.schoolId.valueChanges
      .subscribe(data => fn(data));
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched not implemented');
  }

  ngOnInit(): void {
    console.log('教师选择组件初始化');
    // 关注schoolId
    this.schoolId.valueChanges
      .subscribe((data: number) => {
          this.beChange.emit(data);
          this.sharedService.setSomeValue(data);
        }
      );
    // 获取所有学校
    this.httpClient.get<Array<School>>('api/school')
      .subscribe(
        schools => {
          this.schools = schools;
          console.log(this.schools);
          console.log('教师选择组件接收到了数据');
        });
  }
}
