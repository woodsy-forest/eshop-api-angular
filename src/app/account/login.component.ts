import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { ResponseTokenDTO } from '../../DTOs/ResponseTokenDTO';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { AuthMsgService } from '../../services/auth-msg.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
  })

export class LoginComponent  implements OnInit { 

  public ShowLoading = false;
  public loginEmail: string = 'admin@yourstore.com';
  public loginPassword: string = 'admin';
  public loginRememberMe: boolean = false


  constructor (
    private titleService: Title,
    private accountsService: AccountService,
    private authService: AuthService,
    private router: Router,
    private authMsgService: AuthMsgService) {

  }

  ngOnInit(): void {

    this.titleService.setTitle("eShop Api Documentation: Account Api");

  }

  Login(): void {

   
    this.ShowLoading = true;
    
    // --------------------------------------------
    // Login - begin
    // --------------------------------------------

    this.accountsService.Login(this.loginEmail, this.loginPassword, this.loginRememberMe)
      .subscribe(
        (response: ResponseTokenDTO) => {

          if (environment.debug_mode) {
            console.log("response: " + JSON.stringify(response));
          }

          this.authService.saveToken(response.token);

          this.authMsgService.sendMessage(true);
          
          var tokenDTO = this.authService.getUserDetails(); 
          
          if (environment.debug_mode) {
            console.log("customerfirstname: " + tokenDTO.customerfirstname);
            console.log("customerlastname: " + tokenDTO.customerlastname);
            console.log("roles: " + tokenDTO.roles);
            var iat = new Date(tokenDTO.iat * 1000);
            console.log("iat: " + iat.toISOString());
            console.log("iat_seconnds: " + tokenDTO.iat);
            console.log("Date.now().valueOf() / 1000 =" + Date.now().valueOf() / 1000)
            var exp = new Date(tokenDTO.exp * 1000);
            console.log("exp: " + exp.toISOString());
            console.log("exp_seconds: " + tokenDTO.exp);
            var expMinuntes = (tokenDTO.exp - tokenDTO.iat) / 60;
            console.log("token expires in minutes = " + expMinuntes);
            console.log("isLoggedIn()=" + this.authService.isLoggedIn());
          }

          this.ShowLoading = false;

          this.router.navigateByUrl('/');

        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });
    // --------------------------------------------
    // Login - end
    // --------------------------------------------


  }

}
