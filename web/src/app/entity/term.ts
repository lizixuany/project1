import {School} from './school';

export class Term {
  id: number;
  term: string;
  school: School;
  // tslint:disable-next-line:variable-name
  start_time: Date;
  // tslint:disable-next-line:variable-name
  end_time: Date;


  constructor(data = {} as {
    id?: number;
    term?: string;
    school?: School;
    start_time?: Date;
    end_time?: Date;
  }) {
    this.id = data.id as number;
    this.term = data.term as string;
    this.school = data.school as School;
    this.start_time = data.start_time as Date;
    this.end_time = data.end_time as Date;
  }
}
