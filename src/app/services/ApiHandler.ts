import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from 'rxjs/operators'
import { IApiBaseActions } from '../models/IApiBaseActions';
import { BaseResponse } from '../models/IApiResponse';


@Injectable()
export class ApiHandler implements IApiBaseActions {

    constructor(
        private myHttpClient: HttpClient
    ) { }

    /**
     * 
     * @param id id of item in DB
     * @param url API url
     */
    Get(id: any, url: string) {
        url = `${url}?id=${id}`;
        return this.myHttpClient.get<BaseResponse>(url).pipe(tap(x => this.HandleResponse(x)));
    }

    /**
     * 
     * @param url API url
     */
    GetAll(url: string) {
        return this.myHttpClient.get<BaseResponse>(url).pipe(tap(x => this.HandleResponse(x)));

    }

    /**
     * 
     * @param id Item ID in DB by default it should be zero 0
     * @param url API url
     * @param data New Data to Update
     */
    Post(id: any, url: string, data: any) {
        url = `${url}?id=${id}`;
        return this.myHttpClient.post<BaseResponse>(url, data).pipe(tap(x => this.HandleResponse(x)));
    }

    /**
     * 
     * @param url API url
     * @param id ID of Item in DB
     */
    Delete(id: any, url: string) {
        url = `${url}?id=${id}`;
        return this.myHttpClient.delete<BaseResponse>(url).pipe(tap(x => this.HandleResponse(x)));
    }

    /**
     * 
     * @param id ID of Item in DB
     * @param data New Data to update
     */
    Update(id: any, data: any) {
        throw new Error("Method not implemented.");
    }

    HandleResponse(response: BaseResponse) {
        if (response.statusCode === 500) {
            alert('There is an error while getting the data. please try again later');
            console.log(response);
        }
    }

}