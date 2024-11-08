import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Lesson} from '../entity/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private httpClient: HttpClient) { }

  addLesson(courseId: number, userId: number): Observable<Array<Lesson>> {
    return this.httpClient.get<Array<Lesson>>(`/api/lesson/addLesson?courseId=${courseId}&&userId=${userId}`);
  }
}
