import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeRoutingModule } from './attribute-routing.module';

//Conponents
import { AttributeComponent } from './attribute.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { AttributeService } from './attribute.service';

//Page Title
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AttributeComponent
  ],
  imports: [
    CommonModule,
    AttributeRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [
    Title,
    AttributeService
  ]
})
export class AttributeModule { }
