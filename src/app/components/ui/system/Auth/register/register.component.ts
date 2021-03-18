import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { RegisterDTO } from 'src/app/models/registerDTO'
import { AlertService } from 'src/app/services/alert.service'
import { AuthService } from 'src/app/services/jwt/auth.service'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'cui-system-register',
  templateUrl: './register.component.html',
  styleUrls: ['../style.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup
  loading: boolean = false
  subscriptionName: string = 'Subscription Name'
  noOfDays: number = 7
  params: any;
  submitted: boolean = false
  isVisible: boolean = false


  constructor(private fb: FormBuilder, private store: Store<any>, private _router: ActivatedRoute, private _authService: AuthService, private _route: Router, private alert: AlertService) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    }, { updateOn: 'submit' })
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.loading = state.loading
    })
  }

  get email() {
    return this.form.controls.email
  }
  get emailControl() { return this.form.controls["email"] }
  ngOnInit() {
    this.params = this._router.snapshot.queryParams;
    if (this.params && this.params.planid && this.params.planid !== "") {
      this._authService.getSubscriptionPlan(this.params.planid).subscribe(res => {
        if (res.dynamicResult) {
          if (!res.dynamicResult.isEnabled) {
            this._route.navigate(['/auth/login']);
          }
          this.subscriptionName = res.dynamicResult.name + " Plan";
          this.noOfDays = res.dynamicResult.freeDays;
        } else {
          this._route.navigate(['/auth/login']);
        }
      });
    }
  }

  checkEmail() {
    // this.submitted = true
    let email = this.emailControl.value;
    if (email !== null && email !== "") {
      this._authService.CheckEmail(email).subscribe(res => {
        if (!res.isSuccessfull)
          this.emailControl.setErrors({ 'found': 'Email already exists' })
      });
    }
  }

  // for terms of conditions modal 

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    this.submitted = true
    if (!this.form.valid) {
      return
    }
    let email = this.emailControl.value;
    if (email !== null && email !== "") {
      this._authService.CheckEmail(email).subscribe(res => {
        if (!res.isSuccessfull)
          this.emailControl.setErrors({ 'found': 'Email already exists' })
        else {

          this.loading = true
          let data = this.form.value as RegisterDTO;
          data.planId = this.params.planid;
          this._authService.registerUsingEmail(data).subscribe(res => {
            this.loading = false

            if (res.isSuccessfull) {
              this.submitted = true
              this._route.navigate(['/signup/verify-email'], { queryParams: { userId: res.dynamicResult.userId, planId: res.dynamicResult.planId } });
            } else {
              this.alert.error("Something went wrong")
            }
          });
        }
      });
    }

  }
}
