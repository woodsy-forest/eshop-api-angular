import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';

//Conponents
import { DiscountComponent } from './discount.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { DiscountService } from './discount.service';

//Page Title
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [
    DiscountComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [
    Title,
    DiscountService
  ]
})
export class DiscountModule { }
