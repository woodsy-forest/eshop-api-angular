import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';

//Conponents
import { ShoppingCartComponent } from './shopping-cart-component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { ShoppingCartCommonService } from '../../services/shopping-cart-common.service';
import { InvoiceOrderComponent } from './invoice-order.component';
import { InvoiceCartComponent } from './invoice-cart.component';
import { ShoppingCartService } from './shopping-cart.service';

//Page Title
import { Title } from '@angular/platform-browser';

//reCaptcha Module
import { RecaptchaModule } from 'ng-recaptcha';

//PayPal
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    InvoiceOrderComponent,
    InvoiceCartComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaModule,
    NgxPayPalModule
  ],
  providers: [
    Title,
    ShoppingCartCommonService,
    ShoppingCartService
  ]
})
export class ShoppingCartModule { }
