import {Clazz} from './clazz';
import {School} from './school';

/**
 * 用户
 */
export class User {
  id: number;
  username: string;
  password: string;
  sex: number;
  role: number;
  // tslint:disable-next-line:variable-name
  clazz: Clazz;
  school: School;
  state: number;
  name: string;

  constructor(data = {} as {
    id?: number,
    username?: string,
    name?: string,
    password?: string,
    sex?: number,
    role: number,
    clazz: Clazz,
    school: School,
    state: number
  }) {
    this.id = data.id as number;
    this.username = data.username as string;
    this.password = data.password as string;
    this.sex = data.sex as number;
    this.role = data.role as number;
    this.clazz = data.clazz as Clazz;
    this.school = data.school as School;
    this.state = data.state as number;
    this.name = data.name as string;
  }
}
