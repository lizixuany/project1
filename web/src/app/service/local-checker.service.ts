import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalCheckerService {
  private isAlive = true;

  constructor() {}

  startCheckingLocal() {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'login' && event.storageArea === localStorage) {
        // localStorage 中的 login 发生了变化
        console.log('login变化:', event.newValue);
        // 执行页面刷新
        window.location.reload();
      }
    });
  }
}
