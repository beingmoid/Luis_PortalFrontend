export const getMenuData: any[] = [

    {
        title: 'Home',
        key: 'home',
        icon: 'fe fe-home',
        url: '/',
    },
    {
        title: 'Contacts',
        key: 'contacts',
        icon: 'fe fe-users',
        url: '/contacts',
    },
    {
        title: 'Cases',
        key: 'cases',
        icon: 'fe fe-inbox',
        url: '/cases',
    },
    {
        title: 'Calendar',
        key: 'calendar',
        icon: 'fe fe-calendar',
        url: '/calendar',
    },
    {
        title: 'Tasks',
        key: 'tasks',
        icon: 'fe fe-check-square',
        url: '/tasks',
    },
    {
        title: 'Accounting',
        key: 'accounting',
        icon: 'fe fe-book',
        url: '/accounting',
    },
    {
        title: 'Commission',
        key: 'commission',
        icon: 'fe fe-dollar-sign',
        url: '/commission',
    },
    {
        title: 'Documents',
        key: 'documents',
        icon: 'fe fe-file',
        url: '/documents',
    },
    {
        title: 'Forms',
        key: 'forms',
        icon: 'fe fe-file-text',
        url: '/forms',
    },
    {
        title: 'Team Members',
        key: 'teamMembers',
        icon: 'fe fe-user-check',
        url: '/team',
    },
    {
        title: 'Analytics',
        key: 'analytics',
        icon: 'fe fe-trending-up',
        url: '/analytics',
    },
    {
        title: 'Immigration News',
        key: 'immigrationNews',
        icon: 'fe fe-list',
        url: '/news',
    },
    {
        title: 'History',
        key: 'history',
        icon: 'fe fe-rotate-ccw',
        url: '/history',
    },
    {
        title: 'Login History',
        key: 'loginHistory',
        icon: 'fe fe-clock',
        url: '/history/login',
    },
    {
        category: true,
        title: ''
    },
    {
        title: 'Settings',      // item title
        key: 'settings',        // key (required by antd menu)
        icon: 'fe fe-more-horizontal',       // icon class
        // roles: ['admin'],         // set user roles with access to this route
        // count: 4,                 // item badge
        children: [               // render submenu
            {
                title: 'User Settings',
                key: 'user-settings',
                url: '/settings/user',
            },
            {
                title: 'Plan Settings',
                key: 'plan-settings',
                url: '/settings/plan',
            },
            {
                title: 'Billing History',
                key: 'billing-history',
                url: '/settings/billing-history',
            },
            {
                title: 'Logout',
                key: 'logout',
                url: '/settings/logout',
            },
        ]
    },

]

// Reference Item
// {
//     category: true,           // render category
//         title: 'Dashboards',      // category title
//   },
// {
//     title: 'Dashboards',      // item title
//         key: 'dashboards',        // key (required by antd menu)
//             icon: 'fe fe-home',       // icon class
//                 roles: ['admin'],         // set user roles with access to this route
//                     count: 4,                 // item badge
//                         children: [               // render submenu
//                             {
//                                 title: 'Dashboard Alpha',
//                                 key: 'dashboard',
//                                 url: '/dashboard/alpha',
//                             },
//                             ...
//     ]
// },