import {School} from './school';
import {Expose} from 'class-transformer';

export class Term {
  id: number;
  name: string;
  school: School;
  @Expose({name: 'start_time'})
  startTime: Date;
  @Expose({name: 'end_time'})
  endTime: Date;

  constructor(data = {} as {
    id?: number;
    name?: string;
    school?: School;
    startTime?: Date;
    endTime?: Date;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.school = data.school as School;
    this.startTime = data.startTime as Date;
    this.endTime = data.endTime as Date;
  }
  // @ts-ignore
}
