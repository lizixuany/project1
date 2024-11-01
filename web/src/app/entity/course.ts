import {Clazz} from './clazz';
import {Term} from './term';
import {School} from './school';

export class Course {
  id: number;
  name: string;
  sory: number;
  clazz: Clazz;
  term: Term;
  school: School;
  week: number[];
  day: number;
  period: number;


  constructor(data = {} as {
    id?: number;
    name?: string;
    clazz?: Clazz;
    term?: Term;
    sory?: number;
    school?: School;
    week?: number[];
    day?: number;
    period?: number;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.clazz = data.clazz as Clazz;
    this.sory = data.sory as number;
    this.term = data.term as Term;
    this.school = data.school as School;
    this.week = data.week as number[];
    this.day = data.day as number;
    this.period = data.period as number;
  }
}
