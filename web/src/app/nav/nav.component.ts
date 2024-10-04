import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../entity/user';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Output()
  beLogout = new EventEmitter<void>();

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const url = '/api/Login/logout';
    this.httpClient.get(url)
      .subscribe(() => this.beLogout.emit(),
        error => console.log('logout error', error));
  }
}
