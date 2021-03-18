import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import jwt_decode from 'jwt-decode'
import { Observable } from 'rxjs'
import { AuthService } from 'src/app/services/jwt/auth.service'
import { NotificationsService } from 'src/app/services/notifications.service'
import { PermissionService } from 'src/app/services/permission.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authorized: boolean
  tokenPayload: any
  userClaims: any[]

  constructor(
    public router: Router, 
    private auth: AuthService, 
    private _permissionService: PermissionService,
  ) 
  {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.auth.userValue
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      this.tokenPayload = this.decodeToken(accessToken)
      this.userClaims = Object.keys(this.tokenPayload)
      this.userClaims = this.userClaims.map(x => x.toLowerCase())
      if (state.url.includes('home'))
        this._permissionService.setHomePermissions(this.tokenPayload);


      if (this.hasPermission(state.url)) {
        if (!user) {
          this.auth.user.subscribe(res => {
            if (res) {
              if (!res.isValidPlan) {
                this.router.navigate(["/settings/plan"]);
                return false;
              }
            }
          });
          this.auth.currentAccount();
          return true;
        } else {
          if (!user.isValidPlan) {
            if (state.url.includes('/settings'))
              return true;

            this.router.navigate(["/settings/plan"]);
            return false;
          } else {
            return true;
          }
        }
      } else {
        this.router.navigate(["/home"]);
      }
    } else {
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } })
      return false
    }
  }
  hasPermission(url: string): boolean {
    url = (url.split('/')[1])
    if (this.tokenPayload && this.tokenPayload.Role === "CompanyAdmin") {
      this._permissionService.setPermissions(url.charAt(0).toUpperCase() + url.slice(1), this.tokenPayload)

      return true;
    }
    if (this.tokenPayload && this.tokenPayload.Role === "Client" && (url === "settings" || url === "cases")) {
      this._permissionService.setPermissions(url.charAt(0).toUpperCase() + url.slice(1), { "Role": this.tokenPayload.Role, "Cases": "View", "Settings": "View" })
      return true;
      // if(url === "settings" || url === "cases") {
      // }
    }
    if ((this.userClaims && this.userClaims.length > 0)) {
      // this.router.events
      //   .pipe(filter(event => event instanceof NavigationStart))
      //   .subscribe((event: NavigationStart) => {
      // url = (url.split('/')[1])
      if ((this.userClaims &&
        this.userClaims.indexOf(url) > -1)
        || (this.userClaims.findIndex(x => x.includes("history")) > -1 && url.includes('history'))
        || url === "home" || url === "settings"
        || url === "logout"
        || url === "") {
        this._permissionService.setPermissions(url.charAt(0).toUpperCase() + url.slice(1), this.tokenPayload)
        return true;
      } else {
        false;
      }
      // console.log(url, this.userClaims.indexOf(url))
      // })
    } else {
      return false
    }
  }


  decodeToken(token: string) {
    try {
      return jwt_decode(token)
    }
    catch {
      return null
    }
  }
}
