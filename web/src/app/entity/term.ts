import {School} from './school';

export class Term {
  id: number;
  term: string;
  school: School;
  startTime: Date;
  endTime: Date;


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
    this.startTime = data.start_time as Date;
    this.endTime = data.end_time as Date;
  }
}
