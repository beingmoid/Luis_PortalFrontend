import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  topAlertMessageSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
  }

  success(msg: string) {
    Swal.fire({
      title: 'Success!',
      text: msg,
      icon: 'success',
      timer: 4000,
      confirmButtonText: '  Ok  ',
      confirmButtonColor: '#5BAB54',
    })
  }

  error(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      timer: 4000,
      confirmButtonText: '  Ok  ',
      confirmButtonColor: '#F15E5E',
    })
  }

  delete(msg?: string) {
    return Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this records? \n This process cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#F15E5E',
    })
  }

  confirm(title: string, msg?: string) {
    return Swal.fire({
      title: title,
      text: msg,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#109CF1',
    })
  }

  warn(msg: string) {
    Swal.fire({
      title: 'Cannot Perform!',
      text: msg,
      icon: 'warning',
      timer: 3000,
      confirmButtonText: '  Ok  ',
      confirmButtonColor: '#FFB946',
    })
  }

  info(msg: string) {
    Swal.fire({
      title: 'Information',
      text: msg,
      icon: 'info',
      timer: 3000,
      confirmButtonText: '  Ok  ',
      confirmButtonColor: '#1292d5',
    })
  }
}
