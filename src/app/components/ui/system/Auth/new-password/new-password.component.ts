import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'cui-system-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['../style.component.scss'],

})
export class NewPasswordComponent implements OnInit {
  form: FormGroup
  userId: string = "";
  token: string = "";
  creatingNewPassword: boolean = false;

  submitted: boolean = false
  loading: boolean = false

  constructor(private _authService: AuthService,
    private fb: FormBuilder,
    private _router: Router, private _alertService: AlertService, private _activatedRoute: ActivatedRoute) {
    this.form = fb.group({
      password: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]],
      confirmPassword: ['', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]]
    }, {
      updateOn: 'submit',
      validators: MustMatch('password', 'confirmPassword')
    })
  }
  // get newPassword() { return this.form.get('passsword') }
  // get confirmPass() { return this.form.get('confirmPassword') }
  get f() { return this.form.controls }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(res => {
      this.userId = res.userid;
      this.token = res.token;
      if (!this.token) {
        this.creatingNewPassword = true;
      }
      if (this.creatingNewPassword) {
        if (!this.userId) {
          this._router.navigate(["/auth/login"]);
        }
        else {
          this.CheckIsUserEligibleForNewPswd(this.userId)
        }
      }
      else if (!this.token || !this.userId) {
        this._router.navigate(["/auth/login"]);
      }
    });
  }

  CheckIsUserEligibleForNewPswd(userId) {
    this._authService.CheckIsUserEligibleForNewPswd(userId).subscribe(res => {
      if (!res.isSuccessfull) {
        this._alertService.success(res.message);
        this._router.navigate(["/auth/login"]);
      }
    })
  }

  submitForm() {
    this.submitted = true
    if (this.form.valid) {
      this.loading = true
      if (this.creatingNewPassword) {
        this.createNewPassword();
      }
      else {
        this.resetPassword();
      }
    }
    else{
      return;
    }
  }

  createNewPassword() {
    this._authService.createNewPassword({ userId: this.userId, newPassword: this.form.get("password").value }).subscribe(res => {
      this.loading = false
      if (res.isSuccessfull) {
        this.submitted = false
        this._alertService.success(res.message);
      } else {
        this._alertService.error(res.errorMessage);
      }
      this._authService.logout();
    });
  }

  resetPassword() {
    this._authService.resetPasswordResetWithToken({ userId: this.userId, token: this.token, newPassword: this.form.get("password").value }).subscribe(res => {
      this.loading = false
      
      if (res.isSuccessfull) {
        this.submitted = false
        this._alertService.success(res.message);
      } else {
        this._alertService.error(res.errorMessage)
      }
      this._authService.logout();
    });
  }
}
