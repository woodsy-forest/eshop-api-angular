import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html'
  })
export class ResetPasswordComponent  implements OnInit { 
 
  public ShowLoading = false;
  public resetPasswordCustomerId: number = -1


  constructor (
    private titleService: Title,
    private accountsService: AccountService) {

  }

  ngOnInit(): void {

    this.titleService.setTitle("Shop Api Documentation: Account Api - Reset Password");

  }

  ResetPassword(): void {

    this.ShowLoading = true;
    
    // --------------------------------------------
    // Reset Password - begin
    // --------------------------------------------

    this.accountsService.ResetPassword(this.resetPasswordCustomerId)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("response: " + JSON.stringify(response));
          }

          alert("INFORMATION: The reset password email has been sent to the customer.");
        
          this.ShowLoading = false;

        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });
    // --------------------------------------------
    // Change Password - end
    // --------------------------------------------


  }

}
