import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ClaimType } from 'src/app/models/claimsConstant';
import { RoleClaimsDTO } from 'src/app/models/roleClaimsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { RoleService } from 'src/app/services/APIServices/role.service';
import { noWhitespaceValidator } from 'src/app/validators/no-whitespace.validator';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  form: FormGroup
  historyForm: FormArray
  isEditMode: boolean = false
  @Input() roleIdSubject: Subject<string>;
  roleId: string;
  buttonLoading: boolean = false
  get roleControl() { return this.form.controls["roleName"] }

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private roleService: RoleService,
  ) {
    this.generateForm();
  }

  generateForm() {
    this.form = this.fb.group({
      roleName: [null, [Validators.required, noWhitespaceValidator]],
      claimType: this.fb.array([
        this.fb.group({
          claimTypeName: [ClaimType.Contacts],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })

        }),
        this.fb.group({
          claimTypeName: [ClaimType.Task],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.Calendar],
          claimValue : this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.Documents],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.Accounting],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.Cases],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        // this.fb.group({
        //   claimTypeName: [ClaimType.Reports],
        //   claimValue : this.fb.group({
        //     create: [true],
        //     view: [true],
        //     edit: [true],
        //     delete: [true],
        //   })
        // }),
        this.fb.group({
          claimTypeName: [ClaimType.Settings],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.Team],
          claimValue: this.fb.group({
            create: [true],
            view: [true],
            edit: [true],
            delete: [true],
          })
        }),
        // this.fb.group({
        //   claimTypeName: [ClaimType.Analytics],
        //   claimValue : this.fb.group({
        //     create: [true],
        //     view: [true],
        //     edit: [true],
        //     delete: [true],
        //   })
        // }),

        this.fb.group({
          claimTypeName: [ClaimType.History_Case],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Event],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Task],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Contact],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Commission],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Accounting],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
        this.fb.group({
          claimTypeName: [ClaimType.History_Documents],
          claimValue: this.fb.group({
            create: [{ value: false, disabled: true }],
            view: [true],
            edit: [{ value: false, disabled: true }],
            delete: [{ value: false, disabled: true }],
          })
        }),
      ]),

    })

    // this.historyForm = this.fb.array([])
  }
  get claimType() { return this.form.get('claimType') as FormArray }

  getFormGroup(fg) {
    return fg;
  }

  @ViewChild('roleName', { static: true }) roleNameInput: ElementRef;
  ngOnInit(): void {
    this.roleIdSubject.subscribe(res => {
      if (res) {
        this.isEditMode = true;
        this.roleId = res;
        this.roleService.GetClaimsAgainstRole(res).subscribe(x => {
          if (x.isSuccessfull) {
            this.form.patchValue(x.dynamicResult);
          }
        })
      }
      else {
        this.isEditMode = false;
        this.generateForm();
      }

      console.log(this.claimType);
    });

    // fromEvent(this.roleNameInput.nativeElement, 'keyup').pipe(debounceTime(500)).subscribe(res => {
    //   this.checkRole();
    // })

  }


  handleSubmit(formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return
    }
    this.buttonLoading = true
    // this.checkRole();
    var data = this.form.value as RoleClaimsDTO;
    if (this.isEditMode) {
      this.editRole(data, formDirective);
    }
    else {
      this.addRole(data, formDirective);
    }
  }

  addRole(data, formDirective: FormGroupDirective) {
    this.roleService.CreateRoleWithClaims(data).subscribe(res => {
      this.buttonLoading = false
      if (res.isSuccessfull) {
        formDirective.resetForm()
        this._notification.success("Role Added Successfully");
        this.roleService.GetAllRoles();
      } else {
        this._notification.error("Error Occurred")
      }
    })
  }

  editRole(data, formDirective: FormGroupDirective) {
    this.roleService.UpdateRoleWithClaims(this.roleId, data).subscribe(res => {
      this.buttonLoading = false
      if (res.isSuccessfull) {
        formDirective.resetForm()
        this._notification.success("Role Updated Successfully");
        this.roleService.GetAllRoles();
      } else {
        this._notification.error("Error Occurred")
      }
    })
  }

  clickSwitch(fg) {
    var isCreateEnabled = fg.controls['claimValue'].controls['create'].value;
    var isEditEnabled = fg.controls['claimValue'].controls['edit'].value;
    var isDeleteEnabled = fg.controls['claimValue'].controls['delete'].value;
    if (isCreateEnabled) {
      fg.controls['claimValue'].controls['view'].setValue(true);
    }
    if (isEditEnabled) {
      fg.controls['claimValue'].controls['view'].setValue(true);
    }
    if (isDeleteEnabled) {
      fg.controls['claimValue'].controls['view'].setValue(true);
    }

    if (!isCreateEnabled && !isEditEnabled && !isDeleteEnabled) {
      fg.controls['claimValue'].controls['view'].setValue(false);
    }
  }

  clickViewSwitch(fg: FormArray) {
    let isViewEnabled = fg.controls['claimValue'].controls['view'].value;
    if (!isViewEnabled) {
      if (fg.controls['claimValue'].controls['create'])
        fg.controls['claimValue'].controls['create'].setValue(false);
      if (fg.controls['claimValue'].controls['edit'])
        fg.controls['claimValue'].controls['edit'].setValue(false);
      if (fg.controls['claimValue'].controls['delete'])
        fg.controls['claimValue'].controls['delete'].setValue(false);
    }

  }

  /**
   * 
   * @param value Name of Column to convert from this_name to this name
   */
  convertString(value: string) {
    if (value && value.includes("_"))
      return value.split("_").join(" ")
    else
      return value
  }

  checkRole() {
    let role = this.roleControl.value;
    if (role !== null && role !== "") {
      this.roleService.CheckRole(role).subscribe(res => {
        if (!res.isSuccessfull)
          this.roleControl.setErrors({ 'found': 'Role already exists' })
      });
    }
  }
}
