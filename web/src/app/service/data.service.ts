import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";

class Item {
  id: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private items: Item[] = [];

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return of(this.items);
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  updateItem(item: Item): void {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  deleteItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }
}
