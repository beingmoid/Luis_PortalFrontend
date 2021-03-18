export class CaseNoteDTO {
    constructor() {
        this.id = 0;
    }
    id: number;
    note: string;
    caseId: number;
    caseName: string;
    createdDate: Date;
}