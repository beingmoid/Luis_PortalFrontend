export class NotificationDTO {
    public id: number;
    public text: string;
    public from: string;
    public to: string;
    public timeSent: Date;
    public type: Type;
    public typeName: string;
    public isRead: boolean;
}

const enum Type {
    Alert = 1,
    Event,
    Action
}