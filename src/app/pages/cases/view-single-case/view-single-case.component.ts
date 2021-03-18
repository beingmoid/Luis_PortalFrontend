import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CaseUserDTO } from 'src/app/models/caseUserDTO';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { PermissionService } from 'src/app/services/permission.service';
@Component({
  selector: 'app-view-single-case',
  templateUrl: './view-single-case.component.html',
  styleUrls: ['./view-single-case.component.scss']
})
export class ViewSingleCaseComponent implements OnInit {

  userData: CaseUserDTO;
  contactClientIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  caseId = 0;
  caseNumber = 0;

  constructor(
    private _router: Router,
    private _caseService: CaseService,
    public _permissionService: PermissionService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.caseId = +params['caseId'] || 0;
    

    });
    // redirect if caseID is null or undefined
    if (!this.caseId) {
      this._router.navigate(['/cases'])
    } else {
      this._caseService.caseUserDetailObserver$.subscribe(res => {
        if (res) {

          this.userData = res;
          this.contactClientIdSubject.next(this.userData.id);
        }
      })
      this._caseService.getCaseUserDetails(this.caseId);
    }
  }

}
