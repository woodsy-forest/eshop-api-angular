import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingCartComponent } from './shopping-cart-component';
import { InvoiceOrderComponent } from './invoice-order.component';
import { InvoiceCartComponent } from './invoice-cart.component';

const routes: Routes = [
  { path: '', component: ShoppingCartComponent },
  { path: 'invoice/:id', component: InvoiceOrderComponent },
  { path: 'invoice', component: InvoiceCartComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
