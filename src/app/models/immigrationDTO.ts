export class ImmigrationDTO {
    constructor() {
    }

    id: number;
    title: string;
    description: string;
    immigrationImageBlobName: string;
    immigrationImageBlobURI: string;
    imageName: string;
    isFileAdded: boolean;
    createdDate: Date;

}