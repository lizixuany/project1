import {Clazz} from './clazz';
import {Term} from './term';
import {School} from './school';

export class Course {
  id: number;
  name: string;
  clazz: Clazz;
  term: Term;
  school: School;
  week: string;


  constructor(data = {} as {
    id?: number;
    name?: string;
    clazz?: Clazz;
    term?: Term;
    school?: School;
    week?: string;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.clazz = data.clazz as Clazz;
    this.term = data.term as Term;
    this.school = data.school as School;
    this.week = data.week as string;
  }
}
