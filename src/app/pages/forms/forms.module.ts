import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms/forms.component';
import { SharedModule } from 'src/app/shared.module';
@NgModule({
  declarations: [FormsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsRoutingModule,
  ],
  exports:[
    FormsComponent
  ]
})
export class FormsModule { }
