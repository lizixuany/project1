import { Injectable } from '@angular/core';
import {User} from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  data: User = new User();

  getData() {
    console.log(this.data);
    return this.data;
  }

  setData(newData: User) {
    console.log(newData);
    this.data = newData;
    console.log(this.data);
  }
}
