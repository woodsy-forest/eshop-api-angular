import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryProvinceRoutingModule } from './country-province-routing.module';

//Conponents
import { CountryProvinceComponent } from './country-province.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { CountryProvinceService } from './country-province.service'

//Page Title
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [
    CountryProvinceComponent
  ],
  imports: [
    CommonModule,
    CountryProvinceRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [
    Title,
    CountryProvinceService
  ]
})
export class CountryProvinceModule { }
