import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDTO } from 'src/app/models/formDTO';
import { FormFilterDTO } from 'src/app/models/formFilterDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { FormService } from 'src/app/services/APIServices/form.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  search: string
  isVisible: boolean = false
  isEditMode: boolean = false
  caseId: number
  FormsForm: FormGroup
  checked = true;
  languages: LookUpDTO[] = [];
  categories: LookUpDTO[] = [];
  forms: FormDTO[] = [];
  categoryForms: FormDTO[] = [];
  downloadList: FormDTO[] = [];
  selectedCategoryName = "Select Category";

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _lookupService: LookupService,
    private _formService: FormService
  ) {
    this.FormsForm = fb.group({
      categoryId: [null],
      languageId: [null],
      searchCodeName: [null],
    })
  }
  get fields() { return this.FormsForm.controls }

  ngOnInit(): void {
    this._lookupService.getLanguages();
    this._lookupService.getCategories();

    this._lookupService.languagesObserver$.subscribe(res => {
      if (res)
        this.languages = res;
    });

    this._lookupService.categoriesObserver$.subscribe(res => {
      if (res)
        this.categories = res;
    });
    this.FormsForm.get('searchCodeName').valueChanges.subscribe(val => {
      if (val) {
        this.forms = []

        if (this.categoryForms.length > 0) {
          this.categoryForms.forEach(e => {
            for (let [key, value] of Object.entries(e)) {
              // console.log(e);

              if ((e[key] === 'formName' || e[key] === 'formCode') && e[key].includes(val)) {
                this.forms.push(e)
              }
            }
          })
        }
      }
    })
  }

  onSubmit() {

    if (this.FormsForm.value.categoryId || this.FormsForm.value.languageId || this.FormsForm.value.searchCodeName) {
      this._formService.GetFilteredForms(this.FormsForm.value).subscribe(res => {
        if (res.isSuccessfull) {
          this.forms = res.dynamicResult;
        }
      })
    }
    else {
      this._notification.info('Please apply some filter')
    }

  }

  changeCategory() {
    let id = this.FormsForm.get("categoryId").value
    this._formService.GetFormsByCategoryId(id).subscribe(res => {
      if (res.isSuccessfull) {
        this.selectedCategoryName = this.categories.find(x => x.key == id).value;
        this.categoryForms = res.dynamicResult;
      }
    })
  }

  downlaod() {
    this.downloadList = [];
    this.forms.forEach(x => {
      if (x.isSelected) {
        this.downloadList.push(x);
      }
    })
    this.categoryForms.forEach(x => {
      if (x.isSelected) {
        this.downloadList.push(x);
      }
    })
    if (this.downloadList.length == 0) {
      this._notification.info("Please select atleast one form");
      return;
    }
    this.downloadAll();
  }

  downloadAll() {
    this.downloadList.forEach(element => {
      window.open(element.formBlobURI, '_blank');
      // saveAs(element.formBlobURI, element.formBlobName);
    });
  }
}
