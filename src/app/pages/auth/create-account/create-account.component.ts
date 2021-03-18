import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RegisterDTO } from 'src/app/models/registerDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  form: FormGroup
  loading: boolean = false
  planId: string;
  submitted: boolean = false
  isVisible:boolean = false

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private authService: AuthService, private route: ActivatedRoute, private notification: AlertService, private router: Router
  ) {
    this.form = fb.group({
      id: [0],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null],
      password: [null, [Validators.required, Validators.min(8), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]],
      repeatPassword: [null, [Validators.required, Validators.min(8), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]],
      phone: [null, Validators.required]
    }, {
      validator: MustMatch('password', 'repeatPassword')
    });
  }

  get firstName() { return this.form.get('firstName') }
  get lastName() { return this.form.get('lastName') }
  get password() { return this.form.get('password') }
  get confirmPass() { return this.form.get('repeatPassword') }
  get phoneNo() { return this.form.get('phone') }

  ngOnInit(): void {
    let userId = this.route.snapshot.queryParams['userid'];
    let token = this.route.snapshot.queryParams['token'];
    this.planId = this.route.snapshot.queryParams['planid'];
    if (userId && token && this.planId) {
      this.authService.verifyEmail(userId, token, this.planId).subscribe(res => {
        if (res.isSuccessfull) {

          if (!res.dynamicResult.isEmailVerified) {
            this.router.navigate(['/signup/verify-email'], { queryParams: { userId: res.dynamicResult.userId, planId: res.dynamicResult.planId } });
          }

          else if (res.dynamicResult.isSignupCompleted) {
            this.router.navigate(['/auth/login']);
          }

          this.form.patchValue(res.dynamicResult);

          // this.notification.success(res.message);
        }
        else {
          this.notification.error("Something went wrong");
        }
      });
    }
  }

  submitForm() {
    this.submitted = true

    if (this.form.valid) {
      this.loading = true
      let data = this.form.value as RegisterDTO;
      data.planId = this.planId;
      this.authService.register(data).subscribe(res => {
        this.loading = false

        if (res.isSuccessfull) {
          this.authService.login(data.email, data.password, false)
            .pipe(first())
            .subscribe(
              data => {
                this.submitted = false
                this.notification.success("Account Created Successfully");
                this.router.navigate(['/home']);
              },
              error => {
                this.notification.success("Account Created Successfully, Please Sign in");
                this.router.navigate(['/auth/login']);
              })
        } else {
          this.notification.error("Something went wrong")
        }
      });

    }
  }

  // for terms of conditions modal 
  showModal(): void{
    this.isVisible = true;
  }

  handleCancel():void{
    this.isVisible = false;
  }


}
