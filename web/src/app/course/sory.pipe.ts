import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sory'
})
export class SoryPipe implements PipeTransform {

  transform(value: number): string {
    if (value === undefined || value === null) {
      console.warn('接收到了空的值');
      return '-';
    }

    if (value === 1) {
      return '必修';
    } else {
      return '选修';
    }
  }
}
