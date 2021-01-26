import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'reset-password-page',
  templateUrl: './reset-password-page.component.html'
  })
export class ResetPasswordPageComponent  implements OnInit { 

    public token: any = null;
    public ShowLoading = false;
    public changePasswordNewPassword: string = '';

    constructor (
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: any,
        private route: ActivatedRoute,
        private authService: AuthService,
        private accountsService: AccountService) {
    
      }
    
      ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Account Api - Reset Password");

        this.token = this.route.snapshot.paramMap.get('token');

        if (environment.debug_mode) {
            console.log("ResetPasswordPageComponent, token: " + this.token);
        }
        if (!isPlatformServer(this.platformId)) {
            if (!this.token) {
              alert("Reset Password Page must have a Token in the url.");
              return;
            }
        }
        else {
          if (environment.debug_mode) {
            console.log("ResetPasswordPageComponent, ngOnInit(): app running on the server, skip alert for now.");
          }
        }
        
      }

      ChangePassword(): void {

        //set the token
        this.authService.saveToken(this.token);

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