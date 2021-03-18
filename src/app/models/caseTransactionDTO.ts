export class CaseTransactionDTO {

    constructor() {
        this.id = 0;
    }

    id: number;
    index: number;
    invoiceNo: string;
    invoiceDate: Date;
    requested: string
    paymentReceivedDate: Date
    paid: number;
    accountNumber: string
    transferedFrom: string
    transferedTo: string
    notes: string
    accountTransfer: boolean;
    paymentMethodId: number;
    caseId: number;
    paymentMethodName: string;
    caseName: string
}