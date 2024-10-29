import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Term} from '../../entity/term';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';

@Component({
  selector: 'app-term-select',
  templateUrl: './term-select.component.html',
  styleUrls: ['./term-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, multi: true,
      useExisting: forwardRef(() => {
        return TermSelectComponent;
      })
    }
  ]
})
export class TermSelectComponent implements OnInit, ControlValueAccessor {
  terms = new Array<Term>();
  termId = new FormControl();

  @Input()
  set id(id: number) {
    // 使用接收到的id设置termId
    this.termId.setValue(id);
    console.log(this.termId);
  }

  @Output()
  beChange = new EventEmitter<number>();

  constructor(private httpClient: HttpClient,
              private sharedService: SharedService) { }

  ngOnInit() {
    console.log('学期选择组件初始化');
    // 关注termId
    this.termId.valueChanges
      .subscribe((data: number) => {
          this.beChange.emit(data);
          this.sharedService.setSomeValue(data);
        }
      );
    // 获取所有学校
    this.httpClient.get<{ content: Term[] }>('api/term/')
      .subscribe(
        (response) => {
          this.terms = response.content;
        });
  }

  registerOnChange(fn: (data: number) => void): void {
    this.termId.valueChanges
      .subscribe(data => fn(data));
  }

  registerOnTouched(fn: any): void {
    console.warn('registerOnTouched尚未实现');
  }

  writeValue(obj: number): void {
    this.termId.setValue(obj);
  }
}
