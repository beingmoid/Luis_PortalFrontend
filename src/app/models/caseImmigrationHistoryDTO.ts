export class CaseImmigrationHistoryDTO {
    constructor() {
        this.id = 0;
    }

    id: number;
    isRefusedApplication: boolean;
    isArrested: boolean;
    isAppliedForCanad: boolean;
    anyFurtherInfo: string;
}