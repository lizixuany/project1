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

  getTerms(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }

  /**
   * 获取学期
   * @param id 学期ID
   */
  getById(id: number): Observable<Term> {
    return this.httpClient.get<Term>('/api/term/edit/' + id.toString());
  }

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
}
