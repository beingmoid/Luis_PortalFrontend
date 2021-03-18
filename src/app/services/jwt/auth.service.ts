import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global'
import { BaseResponse } from 'src/app/models/IApiResponse'
import { RegisterDTO } from 'src/app/models/registerDTO'
import { ResetPasswordDTO } from 'src/app/models/resetPasswordDTO'
import { UserDTO } from 'src/app/models/userDTO'
import { AlertService } from '../alert.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  returnUrl: any
  // private tokenPayload: {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService,
    private route: ActivatedRoute,
  ) {
    this.userSubject = new BehaviorSubject<UserDTO>(undefined);
    this.user = this.userSubject.asObservable();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  public get userValue(): UserDTO {
    return this.userSubject.value;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/login`, { email, password, rememberMe })
      .pipe(
        map(response => {
          if (response && response.isSuccessfull) {
            if (response.dynamicResult.accountDetails.role == 'Admin') {
              this.alert.error("Invalid username or password");
              return;
            };

            localStorage.setItem('accessToken', response.dynamicResult.accessToken)
            localStorage.setItem('refreshToken', response.dynamicResult.refreshToken)
            // if (response.dynamicResult.accessToken) {
            //   this.tokenPayload = this.decodeToken(response.dynamicResult.accessToken);
            // }
            // this.tokenPayload = Object.assign(this.tokenPayload, response.dynamicResult.accountDetails)
            this.userSubject.next(response.dynamicResult.accountDetails);
            if (response.dynamicResult.accountDetails.freeDaysLeft < 0) {
              this.router.navigate(["/settings/plan"]);
              this.alert.success('You have successfully logged in, but your plan is expired!')
            } else {
              this.router.navigate([this.returnUrl]);
              // this.alert.success('You have successfully logged in!')
            }
            return response
          } else if (response && !response.isSuccessfull) {

            this.alert.error(response.errorMessage);
            return response
          }
        }))
  }


  currentAccount() {
    return this.http.get<BaseResponse>(`${API_URL}api/auth/account`).subscribe(res => {
      this.userSubject.next(res.dynamicResult);
      // if (this.router.url === '/settings/plan') {
      //   this.router.navigate(["/home"]);
      // }
    })
  }

  logout() {
    if (localStorage.getItem('refreshToken') && localStorage.getItem('accessToken')) {
      this.http.get(`${API_URL}api/auth/Logout`).subscribe(res => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        this.userSubject.next(null);
        this.router.navigate(['/auth/login']);
      })
    }
    else {
      this.logoutUnAuthorizedUser();
    }
  }

  logoutPreviousUser() {
    if (localStorage.getItem('refreshToken') && localStorage.getItem('accessToken')) {
      this.http.get(`${API_URL}api/auth/Logout`).subscribe(res => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        this.userSubject.next(null);
      })
    }
    else {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    }
  }


  logoutUnAuthorizedUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }


  isEmailVerified(userId: string) {
    return this.http.get<BaseResponse>(`${API_URL}api/users/CheckIsUserEmailVerified?id=${userId}`)
  }

  verifyEmail(userId: string, token: string, planId: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${API_URL}api/auth/VerifyEmail?userId=${userId}&token=${token}&planId=${planId}`)
  }

  CheckEmail(email: string) {
    return this.http.get<BaseResponse>(API_URL + API_ENDPOINTS.CheckEmail + `?email=${email}`);
  }

  CheckIsUserEligibleForNewPswd(userId: string) {
    return this.http.get<BaseResponse>(API_URL + API_ENDPOINTS.CheckIsUserEligibleForNewPswd + `?userId=${userId}`);
  }


  generatePasswordResetToken(email: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${API_URL}api/auth/GenerateForgotPasswordToken?email=${email}`)
  }

  resetPasswordResetWithToken(data: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/ResetPasswordWithToken`, data);
  }

  createNewPassword(data: any): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/CreateNewPassword`, data);
  }

  getSubscriptionPlan(key: string) {
    return this.http.get<BaseResponse>(API_URL + API_ENDPOINTS.Subscription + `/GetSubscriptionPlanByKey?key=${key}`);
  }

  registerUsingEmail(data: RegisterDTO) {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/RegisterUsingEmail`, data);
  }

  register(data: RegisterDTO) {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/Register`, data);
  }

  resendVerificationEmail(data: RegisterDTO) {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/ResendVerificationEmail`, data);
  }

  verifyUserAndPlan(userId: string, planId: string) {
    return this.http.get<BaseResponse>(`${API_URL}api/auth/VerifyUserAndPlan?userId=${userId}&planId=${planId}`);
  }

  resetPassword(data: ResetPasswordDTO): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${API_URL}api/auth/resetPassword`, data);
  }

  getUserCardDetails() {
    return this.http.get<BaseResponse>(`${API_URL}api/users/GetUserCardDetails`);
  }
}
