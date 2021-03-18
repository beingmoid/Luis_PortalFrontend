import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { TeamMemberDTO } from 'src/app/models/TeamMemberDTO';
import { UserAccountingSettingsDTO } from 'src/app/models/UserAccountingSettingsDTO';
import { UserCompanyDTO } from 'src/app/models/userCompanyDTO';
import { UserCompanySettingsDTO } from 'src/app/models/userCompanySettingsDTO';
import { UserDTO } from 'src/app/models/userDTO';
import { UserPersonalSettingsDTO } from 'src/app/models/userPersonalSettingsDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericApiService {

  userObserver$: Observable<UserDTO>;
  private userSubject$: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>(undefined);

  teamMembersObserver$: Observable<TeamMemberDTO[]>;
  private teamMembersSubject$: BehaviorSubject<TeamMemberDTO[]> = new BehaviorSubject<TeamMemberDTO[]>(undefined);

  userPersonalSettingsObserver$: Observable<UserPersonalSettingsDTO>;
  private userPersonalSettingsSubject$: BehaviorSubject<UserPersonalSettingsDTO> = new BehaviorSubject<UserPersonalSettingsDTO>(undefined);

  userCompanySettingsObserver$: Observable<UserCompanySettingsDTO>;
  private userCompanySettingsSubject$: BehaviorSubject<UserCompanySettingsDTO> = new BehaviorSubject<UserCompanySettingsDTO>(undefined);

  userAccountingSettingsObserver$: Observable<UserAccountingSettingsDTO>;
  private userAccountingSettingsSubject$: BehaviorSubject<UserAccountingSettingsDTO> = new BehaviorSubject<UserAccountingSettingsDTO>(undefined);

  userCompanyObserver$: Observable<UserCompanyDTO>;
  private userCompanySubject$: BehaviorSubject<UserCompanyDTO> = new BehaviorSubject<UserCompanyDTO>(undefined);

  public get TeamMembers() { return this.teamMembersSubject$.value }
  public get userPersonalSetting() { return this.userPersonalSettingsSubject$.value }
  public get userCompanySettings() { return this.userCompanySettingsSubject$.value }
  public get userAccountingSettings() { return this.userAccountingSettingsSubject$.value }
  public get userCompany() { return this.userCompanySubject$.value }

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.url = "Users";
    this.userObserver$ = this.userSubject$.asObservable();
    this.teamMembersObserver$ = this.teamMembersSubject$.asObservable();
    this.userPersonalSettingsObserver$ = this.userPersonalSettingsSubject$.asObservable();
    this.userCompanySettingsObserver$ = this.userCompanySettingsSubject$.asObservable();
    this.userAccountingSettingsObserver$ = this.userAccountingSettingsSubject$.asObservable();
    this.userCompanyObserver$ = this.userCompanySubject$.asObservable();
  }

  updateUser(data: UserDTO) {
    return this.httpClient.post<BaseResponse>(`${API_URL}api/auth/updateUser`, data);
  }

  GetUsersForCurrentTenant() {
    this.GetAll(API_URL + API_ENDPOINTS.Users + "/GetUsersForCurrentTenant").subscribe(res => {
      this.teamMembersSubject$.next(res.dynamicResult)
    })
  }

  currentAccount() {
    this.httpClient.get<BaseResponse>(`${API_URL}api/auth/account`).subscribe(res => {
      this.userSubject$.next(res.dynamicResult);
    });
  }

  deleteTeamMember(userId): Observable<BaseResponse> {
    return this.Delete(userId, API_URL + API_ENDPOINTS.Users);
  }

  getUserPersonalSettings() {
    this.httpClient.get<BaseResponse>(`${API_URL}api/users/GetUserPersonalSettings`).subscribe(res => {
      this.userPersonalSettingsSubject$.next(res.dynamicResult);
    });
  }

  updateUserPersonalSettings(file: any, data: UserPersonalSettingsDTO) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('Email', data.email);
    formData.append('JobTitleId', data.jobTitleId.toString());
    formData.append('PhoneNo', data.phoneNo);
    formData.append('TimeZone', data.timeZone);
    formData.append('RecieveProductEmails', data.recieveProductEmails.toString());
    formData.append('RecieveNotifications', data.recieveNotifications.toString());

    return this.Post(formData, API_URL + API_ENDPOINTS.Users + "/UpdateUserPersonalSettings");
  }

  updateUserCompanySettings(data: UserCompanySettingsDTO) {
    return this.httpClient.post<BaseResponse>(`${API_URL}api/users/UpdateUserCompanySettings`, data);
  }

  getCompanySettings() {
    return this.httpClient.get<BaseResponse>(`${API_URL}api/users/GetCompanySettings`).subscribe(res => {
      this.userCompanySettingsSubject$.next(res.dynamicResult);
    })
  }

  updateUserAccountingSettings(data: UserAccountingSettingsDTO) {
    return this.httpClient.post<BaseResponse>(`${API_URL}api/users/UpdateUserAccountingSettings`, data);
  }

  getAccountingSettings() {
    return this.httpClient.get<BaseResponse>(`${API_URL}api/users/GetAccountingSettings`).subscribe(res => {
      this.userAccountingSettingsSubject$.next(res.dynamicResult);
    })
  }

  updateUserCompany(file: any, data: UserCompanyDTO) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('CompanyOwner', data.companyOwner);
    formData.append('LegalBusinessName', data.legalBusinessName);
    formData.append('ZipCode', data.zipCode);
    formData.append('PhoneNo', data.phoneNo);
    formData.append('CompanyEmail', data.companyEmail);
    formData.append('Website', data.website);
    formData.append('LicenseNo', data.licenseNo);
    formData.append('TaxId', data.taxId);
    formData.append('CityId', data.cityId.toString());
    formData.append('OwnerName', data.ownerName);
    formData.append('OwnerCountryId', data.ownerCountryId.toString());
    formData.append('OwnerPhoneNo', data.ownerPhoneNo);
    formData.append('PrimaryOwnerEmail', data.primaryOwnerEmail);
    formData.append('OwnerMembershipTypeId', data.ownerMembershipTypeId.toString());
    formData.append('BusinessStructureId', data.businessStructureId.toString());
    formData.append('OwnerLicenseNo', data.ownerLicenseNo);

    return this.Post(formData, API_URL + API_ENDPOINTS.Users + "/UpdateUserCompany");
  }

  getUserCompany() {
    return this.httpClient.get<BaseResponse>(`${API_URL}api/users/GetUserCompany`).subscribe(res => {
      this.userCompanySubject$.next(res.dynamicResult);
    })
  }
}  
