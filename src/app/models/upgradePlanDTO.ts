export class UpgradePlanDTO {
    stripeToken: string;
    planId: number;
    userId: string;
    amountPayable: number;
    currency: string;
    numberOfUsers: number;
}