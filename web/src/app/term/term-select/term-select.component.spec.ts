import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermSelectComponent } from './term-select.component';

describe('TermSelectComponent', () => {
  let component: TermSelectComponent;
  let fixture: ComponentFixture<TermSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
