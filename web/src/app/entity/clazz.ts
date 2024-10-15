import {School} from './school';

export class Clazz {
  // tslint:disable-next-line:variable-name
  id: number;
  name: string;
  school: School;

  constructor(data = {} as {
    id?: number;
    name?: string;
    school?: School;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.school = data.school as School;
  }
}
