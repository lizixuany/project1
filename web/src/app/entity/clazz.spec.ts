import {Clazz} from './clazz';

describe('Clazz', () => {
  it('should create an instance', () => {
    expect(new Clazz()).toBeTruthy();
    expect(new Clazz({id: 123})).toBeTruthy();
    expect(new Clazz({name: 'test'})).toBeTruthy();
  });
});
