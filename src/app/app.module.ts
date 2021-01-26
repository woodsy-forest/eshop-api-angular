import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../app/material.module';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { AuthService } from '../services/auth.service';
import { AuthMsgService } from '../services/auth-msg.service';
import { PictureCommonService } from '../services/picture-common.service';
import { StatusService } from '../services/status.service';
import { ProductCommonService } from '../services/product-common.service';
import { CategoryCommonService } from '../services/category-common.service';
import { AttributeCommonService } from '../services/attribute-common.service';
import { ShoppingCartCommonService } from '../services/shopping-cart-common.service';
import { CustomerCommonService } from '../services/customer-common.service';
import { CountryCommonService } from '../services/country-common.service';
import { StateProvinceCommonService } from '../services/state-province-common.service';
import { OrderCommonService } from '../services/order-common.service';

//Interseptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterseptorService } from '../services/auth-interseptor.service';

//Drag & Drop
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [
    AuthService,
    AuthMsgService,
    PictureCommonService,
    StatusService,
    ProductCommonService,
    CategoryCommonService,
    AttributeCommonService,
    ShoppingCartCommonService,
    CustomerCommonService,
    CountryCommonService,
    StateProvinceCommonService,
    OrderCommonService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterseptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
