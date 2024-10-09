import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = 'api/term';

  constructor(private httpClient: HttpClient) { }

  getTerms(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }
}
