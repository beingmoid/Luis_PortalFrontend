import { environment } from 'src/environments/environment';

export const API_URL: string = "http://13.66.0.58/";


export const API_ENDPOINTS = {

    // dummy endpoints for reusability
    DummyList: 'api/dummy/list',
    DummyAdd: 'api/dummy/add',
    DummyDelete: 'api/dummy/delete',
    DummyUpdate: 'api/dummy/update',
    DummyGet: 'api/dummy/get',
    Contacts: 'api/Contacts',
    Commission: 'api/Commission',
    Case: 'api/Case',
    LookUp: 'api/LookUp',
    RetainerSchedule: 'api/RetainerSchedule',
    Task: 'api/Task',
    Note: 'api/Note',
    StripePublishKey: 'api/StripeConfiguration/GetPublishKey',
    CheckEmail: 'api/auth/CheckEmail',
    Transaction: 'api/Transactions',
    Document: 'api/Document',
    Invoice: 'api/Invoice',
    ImmigrationDepartmentStatus: 'api/ImmigrationDepartmentStatus',
    Form: 'api/Form',
    Subscription: 'api/SubscriptionPlans',
    Auth: 'api/Auth',
    PaymentHistory: 'api/PaymentHistory',
    Roles: 'api/Roles',
    Team: 'api/TeamMembers',
    Users: 'api/Users',
    CheckIsUserEligibleForNewPswd: 'api/auth/CheckIsUserEligibleForNewPswd',
    BankAccount: 'api/BankAccount',
    Audit: 'api/Audit',
    Events: 'api/Events',
    HomeData: 'api/Home/GetHomeData',
    Immigration: 'api/Immigration',
    Analytics: 'api/Analytics',
    GlobalSearch: 'api/GlobalSearch',
    Notification: 'api/Notification',
}