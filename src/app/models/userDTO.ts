export class UserDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subscriptionPlanName: string
    subscriptionMessage: string
    daysLeft: number
    planId: number;
    isFreePlan: boolean;
    isPaidPlan: boolean;
    isValidPlan: boolean;
    nextRecurringDate: Date;
    recurringDate: Date;
    profileCompletion: number;
    numberOfUsersPurchased: number;
    currentPlanStatus: string;
}