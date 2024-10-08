import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolComponent } from './school.component';
import {AppComponent} from '../app.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms'; // 导入 ReactiveFormsModule
import {SchoolService} from "../service/school.service";

describe('SchoolComponent', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule, // 添加 ReactiveFormsModule
          RouterTestingModule,
          HttpClientModule
        ],
        declarations: [
          AppComponent,
          SchoolComponent
        ],
      }).compileComponents();
    });

    fit('should create', () => {
      // 创建组建并解析V层代码
      const fixture = TestBed.createComponent(SchoolComponent);
      const app = fixture.componentInstance;

      // 当组件成功初始化时，以下语句正常执行；失败时，以下语句将报一个异常
      expect(SchoolComponent).toBeTruthy();

      // 启动angular的自动变更检测机制，自动对v层中的数据进行渲染
      fixture.autoDetectChanges();
    });
});
