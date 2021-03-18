export class Subscription {

    constructor() {
        this.id = 0;
    }
    public id: number;
    public name: string;
    public pricePerUser: number;
    public description: string;
    public storage: number;
    public analytics: string;
    public freeUsersAllowed: number;
    public isEnabled: boolean;
    public recurring: boolean;
    public billingPlanID: boolean;
}