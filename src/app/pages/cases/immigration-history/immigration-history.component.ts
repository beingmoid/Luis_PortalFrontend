import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaseService } from 'src/app/services/APIServices/case.service';

@Component({
  selector: 'app-immigration-history',
  templateUrl: './immigration-history.component.html',
  styleUrls: ['./immigration-history.component.scss']
})
export class ImmigrationHistoryComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor(
    private _caseService: CaseService
  ) { }

  get immigrationHistory() { return this.form.get('caseImmigrationHistory')}
  
  ngOnInit(): void {
    // this._caseService.updateCaseChildsSubject$.subscribe(res => {
    //   if(res) {
    //     this.immigrationHistory.patchValue(res.get('caseImmigrationHistory').value)
    //     console.log(res.get('caseImmigrationHistory').value)
    //   }
    // })
  }

}
