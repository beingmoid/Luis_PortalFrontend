import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterDTO } from 'src/app/models/registerDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/jwt/auth.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  userId: string = "";
  planId: string = "";
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private alertService: AlertService) { 
    this.userId = this.route.snapshot.queryParams['userId'];
    this.planId = this.route.snapshot.queryParams['planId'];
    this.authService.isEmailVerified(this.userId).subscribe(res => {
      if(res.isSuccessfull && res.dynamicResult === true) {
        this.router.navigate(["/auth/login"]);
      } 
    })
  }

  ngOnInit(): void {
    if (!this.userId && !this.planId) {
      this.router.navigate(["/auth/login"]);
    }
    else {
      this.authService.verifyUserAndPlan(this.userId, this.planId).subscribe(res => {
        if (!res.isSuccessfull) {
          this.router.navigate(["/auth/login"]);
        }
      });
    }
  }

  resendVerificationEmail() {
    let data = new RegisterDTO();
    data.userId = this.userId;
    data.planId = this.planId;
    this.authService.resendVerificationEmail(data).subscribe(res => {
      if (res.isSuccessfull) {
        this.alertService.success("Verification Email Sent");
      }
      else {
        this.alertService.error("Error while sending Verification Email");
      }
    });
  }
}
