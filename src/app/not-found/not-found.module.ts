import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { FlexLayoutModule } from '@angular/flex-layout';
//Page Title
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    NotFoundRoutingModule,
    FlexLayoutModule
  ],
  providers: [Title]
})
export class NotFoundModule { }
