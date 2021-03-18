import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaseNoteDTO } from 'src/app/models/caseNoteDTO';
import { AlertService } from 'src/app/services/alert.service';
import { NoteService } from 'src/app/services/APIServices/note.service';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss']
})
export class NotesTabComponent implements OnInit, OnDestroy {

  dataList: CaseNoteDTO[] = [];
  isVisible: boolean = false;
  modalTitle: string = "Add Note";
  isEditMode: boolean = false;
  noteForm: FormGroup;
  caseId: number = 0;

  caseNotesSubject: Subscription;

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _noteService: NoteService
  ) {
    this.noteForm = fb.group({
      id: [0],
      createdDate: [new Date(), Validators.required],
      note: ['', Validators.required],
      sendUpdateToCustomer: [false],
    }, { updateOn: 'submit' })
  }

  get f() { return this.noteForm.controls }
  ngOnInit(): void {
    this.caseId = history.state.caseId;
    if (this.caseId && this.caseId !== 0) {
      this.caseNotesSubject = this._noteService.caseNotesObserver$.subscribe(res => {
        if (res)
          this.dataList = res;
      });
      this._noteService.getCaseNotesByCase(this.caseId);
    }
  }

  ngOnDestroy() {
    if (this.caseNotesSubject) this.caseNotesSubject.unsubscribe();
  }

  handleCancel() {
    this.isVisible = false
  }

  showModal() {
    this.noteForm.reset();
    this.noteForm.get('createdDate').setValue(new Date());
    this.noteForm.get('id').setValue(0);
    this.isEditMode = false;
    this.isVisible = true;
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.noteForm.valid) {
      let data = this.noteForm.value as CaseNoteDTO;
      data.caseId = this.caseId;
      if (this.isEditMode) {
        this._noteService.updateCaseNote(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Note Updated successfully");
            this._noteService.getCaseNotesByCase(this.caseId);
            formDirective.resetForm();
            // this.noteForm.clearValidators();
          } else {
            this._notification.error("Error Updating Note");
          }
        });
      }
      else {
        this._noteService.saveCaseNote(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Note saved successfully");
            this._noteService.getCaseNotesByCase(this.caseId);
            formDirective.resetForm()
            // this.noteForm.reset();
            // this.noteForm.clearValidators();
          } else {
            this._notification.success("Error saving note");
          }
        });
      }
      this.isVisible = false
    }
  }

  editCaseNote(data) {
    this.isEditMode = true;
    this.isVisible = true;
    this._noteService.getCaseNoteById(data.id).subscribe(res => {
      this.noteForm.patchValue(res.dynamicResult);
    });
  }

  deleteCaseNote(data) {
    this._notification.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._noteService.deleteCaseNote(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Note Deleted successfully");
            this._noteService.getCaseNotesByCase(this.caseId);
          }
          else {
            this._notification.success("Error deleting note");
          }
        });
      } else {
        return
      }
    })
  }
}
