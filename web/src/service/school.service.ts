import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = 'api/school';

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }

  addSchool(school: any): Observable<any> {
    return this.httpClient.post(this.baseUrl, school);
  }
  //
  // getSchoolById(id: number): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/${id}`);
  // }

  // updateSchool(id: number, schoolData: any): Observable<any> {
  //   return this.httpClient.put(`${this.baseUrl}/${id}`, schoolData);
  // }

  deleteSchool(school_id: number): Observable<any> {
    console.log(school_id);
    return this.httpClient.delete(`${this.baseUrl}/delete/${school_id}`);
  }
}
