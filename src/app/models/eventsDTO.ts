import { BaseDTO } from "./BaseDTO";

export class EventsDTO extends BaseDTO {
    id: number;
    contactId: number;
    caseId: number;
    subject: string;
    startDate: Date;
    endDate: Date;
    time: string;
    allDay: boolean;
    attandees: any[] = [];
    tags: any[] = [];
    emailAttandees: boolean;
    reminders: boolean;
    notes: string;
    isFileAdded: boolean;
    eventFileBlobName: string;
    fileName: string;
    eventFileBlobURI: string;
}