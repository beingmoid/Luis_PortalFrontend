import { UserDTO } from './userDTO';

export class CaseUserDTO extends UserDTO {
    caseType: string;
    caseStatus: string;
    image: string;
    immigrationStatusName:string
}