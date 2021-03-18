import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from 'rxjs/operators'
import { IApiBaseActions } from '../../models/IApiBaseActions';
import { BaseResponse as BaseResponse } from '../../models/IApiResponse';
import { API_URL } from '../../models/Global';
import { Observable } from 'rxjs';

@Injectable()
export class GenericApiService implements IApiBaseActions {
    url: string;
    constructor(
        private myHttpClient: HttpClient
    ) { }

    Get(id: any, url: string = "") {
        let apiURL = url == "" ? this.url : url;
        apiURL += `/${id}`;
        return this.myHttpClient.get<BaseResponse>(`${apiURL}`).pipe(tap(x => this.HandleResponse(x)));
    }

    GetAll(url: string = "") {
        let apiURL = url == "" ? this.url : url;
        return this.myHttpClient
            .get<BaseResponse>(`${apiURL}`).pipe(tap(x => this.HandleResponse(x)));
    }

    Post(data: any, url: string = ""): Observable<BaseResponse> {
        let apiURL = url == "" ? this.url : url;
        return this.myHttpClient
            .post<BaseResponse>(`${apiURL}`, data).pipe(tap(x => this.HandleResponse(x)));
    }

    Delete(id: any, url: string = "") {
        let apiURL = url == "" ? this.url : url;
        apiURL += `/${id}`;
        return this.myHttpClient.delete<BaseResponse>(`${apiURL}`).pipe(tap(x => this.HandleResponse(x)));
    }

    Update(id: any, data: any, url: string = "") {
        let apiURL = url == "" ? this.url : url;
        apiURL += `/${id}`;
        return this.myHttpClient.put<BaseResponse>(`${apiURL}`, data).pipe(tap(x => this.HandleResponse(x)));
    }

    HandleResponse(response: BaseResponse) {
        if (response && response.statusCode === 500) {
            alert('There is an error while getting the data. please try again later');
            console.log(response);
        }
    }
    IsContactExist(url: string = ""): Observable<BaseResponse> {
        let apiURL = url == "" ? this.url : url;
        return this.myHttpClient
            .post<BaseResponse>(`${apiURL}`, "").pipe(tap(x => this.HandleResponse(x)));
    }

}