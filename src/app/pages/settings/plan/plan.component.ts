import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { Subscription } from 'rxjs';
import { PaymentHistoryDTO } from 'src/app/models/paymentHistoryDTO';
import { PlanDTO } from 'src/app/models/planDTO';
import { UpgradePlanDTO } from 'src/app/models/upgradePlanDTO';
import { UserDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentHistoryService } from 'src/app/services/APIServices/payment-history.service';
import { PlanService } from 'src/app/services/APIServices/plan.service';
import { StripeService } from 'src/app/services/APIServices/stripe.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class PlanComponent implements OnInit, OnDestroy, AfterViewInit {
  planToUpgrade: PlanDTO = new PlanDTO();
  amountPayable: number;
  usersToRegister: number;
  minUserAllowed: number;
  userDetail: UserDTO;
  plans: PlanDTO[] = [];
  plansSubject: Subscription;
  userSubject: Subscription;
  isVisible: boolean = false;
  updateBilliniSVisible: boolean = false;
  isVisibleUpdateSubscription: boolean = false;
  stripePublishKey: string = "";
  selectedPlan: number;
  planType: string = 'monthly';
  subscribedPlan: PlanDTO = new PlanDTO();
  monthlyPlans: PlanDTO[] = [];
  yearlyPlans: PlanDTO[] = [];
  cardDetails: any;
  loading: boolean = false;
  isOtherPlan: boolean = false;

  // stripe
  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('cardElementToUpdate') cardElementToUpdate: ElementRef;
  stripe: any;
  card: any;
  cardToUpdate: any;
  cardErrors: any;
  cardErrorsToUpdate: any;

  constructor(private _planService: PlanService,
    private _authService: AuthService,
    private _alertService: AlertService,
    private stripeService: AngularStripeService,
    private _stripeService: StripeService,
    private _paymentHistoryService: PaymentHistoryService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private _router: Router,
    private _permissionService: PermissionService,
  ) {
  }

  ngOnInit(): void {

    if (this._permissionService.getRole() !== 'CompanyAdmin') {
      this._router.navigate(['/home'])
    }

    this._alertService.topAlertMessageSubject$.next(false);

    this.userSubject = this._authService.user.subscribe(user => {
      if (user) {
        this.plans = [];
        this._planService.getPlans();
        this.userDetail = user;
        this.plansSubject = this._planService.plansObserver$.subscribe(res => {
          if (res) {
            this.plans = [];
            this.monthlyPlans = [];
            this.yearlyPlans = [];
            res.forEach(r => {
              r["selectedFreePlan"] = false;
              r["purchasedPlan"] = false;
              r["otherPlan"] = false;
              if (r.id == user.planId && (user.isValidPlan || user.isFreePlan || user.isPaidPlan) && user.currentPlanStatus !== 'Canceled') {
                this.subscribedPlan = r;
                if (user.isFreePlan) {
                  r["selectedFreePlan"] = true;
                  this.subscribedPlan.isFreePlan = true;
                }
                else {
                  r["purchasedPlan"] = true;
                  this.subscribedPlan.isFreePlan = false;
                  if (user.daysLeft < 0) {
                    r["purchasedPlan"] = false;
                    r["selectedFreePlan"] = true;
                  }

                  if (!r.isRecurring && user.daysLeft <= 0) {
                    r["purchasedPlan"] = false;
                    r["otherPlan"] = true;
                    this.isOtherPlan = true;
                  }

                }
                this.plans.push(r);
              } else {
                if (r.isEnabled) {
                  this.plans.push(r);
                }
                r["otherPlan"] = true;
              }
              
            })
            this.plans.forEach(element => {
              if (element.billingPlanName == 'Monthly') {
                this.monthlyPlans.push(element);
              } else {
                this.yearlyPlans.push(element);
              }
            });

          }
        });
      }
    });

    if (!this._planService.plans)
      this._planService.getPlans();

    if (!this._authService.userValue)
      this._authService.currentAccount();
  }

  ngAfterViewInit() {

  }

  onNumberOfUsersChange(event, userCount: number = 0) {
    let users;
    if (event) {
      users = parseInt(event);
    } else {
      users = userCount;
    }
    if (users > this.planToUpgrade.freeUsersAllowed) {
      let paidUsersAmount = (users - this.planToUpgrade.freeUsersAllowed) * this.planToUpgrade.pricePerUser;
      if (!this.planToUpgrade.isRecurring) {
        if (this.subscribedPlan.id == this.planToUpgrade.id) {
          this.amountPayable = (this.usersToRegister - this.minUserAllowed) * this.planToUpgrade.pricePerUser;
        }
        else {
          this.amountPayable = paidUsersAmount + this.planToUpgrade.pricePerUser;
        }
      } else {
        this.amountPayable = paidUsersAmount + this.planToUpgrade.pricePerUser;
      }
    }
    else {
      if (!this.planToUpgrade.isRecurring) {
        if (this.subscribedPlan.id == this.planToUpgrade.id) {
          this.amountPayable = 0;
        } else {
          this.amountPayable = this.planToUpgrade.pricePerUser;
        }
      } else {
        this.amountPayable = this.planToUpgrade.pricePerUser;
      }
    }
  }

  ngOnDestroy() {
    this._alertService.topAlertMessageSubject$.next(true);
    if (this.plansSubject) this.plansSubject.unsubscribe();
    if (this.userSubject) this.userSubject.unsubscribe();
  }

  upgradePlan(plan: PlanDTO) {
    if (!plan.id) {
      this._alertService.info("Please select plan from list below");
      return;
    }
    this.selectedPlan = plan.id;
    let message = "";
    if (this.userDetail.planId == 0 || this.userDetail.planId == plan.id)
      message = "You want to upgrade current plan?"
    else {
      if (this.userDetail.isPaidPlan)
        message = "You want to change your plan? you will be unsubscribed from previously subscribed plan."
      else
        message = "You want to change your plan?"
    }
    this.planToUpgrade = plan;
    this.amountPayable = this.planToUpgrade.pricePerUser;
    this.usersToRegister = this.planToUpgrade.freeUsersAllowed > this.userDetail.numberOfUsersPurchased ? this.planToUpgrade.freeUsersAllowed : this.userDetail.numberOfUsersPurchased;
    this.minUserAllowed = this.usersToRegister;
    this.onNumberOfUsersChange(null, this.minUserAllowed);
    this._alertService.confirm("Are you sure?", message).then(async result => {
      if (result.isConfirmed) {
        this._stripeService.getStripePublishKey().subscribe(res => {
          this.stripeService.setPublishableKey(res.dynamicResult).then(
            stripe => {
              this.stripe = stripe;
              const elements = stripe.elements();
              this.card = elements.create('card');
              this.card.mount(this.cardElement.nativeElement);
              this.card.addEventListener('change', ({ error }) => {
                this.cardErrors = error && error.message;
              });
              this._authService.getUserCardDetails().subscribe(res => {
                if (res.dynamicResult) {
                  this.cardDetails = res.dynamicResult;
                }
                this.isVisible = true;
              })
            });
        });
      } else {
        return
      }
    })
  }

  handleCancel() {
    this.isVisible = false;
    this.updateBilliniSVisible = false;
    this.isVisibleUpdateSubscription = false;
    if (this.card)
      this.card.destroy();
    if (this.cardToUpdate)
      this.cardToUpdate.destroy();
  }

  async handleSubmit() {
    this.loading = true;
    const { token, error } = await this.stripe.createToken(this.card);
    if (!this.cardDetails && error) {
      this._alertService.error(error.message);
      this.loading = false;
    } else {
      let data = new UpgradePlanDTO();
      data.stripeToken = this.cardDetails ? "" : token.id;
      data.userId = this.userDetail.id;
      data.planId = this.selectedPlan;
      data.amountPayable = this.amountPayable;
      data.currency = this.planToUpgrade.currency;
      data.numberOfUsers = this.minUserAllowed ? this.minUserAllowed < this.planToUpgrade.freeUsersAllowed ? this.planToUpgrade.freeUsersAllowed : this.usersToRegister : this.planToUpgrade.freeUsersAllowed;
      if (data.numberOfUsers.toString() == "")
        data.numberOfUsers = this.minUserAllowed

      this._planService.upgradePlan(data).subscribe(res => {
        if (res.isSuccessfull) {
          this._alertService.success("Successfully purchased selected plan");
          this._paymentHistoryService.getPaymentHistories();
          this._authService.currentAccount();
          this.isVisible = false;
        } else {
          this._alertService.error(res.errorMessage);
        }

        this.loading = false;
      });
    }
  }

  changePlane(plan: string) {
    this.planType = plan;
  }

  cancelSubscription(subscribedPlan: PlanDTO) {
    if (this.userDetail.daysLeft >= 0 && this.userDetail.daysLeft <= 3) {
      this._alertService.confirm("Are you sure?", 'you want cancel current subscription?').then(async result => {
        if (result.isConfirmed) {
          this._planService.cancelSubscriptionPlan(subscribedPlan).subscribe(res => {
            if (res.isSuccessfull) {
              this._authService.currentAccount();
              this._alertService.success("Successfully Unsubscribed from selected plan");
              // this._router.navigate(['/home']);
            }
          });
        } else {
          return
        }
      })
    }
    else {
      this._alertService.error("You can only cancel subscription if there are atleast 3 days left.");
    }
  }

  updateBillingDetails() {
    this._alertService.confirm("Are you sure?", 'you want to change billing details?').then(async result => {
      if (result.isConfirmed) {
        this._stripeService.getStripePublishKey().subscribe(res => {
          this.stripeService.setPublishableKey(res.dynamicResult).then(
            stripe => {
              this.stripe = stripe;
              const elements = stripe.elements();
              this.cardToUpdate = elements.create('card');
              this.cardToUpdate.mount(this.cardElementToUpdate.nativeElement);
              this.cardToUpdate.addEventListener('change', ({ error }) => {
                this.cardErrorsToUpdate = error && error.message;
              });

              this._authService.getUserCardDetails().subscribe(res => {
                if (res.dynamicResult) {
                  this.cardDetails = res.dynamicResult;
                }
                this.updateBilliniSVisible = true;
              })
            });
        });
      } else {
        return
      }
    })
  }

  async handleUpdateBillingSubmit() {
    this.loading = true;
    const { token, error } = await this.stripe.createToken(this.cardToUpdate);
    if (error) {
      this._alertService.error(error.message);
      this.loading = false;
    } else {
      this._planService.updateBillingDetails(token.id).subscribe(res => {
        if (res.isSuccessfull) {
          this._alertService.success("Successfully updated Billing details");
          this.updateBilliniSVisible = false;
        } else {
          this._alertService.error(res.errorMessage);
        }
        this.loading = false;
      });
    }
  }

  updateSubscription(subscription) {
    this.planToUpgrade = subscription;
    this.usersToRegister = this.planToUpgrade.freeUsersAllowed > this.userDetail.numberOfUsersPurchased ? this.planToUpgrade.freeUsersAllowed : this.userDetail.numberOfUsersPurchased;
    this.minUserAllowed = this.usersToRegister;
    this.onNumberOfUsersChange(null, this.minUserAllowed);
    this.isVisibleUpdateSubscription = true;
  }

  handleupdateSubscription() {
    let message = "";
    if (this.usersToRegister.toString() == "" || this.minUserAllowed >= parseInt(this.usersToRegister.toString())) {
      this._alertService.error("Users cannot be less than previously purchased users.");
      return;
    }

    if (!this.planToUpgrade.isRecurring) {
      this.amountPayable = (this.usersToRegister - this.minUserAllowed) * this.planToUpgrade.pricePerUser;
      message = `${this.currencyPipe.transform(this.amountPayable)} will be charged immediately!`;
    }
    else {
      message = `${this.currencyPipe.transform(this.amountPayable)} will be payable from next Recurring Date: ${this.datePipe.transform(this.userDetail.recurringDate)}`;
    }

    this._alertService.confirm("Are you sure?", message).then(async result => {
      if (result.isConfirmed) {
        let numberOfUsers = this.minUserAllowed ? this.minUserAllowed < this.planToUpgrade.freeUsersAllowed ? this.planToUpgrade.freeUsersAllowed : this.usersToRegister : this.planToUpgrade.freeUsersAllowed;
        this._planService.updateSubscription(this.planToUpgrade.id, numberOfUsers).subscribe(res => {
          if (res.isSuccessfull) {
            this.isVisibleUpdateSubscription = false;
            this._alertService.success("Successfully updated Subscription");
            this._authService.currentAccount();
            this._paymentHistoryService.getPaymentHistories();
          }
          else {
            this._alertService.error(res.errorMessage);
          }
        });
      } else {
        return
      }
    })
  }
}