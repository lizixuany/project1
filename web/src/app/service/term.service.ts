import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Term} from '../entity/term';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = 'api/term';

  constructor(private httpClient: HttpClient) { }


  /**
   * 更新学期
   * @param id 学期ID
   * @param term 学期信息
   */
  update(id: number, term: {
    start_time: Date;
    school: { id: number };
    end_time: Date;
    term: string
  }): Observable<Term> {
    return this.httpClient.put<Term>(`/api/term//update/${id}`, term);
  }

  getTerms(): Observable<Term[]> {
    return this.httpClient.get<Term[]>(`/api/term/getTerms`);
  }
  getCurrentTerm(schoolId: number): any {
    return this.httpClient.get<any>(`/api/term/getCurrentTerm/?schoolId=${schoolId}`);
  }
}
