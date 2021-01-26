import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { AuthMsgService } from '../../services/auth-msg.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html'
  })
export class ChangePasswordComponent  implements OnInit { 

  public ShowLoading = false;
  public changePasswordNewPassword: string = '';


  constructor (
    private titleService: Title,
    private accountsService: AccountService,
    private authService: AuthService,
    private authMsgService: AuthMsgService) {

  }

  ngOnInit(): void {

    this.titleService.setTitle("eShop Api Documentation: Account Api - Change Password");

  }

  ChangePassword(): void {

    this.ShowLoading = true;
    
    // --------------------------------------------
    // Change Password - begin
    // --------------------------------------------

    this.accountsService.ChangePassword(this.changePasswordNewPassword)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("response: " + JSON.stringify(response));
          }

          alert("INFORMATION: The password has been changed.");
        
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
