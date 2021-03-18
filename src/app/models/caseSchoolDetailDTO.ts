export class CaseSchoolDetailDTO {
    constructor() {
        this.id = 0;
    }

    id: number;
    nameOfSchool: string;
    preferredCourseId: number;
    preferredProvinceId: number;
    targetStartDate: Date;
    maxTutionBudget: string;
    preferredCourseName: string;
    preferredProvinceName: string;
}