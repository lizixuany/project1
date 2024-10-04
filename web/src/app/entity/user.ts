/**
 * 用户
 */
export class User {
  id: number;
  username: string;
  password: string;
  sex: boolean;
  role: number;
  // tslint:disable-next-line:variable-name
  clazz_id: number;
  state: number;
  name: string;

  constructor(data = {} as {
    id?: number, username?: string, name?: string, password?: string, sex?: boolean, role: number, clazz_id: number, state: number}) {
    this.id = data.id as number;
    this.username = data.username as string;
    this.password = data.password as string;
    this.sex = data.sex as boolean;
    this.role = data.role as number;
    this.clazz_id = data.clazz_id as number;
    this.state = data.state as number;
    this.name = data.name as string;
  }
}
