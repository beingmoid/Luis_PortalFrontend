import { BaseDTO } from './BaseDTO';
import { CaseAdditionalInformationDTO } from './caseAdditionalInformationDTO';
import { CaseEducationHistoryDTO } from './caseEducationHistoryDTO';
import { CaseEmploymentHistoryDTO } from './caseEmployementHistoryDTO copy';
import { CaseImmigrationHistoryDTO } from './caseImmigrationHistoryDTO';
import { CaseLanguageExamDTO } from './caseLanguageExamDTO';
import { CaseSchoolDetailDTO } from './caseSchoolDetailDTO';

export class CaseDTO extends BaseDTO {
    constructor() {
        super();
        this.id = 0;
    }

    id: number;
    index: number;
    caseNumber: string;
    caseStartedBy: string;
    caseReferredBy: string;
    caseDeadLineDate: Date;
    caseOpenDate: Date;
    description: string;
    tenantId: string;
    countryToImmigrateId: number;
    currentLocationId: number;
    teamMemeberId: number;
    statusId: number;
    contactClientId: number;
    caseTypeId: number;
    countryToImmigrateName: string;
    countryCurrentName: string;
    teamMemberName: string;
    caseStatusName: string;
    caseTypeName: string;
    contactClientName: string;
    contactCaseStartedName: string;
    contactCaseReferedName: string;
    caseAssigneeId: number;
    caseAssigneeName:string;

    caseAdditionalInformation: CaseAdditionalInformationDTO;
    caseImmigrationHistory: CaseImmigrationHistoryDTO;
    caseSchoolDetails: CaseSchoolDetailDTO;
    caseLanguageExams: CaseLanguageExamDTO[];
    caseEducationalHistories: CaseEducationHistoryDTO[];
    caseEmploymentHistories: CaseEmploymentHistoryDTO[];
    casePassportDetail: any;
    caseDependent: any;
    casePrimaryParentDetail: any;
    caseSpouseParentDetail: any;
    caseSiblings: any[];
    caseApplicantDeclaration: any;
    caseWorkInCanada: any;
    caseFinance: any;
    caseTravelHistories: any[];
    caseEmergencyContact: any;

    // createdBy: string;
    // createdDate: Date;
    // modifiedBy: string;
    // modifiedDate: Date
    // isDeleted: boolean;
}