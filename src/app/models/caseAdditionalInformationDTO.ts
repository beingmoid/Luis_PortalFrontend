export class CaseAdditionalInformationDTO {
    constructor() {
        this.id = 0;
    }

    id: number;
    contactInfo: string;
    dateOfBirth: Date;
    isSpouseAccompanyingCanada: boolean;
    isSpouseCanadianPR: boolean;
    cityLocationId: number;
    countryOfCitizenshipId: number;
    maritalStatusId: number;
    cityLocationName: string;
    countryOfCitizenshipName: string;
    maritalStatusName: string;
    provinceName :string;
    countryOfResidenceName :string;
}