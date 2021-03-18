export class CaseTaskDTO {

    constructor() {
        this.id = 0;
    }

    id: number;
    index: number;
    taskName: string;
    notes: string;
    assignedToId: number;
    assignedById: number;
    priorityId: number;
    statusId: number;
    sendUpdate: boolean;
    dueDate: Date;
    time: string;
    caseId: number;
    assignedToName: string;
    assignedByName: string;
    statusName: string;
    priorityName: string;
}