import {Course} from './course';
import {User} from './user';

export class Lesson {
  id: number;
  course: Course;
  user: User;
  schoolId: number;
  clazzId: number;
  termId: number;

  constructor(data = {} as {
    id?: number;
    course?: Course;
    user?: User;
    schoolId?: number;
    clazzId?: number;
    termId?: number;
  }) {
    this.id = data.id as number;
    this.course = data.course as Course;
    this.user = data.user as User;
    this.schoolId = data.schoolId as number;
    this.clazzId = data.clazzId as number;
    this.termId = data.termId as number;
  }
}
