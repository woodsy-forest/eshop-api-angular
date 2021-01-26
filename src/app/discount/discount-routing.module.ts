import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountComponent } from './discount.component';

const routes: Routes = [
  { path: '', component: DiscountComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
