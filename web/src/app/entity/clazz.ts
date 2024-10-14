import {School} from './school';

export class Clazz {
  // tslint:disable-next-line:variable-name
  clazz_id: number;
  name: string;
  school: School;

  constructor(data = {} as {
    clazz_id?: number;
    name?: string;
    school?: School;
  }) {
    this.clazz_id = data.clazz_id as number;
    this.name = data.name as string;
    this.school = data.school as School;
  }
}
