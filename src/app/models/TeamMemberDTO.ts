export class TeamMemberDTO {
    constructor() {
        this.id = 0
    }
    id: number;
    index: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    timeZone: string;
    role: string;
    jobTitleId: number;
    address: string;
    cityId: number;
    province: string;
    country: string;
    stateId: number;
    countryId: number;
    mobileNumber: string;
    secondaryNumber: string;
    compensationTypeId: number;
    currencyTypeId: number;
    compensationAmountId: number;
    memberStatus: boolean;
    phoneNumber: string;
    secondaryPhoneNumber: string;
    imageName: string;
    blobURI: string
    lastLoggedIn: Date;
}