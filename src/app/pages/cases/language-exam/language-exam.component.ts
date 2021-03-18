import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaseLanguageExamDTO } from 'src/app/models/caseLanguageExamDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-language-exam',
  templateUrl: './language-exam.component.html',
  styleUrls: ['./language-exam.component.scss']
})
export class LanguageExamComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup
  languages: LookUpDTO[] = [];
  ieltsExams: LookUpDTO[] = [];

  languageSubject: Subscription;
  ieltsExamSubject: Subscription;

  constructor(private _lookupService: LookupService, private fb: FormBuilder, private _caseService: CaseService) { }

  get languageExam() { return this.form.get('caseLanguageExams') as FormArray }

  getFormGroup(fg: FormGroup) {
    return fg.controls
  }

  ngOnInit(): void {
    this.languageSubject = this._lookupService.languagesObserver$.subscribe(res => {
      this.languages = res;
    });
    this.ieltsExamSubject = this._lookupService.ieltsExamObserver$.subscribe(res => {
      this.ieltsExams = res;
    });
    this._caseService.caseObserver$.subscribe(res => {
      if (res) {
        let data = res['caseLanguageExams']
        if (this.languageExam.controls && this.languageExam.controls.length > 0) {
          this.languageExam.controls = []
        }
        if (data && data.length > 0) {
          data.forEach(e => {
            this.languageExam.push(this.createFormGroup(e))
          });
        } else {
          this.languageExam.push(this.createFormGroup(null))
        }
      }
    })
  }
  ngOnDestroy() {
    if (this.languageSubject)
      this.languageSubject.unsubscribe();
    if (this.ieltsExamSubject)
      this.ieltsExamSubject.unsubscribe();
  }
  /**
  *
  * @param value Form Value
  */
  createFormGroup(value: CaseLanguageExamDTO): FormGroup {
    return this.fb.group({
      id: [value ? value.id : 0],
      isTakenExam: [value ? value.isTakenExam : false], // dd
      languageId: [value ? value.languageId : ''], // dd
      issueDate: [value ? value.issueDate : ''], // date
      ieltsExamId: [value ? value.ieltsExamId : ''], // dd
      speakingScore: [value ? value.speakingScore : 0, [Validators.min(0)]], // num
      listeningScore: [value ? value.listeningScore : 0, [Validators.min(0)]], // num
      readingScore: [value ? value.readingScore : 0, [Validators.min(0)]], // num
      writingScore: [value ? value.writingScore : 0, [Validators.min(0)]], // num
      isOtherLanguageResult: [value ? value.isOtherLanguageResult : false], // dd
    })
  }

  addFormGroup() {
    this.languageExam.push(this.createFormGroup(null))
    // if (this.form.valid) {

    // } else
    //   this._notification.error("Form is Invalid, please fill the required fields")
  }

  removeFormGroup(index: number) {
    this.languageExam.removeAt(index);
  }
}
