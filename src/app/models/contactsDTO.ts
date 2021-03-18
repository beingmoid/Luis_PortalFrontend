import { BaseDTO } from "./BaseDTO";


export class ContactDTO extends BaseDTO {
    constructor() {
        super();
        this.id = 0;
    }
    id: number;
    index: number;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    name: string;
    notes: string;
    imageName: string;
    blobURI: string;
    tenantId: number;
    contactTypeId: number;
    contactTypeName: string;
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    countryId: number;
    countryName: string;
    languageId: number;
    languageName: string;
    isClientAccountCreated: boolean;
    ///createdDate:string;
}