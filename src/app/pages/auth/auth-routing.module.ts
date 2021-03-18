import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// system pages
import { LoginPage } from 'src/app/pages/auth/login/login.component'
import { RegisterPage } from 'src/app/pages/auth/register/register.component'
import { LockscreenPage } from 'src/app/pages/auth/lockscreen/lockscreen.component'
import { ForgotPasswordPage } from 'src/app/pages/auth/forgot-password/forgot-password.component'
import { Error500Page } from 'src/app/pages/auth/500/500.component'
import { Error404Page } from 'src/app/pages/auth/404/404.component'
import { NewPasswordComponent } from './new-password/new-password.component'
import { VerifyemailComponent } from './verifyemail/verifyemail.component'
import { CreateAccountComponent } from './create-account/create-account.component'
import { PreAuthGuard } from 'src/app/components/ui/system/Guard/pre-auth.guard'

const routes: Routes = [
  {
    path: 'login',
    canActivate: [PreAuthGuard],
    component: LoginPage,
    data: { title: 'Login' },
  },
  {
    path: 'register',
    canActivate: [PreAuthGuard],
    component: RegisterPage,
    data: { title: 'Sign Up' },
  },
  {
    path: 'locksreen',
    component: LockscreenPage,
    data: { title: 'Lockscreen' },
  },
  {
    path: 'forgot-password',
    canActivate: [PreAuthGuard],
    component: ForgotPasswordPage,
    data: { title: 'Forgot Password' },
  },
  {
    path: '404',
    component: Error404Page,
    data: { title: 'Error 404' },
  },
  {
    path: '500',
    component: Error500Page,
    data: { title: 'Error 500' },
  },
  {
    path: 'new-password',
    canActivate: [PreAuthGuard],
    component: NewPasswordComponent,
    data: { title: 'New Password' },
  },
  {
    path: 'verify-email',
    component: VerifyemailComponent,
    data: { title: 'Verify Email' },
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
    data: { title: 'Create Account' },
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class AuthRouterModule { }
