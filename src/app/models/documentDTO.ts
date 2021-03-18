export class DocumentDTO {
    constructor() {
    }

    id: number;
    index: number;
    tenantId: string;
    documentBlobName: string;
    documentBlobURI: string;
    documentName: string;
    documentTypeId: number;
    useForCase: string;
    caseId: number;
    caseName: string;
    documentTypeName: string;
    createdDate: Date;
    isFileAdded: boolean;
    documentCategoryTypeName: string;
}