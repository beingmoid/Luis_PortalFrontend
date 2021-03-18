import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  formSubmited = new Subject();
  restForm = new  Subject();
  constructor() { }
}
