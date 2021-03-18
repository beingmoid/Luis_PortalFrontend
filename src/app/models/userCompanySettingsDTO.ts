export class UserCompanySettingsDTO {
    id: number;
    tenantId: string;
    userId: string
    currencyId: number
    languageId: number
    caseAutoNumbering: boolean;
    contactAutoNumbering: boolean;
}