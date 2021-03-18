export class PlanDTO {
    id: number
    name: string;
    subscriptionPlanKey: string;
    pricePerUser: number;
    description: string;
    storage: number;
    freeUsersAllowed: number
    isEnabled: boolean;
    currency: string;
    isRecurring: boolean;
    billingPlanId: number;
    billingPlanName: string;
    freeDays: number;
    signupUrl: string;
    isFreePlan: boolean;
}