import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';

//Conponents
import { ProductListComponent } from './product-list.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
//Services
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';

//Page Title
import { Title } from '@angular/platform-browser';

//Drag & Drop
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MaterialModule } from '../material.module';
import { ProductDetailsDialog } from './product-details.dialog';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailsDialog
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DragDropModule,
    MaterialModule
  ],
  entryComponents: [
    ProductDetailsDialog
  ],
  providers: [
    Title,
    ProductService,
    CategoryService
  ]
})
export class ProductModule { }
