import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditComponent} from './edit.component';
import {SchoolSelectComponent} from '../../school/school-select/school-select.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute} from '@angular/router';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponent, SchoolSelectComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    // const activatedRoute = TestBed.inject(ActivatedRoute);
    // activatedRoute.snapshot.params.id = 123;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // 在该代码前进行了组件初始化，模拟请求了教师列表数据。
    // 此代码将返回还未响应的所有请求，包含：教师列表数据;

    component.loadById(123);
    // loadByIdy方法中触发了请求123班级数据
    // 此代码将返回还未响应的所有请求，包含：请求ID为123的班级数据

    // 最后启动变更检测，则formControl也会被重新渲染
    fixture.autoDetectChanges();
  });
});
