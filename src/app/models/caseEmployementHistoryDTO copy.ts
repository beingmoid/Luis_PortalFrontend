export class CaseEmploymentHistoryDTO{

    constructor() {
        this.id = 0;
    }

    id: number;
    startDate: Date;
    endDate: Date;
    employerName: string;
    jobTitle: string;
}