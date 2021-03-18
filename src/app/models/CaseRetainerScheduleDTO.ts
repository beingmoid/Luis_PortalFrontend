export class CaseRetainerScheduleDTO {

    constructor() {
        this.id = 0;
    }

    id: number;
    index: number;
    tenantId: string;
    caseId: number;
    description: string;
    dueOnId: number;
    taxRate: number;
    professionalFees: number;
    taxes: number;
    admissionFees: number;
    governmentFees: number;
    otherFees: number;
    total: number;
    specificDate: Date;
    caseName: string;
    dueOnName: string;
}