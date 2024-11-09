import {EventEmitter, Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  beLogout = new EventEmitter<void>();
  login = false;

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  public showError(title: string, text: string, icon: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  }

  public showSuccess(title: string, icon: string): void {
    Swal.fire({
      title,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  }

  public showWithoutTerm(title: string, text: string, icon: string): void {
    Swal.fire({
      icon: 'warning',
      title,
      text,
    }).then((result) => {
      this.router.navigate(['term']);
    });
  }

  public showLogoutWarning(title: string, icon: string): void {
    Swal.fire({
      title,
      icon: 'warning',
      showConfirmButton: false,
      timer: 1500
    });
  }

  public showWarning(title: string, text: string, icon: string): Promise<boolean> {
    return Swal.fire({
      title: '确定吗?',
      text: '该操作可能会失败，建议检查有关数据是否清空。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，删除！',
      cancelButtonText: '取消'
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  public showInfo(): void {
    Swal.fire({
      title: '用户已冻结',
      text: '请联系管理员解决',
      icon: 'question'
    });
  }

  public returnLogin(): void {
    Swal.fire({
      title: '即将返回登录界面...',
      html: '',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss !== Swal.DismissReason.cancel) {
        console.log('I was closed by the timer');
        // 在这里执行计时器结束后的操作，例如重定向到登录页面
        this.beLogout.emit();
        this.login = false;
        localStorage.removeItem('login');
        window.sessionStorage.removeItem('login');
        window.sessionStorage.removeItem('role');
        window.location.href = '/';
      }
    });
  }
}
