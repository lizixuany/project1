import {User} from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User({
      id: 1,
      username: 'username',
      password: 'password',
      sex: true,
      role: 1,
      clazz_id: 1,
      state: 1
    })).toBeTruthy();
  });
});
