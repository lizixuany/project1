import {Component, OnInit} from '@angular/core';
import {TermService} from '../service/term.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 定义学期数组
  terms: any[];

  constructor(private termService: TermService) { }

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

}
