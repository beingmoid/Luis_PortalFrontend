import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { first } from 'rxjs/operators'
import { AlertService } from 'src/app/services/alert.service'
import { AuthService } from 'src/app/services/jwt/auth.service'
import * as Reducers from 'src/app/store/reducers'
import * as SettingsActions from 'src/app/store/settings/actions'

@Component({
  selector: 'cui-system-login',
  templateUrl: './login.component.html',
  styleUrls: ['../style.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup
  logo: String
  authProvider: string = 'jwt'
  loading: boolean = false
  returnUrl: string;

  submitted: boolean = false

  constructor(private authService: AuthService, private fb: FormBuilder, private store: Store<any>, private route: ActivatedRoute, private router: Router, private notification: AlertService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required],
      rememberMe: [false]
    }, {updateOn: 'submit'})
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.logo = state.logo
      this.authProvider = state.authProvider
    })
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email() {
    return this.form.controls.email
  }
  get password() {
    return this.form.controls.password
  }
  get rememberMe() {
    return this.form.controls.rememberMe
  }

  submitForm(): void {
    this.submitted = true
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.email.invalid || this.password.invalid) {
      return
    }
    
    this.loading = true
    const payload = {
      email: this.email.value,
      password: this.password.value,
      rememberMe: this.rememberMe.value
    }
    this.authService.login(payload.email, payload.password, payload.rememberMe)
      .pipe(first())
      .subscribe(
        data => {
          this.submitted = false
          this.loading = false
        },
        error => {
          this.loading = false
        })
  }

  setProvider(authProvider) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        authProvider,
      }),
    )
  }
}
