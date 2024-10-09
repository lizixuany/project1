import {Component, OnInit} from '@angular/core';
import {TermService} from '../service/term.service';
import {Confirm} from 'notiflix';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 定义学期数组
  terms: any[];

  constructor(private termService: TermService,
              private httpClient: HttpClient) { }

  ngOnInit() {
    this.fetchSchools();
  }

  fetchSchools() {
    this.termService.getTerms().subscribe(
      (data) => {
        this.terms = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  onDelete(index: number, term_id: number): void {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.httpClient.delete(`/api/term/delete/${term_id}`)
          .subscribe(() => {
              console.log('删除成功');
              this.terms.splice(index, 1);
          },
          error => console.log('删除失败', error));
      });
  }

}
