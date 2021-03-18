import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { RoleClaimsDTO } from 'src/app/models/roleClaimsDTO';
import { RoleDTO } from 'src/app/models/roleDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericApiService {

  roleListObserver$: Observable<RoleDTO[]>;
  private roleListSubject$: BehaviorSubject<RoleDTO[]> = new BehaviorSubject<RoleDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.roleListObserver$ = this.roleListSubject$.asObservable();
  }

  CreateRoleWithClaims(data: RoleClaimsDTO) {
    return this.Post(data, API_URL + API_ENDPOINTS.Roles + "/CreateRoleWithClaims");
  }

  UpdateRoleWithClaims(roleId, data: RoleClaimsDTO) {
    return this.Update(roleId, data, API_URL + API_ENDPOINTS.Roles + "/UpdateRoleWithClaims");
  }

  GetAllRoles() {
    return this.GetAll(API_URL + API_ENDPOINTS.Roles + "/GetAllRoles").subscribe(res => {
      this.roleListSubject$.next(res.dynamicResult);
    });
  }

  GetClaimsAgainstRole(roleId){
    return this.Get(roleId, API_URL + API_ENDPOINTS.Roles + "/GetClaimsAgainstRole");
  }

  deleteRole(roleId): Observable<BaseResponse> {
    return this.Delete(roleId, API_URL + API_ENDPOINTS.Roles);
  }

  CheckRole(role: string) {
    return this.httpClient.get<BaseResponse>(API_URL + API_ENDPOINTS.Roles + "/CheckRole" + `?role=${role}`);
  }


  
}  
