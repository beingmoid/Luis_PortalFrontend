import { Observable } from 'rxjs';
import { BaseResponse } from './IApiResponse';


export interface IApiBaseActions {
    Get(id: any, url: string): any;
    GetAll(url: string): Observable<BaseResponse>;
    Post(id: any, url: string, data: any): Observable<BaseResponse>;
    Delete(url: string, id: any): Observable<BaseResponse>;
    Update(id: any, data: any): any;
}