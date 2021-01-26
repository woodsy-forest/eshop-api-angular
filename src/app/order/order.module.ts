import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from '../material.module';
import { OrderNoteListDialog } from './order-note-list.dialog';
import { OrderStatusListDialog } from './order-status-list.dialog';

//Page Title
import { Title } from '@angular/platform-browser';

//Services
import { OrderService } from './order.service';

@NgModule({
  declarations: [
    OrderComponent,
    OrderNoteListDialog,
    OrderStatusListDialog
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MaterialModule
  ],
  entryComponents: [
    OrderNoteListDialog,
    OrderStatusListDialog
  ],
  providers: [
    Title,
    OrderService,
    DatePipe
  ]
})
export class OrderModule { }
