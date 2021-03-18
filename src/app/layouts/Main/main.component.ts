import { Component, OnInit } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import { slideFadeinUp, slideFadeinRight, zoomFadein, fadein } from '../router-animations'
import { UserService } from 'src/app/services/APIServices/user.service'
import { UserDTO } from 'src/app/models/userDTO'
import { AuthService } from 'src/app/services/jwt/auth.service'
import { LoaderService } from 'src/app/services/loader.service'
import { delay } from 'rxjs/operators'
import { AlertService } from 'src/app/services/alert.service'
import { PermissionService } from 'src/app/services/permission.service'

@Component({
  selector: 'layout-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [slideFadeinUp, slideFadeinRight, zoomFadein, fadein],
})
export class LayoutMainComponent implements OnInit {
  settings$: Observable<any>
  isContentMaxWidth: Boolean
  isAppMaxWidth: Boolean
  isGrayBackground: Boolean
  isSquaredBorders: Boolean
  isCardShadow: Boolean
  isBorderless: Boolean
  menuLayoutType: string
  isMobileView: Boolean
  isMobileMenuOpen: Boolean
  routerAnimation: string
  isMenuCollapsed: Boolean
  leftMenuWidth: Number
  isTopbarFixed: Boolean
  isGrayTopbar: Boolean
  userDetail: UserDTO;
  showPlanBanner: boolean = true;
  touchStartPrev: Number = 0
  touchStartLocked: Boolean = false
  alertMessage$: Observable<boolean>;

  isLoading: boolean = false
  userRole: any

  constructor(
    private store: Store<any>, 
    private _authService: AuthService, 
    private _router: Router, 
    public _loaderService: LoaderService, 
    private _alertService: AlertService,
    private _permissionService: PermissionService,
  ) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.isContentMaxWidth = state.isContentMaxWidth
      this.isAppMaxWidth = state.isAppMaxWidth
      this.isGrayBackground = state.isGrayBackground
      this.isSquaredBorders = state.isSquaredBorders
      this.isCardShadow = state.isCardShadow
      this.isBorderless = state.isBorderless
      this.menuLayoutType = state.menuLayoutType
      this.isMobileView = state.isMobileView
      this.isMobileMenuOpen = state.isMobileMenuOpen
      this.routerAnimation = state.routerAnimation
      this.isMenuCollapsed = state.isMenuCollapsed
      this.leftMenuWidth = state.leftMenuWidth
      this.isTopbarFixed = state.isTopbarFixed
      this.isGrayTopbar = state.isGrayTopbar
    })
    _loaderService.loaderSubject.pipe(
      delay(0)
    ).subscribe(res => {
      this.isLoading = res
    })
  }

  ngOnInit() {

    this.userRole = this._permissionService.getRole()
    this.alertMessage$ = this._alertService.topAlertMessageSubject$;

    this.bindMobileSlide();
    this._authService.user.subscribe(res => {
      if (res) {
        this.userDetail = res;
      }
    });

    if (!this._authService.userValue) {
      this._authService.currentAccount();
    }
  }

  onCollapse(value: any) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: value,
      }),
    )
  }

  toggleCollapsed() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: !this.isMenuCollapsed,
      }),
    )
  }

  toggleMobileMenu() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMobileMenuOpen: !this.isMobileMenuOpen,
      }),
    )
  }

  bindMobileSlide() {
    // mobile menu touch slide opener
    const unify = e => {
      return e.changedTouches ? e.changedTouches[0] : e
    }
    document.addEventListener(
      'touchstart',
      e => {
        const x = unify(e).clientX
        this.touchStartPrev = x
        this.touchStartLocked = x > 70 ? true : false
      },
      { passive: false },
    )
    document.addEventListener(
      'touchmove',
      e => {
        const x = unify(e).clientX
        const prev = this.touchStartPrev
        if (x - <any>prev > 50 && !this.touchStartLocked) {
          this.toggleMobileMenu()
          this.touchStartLocked = true
        }
      },
      { passive: false },
    )
  }

  routeAnimation(outlet: RouterOutlet, animation: string) {
    if (animation === this.routerAnimation) {
      return outlet.isActivated && outlet.activatedRoute.routeConfig.path
    }
  }
}
