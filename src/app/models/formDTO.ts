export class FormDTO {
    constructor() {
        this.isSelected = false;
    }

    id: number;
    formCode: string;
    formName: string;
    formBlobName: string;
    formBlobURI: string;
    categoryId: number;
    languageId: number;
    categoryName: string;
    languageName: string;
    createdDate: Date;
    isSelected: boolean;
}