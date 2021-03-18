import { CaseDTO } from "./caseDTO";
import { ContactDTO } from "./contactsDTO";
import { EventsDTO } from "./eventsDTO";
import { ImmigrationDTO } from "./immigrationDTO";

export class HomeDTO{
    upcomingEventsCount:number;
    newAddedCasesCount:number;
    casesApproachingDeadlineCount:number;
    casesToBeInvoicedCount:number;

    recentlyModifiedCases:CaseDTO[];
    casesApproachingDeadlines:CaseDTO[];
    casesToBeInvoiced:CaseDTO[];
    recentModifiedContacts:ContactDTO[];
    upcomingEvents:EventsDTO[];
    immigrationNews: ImmigrationDTO[];
}