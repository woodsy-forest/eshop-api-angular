import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';

//Conponents
import { CategoryComponent } from './category.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { CategoryService } from './category.service';
import { PictureCommonService } from '../../services/picture-common.service';

//Page Title
import { Title } from '@angular/platform-browser';


@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [
    Title,
    CategoryService,
    PictureCommonService
  ]
})
export class CategoryModule { }
