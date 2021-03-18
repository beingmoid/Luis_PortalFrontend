import { Injectable } from '@angular/core'
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router'
import { NzModalService } from 'ng-zorro-antd/modal'
import { Observable } from 'rxjs'
import { AuthService } from 'src/app/services/jwt/auth.service'
import { AlertService } from 'src/app/services/alert.service'

@Injectable({
  providedIn: 'root',
})
export class PreAuthGuard implements CanActivate {

  constructor(public router: Router, private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken && state.url.includes('auth/register') && state.url.includes('planid=')) {
      this.authService.logoutPreviousUser()
      return true
    }
    if (accessToken && refreshToken) { 
        this.router.navigateByUrl("/home");
        return false;
    }
    return true;
  }
}
