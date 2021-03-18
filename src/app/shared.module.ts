import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// basic acl
import { ACLComponent } from 'src/app/components/ui/system/ACL/acl.component'

// antd components module
import { AntdModule } from 'src/app/antd.module'

import { MaterialModule } from './material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { TwoDigitDecimalNumberDirective } from './directives/two-decimals.directive';
import { MomentModule } from 'ngx-moment';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { AppDateFormatPipe } from './pipes/date-format.pipe'
import { CopypasteBlockDirective } from './directives/copypaste-block.directive';

const MODULES = [
  CommonModule,
  RouterModule,
  AntdModule,
  TranslateModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  NgbModule,
  NgxMaterialTimepickerModule,
  MomentModule,
  NgxTrimDirectiveModule,
  NgxMatIntlTelInputModule,
]


@NgModule({
  imports: [...MODULES],
  declarations: [ACLComponent, PhoneMaskDirective, OnlyNumbersDirective, TwoDigitDecimalNumberDirective, AppDateFormatPipe, CopypasteBlockDirective],
  exports: [...MODULES, PhoneMaskDirective, OnlyNumbersDirective, TwoDigitDecimalNumberDirective, AppDateFormatPipe , CopypasteBlockDirective],
})
export class SharedModule { }
