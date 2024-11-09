import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyService {

  constructor(private httpClient: HttpClient) { }

  getMyTable(week: number, userId: number, schoolId: number, termId: number): Observable<any> {
    const searchParameters = {
      school: schoolId,
      user: userId,
      term: termId,
      weekNumber: week
    };
    console.log(searchParameters);
    return this.httpClient.post(`/api/My/`, searchParameters);
  }
}
