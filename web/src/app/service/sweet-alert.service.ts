import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  public showError(title: string, text: string, icon: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text,
    });
  }

  public showSuccess(title: string,  icon: string): void {
    Swal.fire({
      title,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  }

   public showLogoutWarning(title: string,  icon: string): void {
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
}
