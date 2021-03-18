import { DYNAMIC_TYPE } from '@angular/compiler'

export interface BaseResponse  {
    statusCode: number;
    message: string;
    isSuccessfull: boolean;
    errorMessage: string;
    errorStackTrace: string;
    messageType: string;
    dynamicResult: any;
}
