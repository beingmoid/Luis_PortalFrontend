import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared.module'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AppPreloader } from 'src/app/app-routing-loader'
import { AuthGuard } from 'src/app/components/ui/system/Guard/auth.guard'

// layouts & notfound
import { LayoutAuthComponent } from 'src/app/layouts/Auth/auth.component'
import { LayoutMainComponent } from 'src/app/layouts/Main/main.component'
import { LayoutPublicComponent } from './layouts/Public/public.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'contacts',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'cases',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/cases/cases.module').then(m => m.CasesModule),
      },
      {
        path: 'calendar',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/calendar/calendar.module').then(m => m.CalendarModule),
      },
      {
        path: 'tasks',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/tasks/tasks.module').then(m => m.TasksModule),
      },
      {
        path: 'accounting',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/accounting/accounting.module').then(m => m.AccountingModule),
      },
      {
        path: 'commission',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/commission/commission.module').then(m => m.CommissionModule),
      },
      {
        path: 'documents',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/documents/documents.module').then(m => m.DocumentsModule),
      },
      {
        path: 'forms',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/forms/forms.module').then(m => m.FormsModule),
      },
      {
        path: 'team',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/team-members/team-members.module').then(m => m.TeamMembersModule),
      },
      {
        path: 'analytics',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/analytics/analytics.module').then(m => m.AnalyticsModule),
      },
      {
        path: 'news',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/news/news.module').then(m => m.NewsModule),
      },
      {
        path: 'history',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'settings',
        // canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/settings/settings.module').then(m => m.SettingsModule),
      },
    ],
  },
  {
    path: 'auth',
    component: LayoutAuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/auth/auth.module').then(m => m.AuthModule),
      },
    ],
  },
  {
    path: 'signup',
    component: LayoutPublicComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/auth/auth.module').then(m => m.AuthModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/404',
  },
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: AppPreloader,
    }),
    LayoutsModule,
  ],
  providers: [AppPreloader],
  exports: [RouterModule],
})
export class AppRoutingModule { }
