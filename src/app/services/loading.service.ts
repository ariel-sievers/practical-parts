import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  /**
   * Sets the next value to 'isLoading' subject to true.
   * To be used before subscribing has started on an observable.
   */
  start() {
    this.isLoading.next(true);
  }

  /**
   * Sets the next value to 'isLoading' subject to false.
   * To be used once subscribing is completed on an observable.
   */
  end() {
    this.isLoading.next(false);
  }
}
