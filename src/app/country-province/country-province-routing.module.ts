import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryProvinceComponent } from './country-province.component';

const routes: Routes = [
  { path: '', component: CountryProvinceComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryProvinceRoutingModule { }
