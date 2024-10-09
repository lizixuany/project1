import { YzValidators } from './yz-validators';
import {FormControl} from '@angular/forms';

describe('YzValidators', () => {
  it('should create an instance', () => {
    expect(new YzValidators()).toBeTruthy();
    // 空手机号，返回非null
    const formControl = new FormControl('');
    expect(YzValidators.phone(formControl)).toBeTruthy();

    // 正常的手机号，返回null
    formControl.setValue('13900000000');
    expect(YzValidators.phone(formControl)).toBeNull();

    // 以2打头，返回非null
    formControl.setValue('23900000000');
    expect(YzValidators.phone(formControl)).toBeTruthy();

    // 不足11位，返回非null
    formControl.setValue('1390000000');
    expect(YzValidators.phone(formControl)).toBeTruthy();
  });

  it('JSON对象与对象', () => {
    class A {
      a: string;

      constructor(a: string) {
        this.a = a;
      }

      getA(): string {
        return this.a;
      }
    }
    const a1 = new A('123');
    console.log('对象;', a1);
    console.log(a1.getA());

    const a2 = {a: '123'} as A;
    console.log('JSON对象:', a2);
    let catchException = false;
    try {
      console.log(a2.getA());
    } catch (e) {
      catchException = true;
    }
    // expect(catchException).toBeTrue();
  });
});
