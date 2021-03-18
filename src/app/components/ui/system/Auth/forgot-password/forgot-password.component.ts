import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/jwt/auth.service';

@Component({
  selector: 'cui-system-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../style.component.scss'],
})
export class ForgotPasswordComponent {
  form: FormGroup
  submitted: boolean = false
  loading: boolean = false

  constructor(private _authService: AuthService, private fb: FormBuilder, private _router: Router, private _alertService: AlertService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    }, {updateOn: 'submit'})
  }

  get email() {
    return this.form.get('email') as FormGroup
  }
  submitForm() {
    this.submitted = true
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    
    if (this.form.valid) {
      this.loading = true
      this._authService.generatePasswordResetToken(this.form.get("email").value).subscribe(res => {
        if (res.isSuccessfull) {
          this.submitted = false
          this.loading = false
          this._alertService.success("Password reset link sent via email.");
          this._router.navigate(['/auth/login']);
        } else {
          this.loading = false
          this._alertService.error("Email not exists.");
        }
      });
    }
  }
}
