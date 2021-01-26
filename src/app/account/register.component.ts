import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDTO } from '../../DTOs/RegisterDTO';

@Component({
    selector: 'register',
    templateUrl: './register.component.html'
  })
export class RegisterComponent  implements OnInit { 

  public ShowLoading = false;
  public registerFirstName: string = '';
  public registerLastName: string = '';
  public registerEmail: string = '';
  public registerPassword: string = '';
  public reCaptchaResponse: string = '';


  constructor (
    private titleService: Title,
    private accountsService: AccountService) {

  }

  ngOnInit(): void {

    this.titleService.setTitle("eShop Api Documentation: Account Api - Register");

  }

  resolved(captchaResponse: string) {
    if (environment.debug_mode) {
      console.log(`Resolved captcha with response: ${captchaResponse}`);
    }

    this.reCaptchaResponse = captchaResponse;

  }

  Register(): void {

    if (environment.debug_mode) {
      console.log("sendMessage, this.ReCatchaResponse: " + this.reCaptchaResponse);
    }

    // Check ReCatcha
    if (!this.reCaptchaResponse) {
      alert("MESSAGE: Please, prove you are not a robot.");
      return;
    }

    this.ShowLoading = true;

    // --------------------------------------------
    // Register - begin
    // --------------------------------------------
    var registerDTO = new RegisterDTO();
    registerDTO.FirstName = this.registerFirstName;
    registerDTO.LastName = this.registerLastName;
    registerDTO.Email = this.registerEmail;
    registerDTO.Password = this.registerPassword;
    registerDTO.ReCaptchaResponse = this.reCaptchaResponse;

    this.accountsService.Register(registerDTO)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("response: " + JSON.stringify(response));
          }

          alert("INFORMATION: A confirmation email has been sent.");
        
          this.ShowLoading = false;

        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });
    // --------------------------------------------
    // Register - end
    // --------------------------------------------

  }


}
