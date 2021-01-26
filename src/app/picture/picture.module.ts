import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PictureRoutingModule } from './picture-routing.module';

//Conponents
import { PictureComponent } from './picture.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { PictureService } from './picture.service';

//Page Title
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [
    PictureComponent
  ],
  imports: [
    CommonModule,
    PictureRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [
    Title,
    PictureService
  ]
})
export class PictureModule { }
