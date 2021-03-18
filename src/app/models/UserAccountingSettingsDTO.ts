export class UserAccountingSettingsDTO {
    id: number;
    tenantId: string;
    chargeSalesTax: boolean;
    taxJurisdictionId: number;
    defaultTaxCode: string;
    percentage: number;
}