import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'
import { filter } from 'rxjs/operators'
import * as _ from 'lodash'
import { select, Store } from '@ngrx/store'
import { MenuService } from 'src/app/services/menu'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import { AuthService } from 'src/app/services/jwt/auth.service'
import { UserDTO } from 'src/app/models/userDTO'
import { Observable, Subscription } from 'rxjs'
import jwt_decode from 'jwt-decode';
import { viewClassName } from '@angular/compiler'

@Component({
  selector: 'cui-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
})
export class MenuLeftComponent implements OnInit, OnDestroy {
  menuColor: String
  isMenuShadow: Boolean
  isMenuUnfixed: Boolean
  isSidebarOpen: Boolean
  isMobileView: Boolean
  leftMenuWidth: Number
  isMenuCollapsed: Boolean
  logo: String
  menuData: any[]
  menuDataActivated: any[]
  role: String
  name: String
  email: String
  userSubject: Subscription;
  tokenPayload: any
  userClaims: any[]
  userImage: string = 'assets/images/avatars/avatar-2.png';


  constructor(private menuService: MenuService, private store: Store<any>, private router: Router, private authService: AuthService) {

    this.userSubject = this.authService.user.subscribe(res => {
      if (res) {
        this.name = res.firstName + " " + res.lastName
        this.email = res.email
        if (res.imageURL) {
          this.userImage = res.imageURL
        }
      }
    });
    this.menuService.getMenuData().subscribe(menuData => (this.menuData = menuData))
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.menuColor = "dark"
      this.isMenuShadow = state.isMenuShadow
      this.isMenuUnfixed = state.isMenuUnfixed
      this.isSidebarOpen = state.isSidebarOpen
      this.isMobileView = state.isMobileView
      this.leftMenuWidth = state.leftMenuWidth
      this.isMenuCollapsed = state.isMenuCollapsed
      this.logo = state.logo
    })
  }

  ngOnInit() {

    let token = localStorage.getItem('accessToken')
    this.tokenPayload = this.decodeToken(token)
    this.userClaims = Object.keys(this.tokenPayload)

    this.activateMenu(this.router.url)
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.activateMenu(event.url ? event.url : null)
      })
  }

  hasPermission(item: any): boolean {
    // if user claim is array or string & is Home page & is Setting Page & is Line 
    if (this.tokenPayload && this.tokenPayload.Role === "CompanyAdmin") {
      return true;
    }
    if (this.tokenPayload && this.tokenPayload.Role === "Client" && (item.title === "User Settings" || item.title === "Cases" )) {
      return true;
    }
    if ((this.userClaims &&
      this.userClaims.indexOf(item.title) > -1)
      || item.title === "Home" || item.title === "Settings"
      || item.title === "Logout"
      || item.title === ""
      || (item.title === "Team Members" && this.userClaims.indexOf("Team") > -1)
      || (item.title === "History" && (this.userClaims.findIndex(x => x.includes("History")) > -1))
      || (item.title === "User Settings" && (this.userClaims.indexOf('Settings') !== -1))
    ) {
      return true
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

  ngOnDestroy() {
    if (!this.userSubject) this.userSubject.unsubscribe();
  }
  activateMenu(url: any, menuData = this.menuData) {
    menuData = JSON.parse(JSON.stringify(menuData))
    const pathWithSelection = this.getPath({ url: url }, menuData, (entry: any) => entry, 'url')
    if (pathWithSelection) {
      pathWithSelection.pop().selected = true
      _.each(pathWithSelection, (parent: any) => (parent.open = true))
    }
    this.menuDataActivated = menuData.slice()
  }

  getPath(
    element: any,
    source: any,
    property: any,
    keyProperty = 'key',
    childrenProperty = 'children',
    path = [],
  ) {
    let found = false
    const getElementChildren = (value: any) => _.get(value, childrenProperty)
    const getElementKey = (value: any) => _.get(value, keyProperty)
    const key = getElementKey(element)
    return (
      _.some(source, (e: any) => {
        if (getElementKey(e) === key) {
          path.push(e)
          return true
        } else {
          return (found = this.getPath(
            element,
            getElementChildren(e),
            property,
            keyProperty,
            childrenProperty,
            path.concat(e),
          ))
        }
      }) &&
      (found || _.map(path, property))
    )
  }

  toggleSettings() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isSidebarOpen: !this.isSidebarOpen,
      }),
    )
  }

  onCollapse(value: any) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: value,
      }),
    )
  }

  /**
   * Logout
   */
  logout() {
    this.authService.logout()
  }
}
