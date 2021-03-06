import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { AuthRouterModule } from './auth-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SystemModule } from 'src/app/components/ui/system/system.module'

// system pages
import { LoginPage } from './login/login.component'
import { RegisterPage } from './register/register.component'
import { LockscreenPage } from './lockscreen/lockscreen.component'
import { ForgotPasswordPage } from './forgot-password/forgot-password.component'
import { Error500Page } from './500/500.component'
import { Error404Page } from './404/404.component'
import { NewPasswordComponent } from './new-password/new-password.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const COMPONENTS = [
  LoginPage,
  RegisterPage,
  LockscreenPage,
  ForgotPasswordPage,
  Error500Page,
  Error404Page,
  NewPasswordComponent
]

@NgModule({
  imports: [SharedModule, AuthRouterModule, FormsModule, ReactiveFormsModule, SystemModule],
  declarations: [...COMPONENTS, NewPasswordComponent, VerifyemailComponent, CreateAccountComponent],
})
export class AuthModule { }
