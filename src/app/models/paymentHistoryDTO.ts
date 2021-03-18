export class PaymentHistoryDTO {
    id: number;
    index: number;
    tenantId: string;
    subscriptionPlanId: number;
    payment: number;
    paymentDate: Date;
    endDate: Date;
    recurringDate: Date;
    invoiceURL: string;
    stripeRecieptURL: string;
    subscriptionPlanName: string;
    subscriptionPlanBillingType: string;
    numberOfUsers: number;
    currency: string;
}