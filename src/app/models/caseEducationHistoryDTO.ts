export class CaseEducationHistoryDTO{

    constructor() {
        this.id = 0;
    }

    id: number;
    startDate: Date;
    endDate: Date;
    nameOfSchool: string;
    courseName: string;
}