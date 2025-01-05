import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private allowDeleteOnHomeSubject = new BehaviorSubject<boolean>(false); // Valor inicial
  allowDeleteOnHome$ = this.allowDeleteOnHomeSubject.asObservable();

  constructor() {}

  getAllowDeleteOnHome() {
    return this.allowDeleteOnHomeSubject.value;
  }

  setAllowDeleteOnHome(value: boolean) {
    this.allowDeleteOnHomeSubject.next(value);
  }
}
