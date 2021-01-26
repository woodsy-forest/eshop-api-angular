import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';
import { LogoffComponent } from './logoff.component';
import { EmailConfirmationPageComponent } from './email-confirmation-page.component';
import { ResetPasswordPageComponent } from './reset-password-page.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'logoff', component: LogoffComponent },
  { path: 'email-confirmation-page/:id', component: EmailConfirmationPageComponent },
  { path: 'email-confirmation-page', component: EmailConfirmationPageComponent },
  { path: 'reset-password-page/:token', component: ResetPasswordPageComponent },
  { path: 'reset-password-page', component: ResetPasswordPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
