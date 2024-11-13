import {Course} from './course';
import {User} from './user';

export class Lesson {
  id: number;
  course: Course;
  user: User;
  termName: string;

  constructor(data = {} as {
    id?: number;
    course?: Course;
    user?: User;
    termName: string;
  }) {
    this.id = data.id as number;
    this.course = data.course as Course;
    this.user = data.user as User;
    this.termName = data.termName as string;
  }
}
