import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';
import {SweetAlertService} from '../service/sweet-alert.service';

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
              private router: Router,
              private sweetAlertService: SweetAlertService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const url = '/api/Login/logout';
    this.httpClient.get(url)
      .subscribe(() => {
        this.beLogout.emit();
        this.sweetAlertService.showSuccess('注销成功！', '');
        },
        error => {
        this.sweetAlertService.showError('注销失败！', '', '');
        console.log('logout error', error);
        });
  }
}
