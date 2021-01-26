import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';

//Conponents
import { ChangePasswordComponent } from './change-password.component';
import { EmailConfirmationPageComponent } from './email-confirmation-page.component';
import { ResetPasswordPageComponent } from './reset-password-page.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ResetPasswordComponent } from './reset-password.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpinnerModule } from '../spinner/spinner.module';
import { AccountService } from './account.service';
//Page Title
import { Title } from '@angular/platform-browser';
//reCaptcha Module
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    EmailConfirmationPageComponent,
    ResetPasswordPageComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RecaptchaModule
  ],
  providers: [
    Title,
    AccountService
  ]
})
export class AccountModule { }
