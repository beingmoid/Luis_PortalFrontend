import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { RoleClaimsDTO } from 'src/app/models/roleClaimsDTO';
import { RoleDTO } from 'src/app/models/roleDTO';
import { TeamMemberDTO } from 'src/app/models/TeamMemberDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService extends GenericApiService {

  teamObserver$: Observable<TeamMemberDTO[]>;
  private teamSubject$: BehaviorSubject<TeamMemberDTO[]> = new BehaviorSubject<TeamMemberDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.teamObserver$ = this.teamSubject$.asObservable();
  }

  getTeamMembers() {
    this.GetAll(API_URL + API_ENDPOINTS.Team + "/GetTeam").subscribe(res => {
      this.teamSubject$.next(res.dynamicResult)
    })
  }

  saveTeamMember(data: TeamMemberDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Team);
  }

  deleteTeamMember(data: TeamMemberDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Team);
  }

  getTeamMember(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.Team);
  }

  updateTeamMember(data: TeamMemberDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Team);
  }

  UploadTeamMember(file: any, teamMember: TeamMemberDTO): Observable<BaseResponse> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FirstName', teamMember.firstName);
    formData.append('LastName', teamMember.lastName);
    formData.append('Email', teamMember.email);
    formData.append('TimeZone', teamMember.timeZone);
    formData.append('Role', teamMember.role);
    formData.append('JobTitleId', teamMember.jobTitleId.toString());
    formData.append('CompensationTypeId', teamMember.compensationTypeId.toString());
    formData.append('CompensationAmountId', teamMember.compensationAmountId.toString());  
    formData.append('CurrencyTypeId', teamMember.currencyTypeId.toString());
    formData.append('CityId', teamMember.cityId ? teamMember.cityId.toString() : '');
    formData.append('PhoneNumber', teamMember.phoneNumber ? teamMember.phoneNumber : '');
    formData.append('SecondaryPhoneNumber', teamMember.secondaryPhoneNumber ? teamMember.secondaryPhoneNumber : '');
    formData.append('Address', teamMember.address ? teamMember.address.toString() : '');
    formData.append('MemberStatus', teamMember.memberStatus.toString());
    if(teamMember.id != undefined){
      formData.append('Id', teamMember.id.toString());
    }
    return this.Post(formData, API_URL + API_ENDPOINTS.Users + "/CreateTeamMember");
  }
}  
