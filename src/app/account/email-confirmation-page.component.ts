import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AccountService } from './account.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerDTO } from 'src/DTOs/CustomerDTO';

@Component({
  selector: 'email-confirmation-page',
  templateUrl: './email-confirmation-page.component.html'
  })
export class EmailConfirmationPageComponent  implements OnInit { 

    public customerId: any = null;
    public ShowLoading = false;

    constructor (
        private titleService: Title,
        private route: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: any,
        private accountsService: AccountService) {
    
      }
    
      ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Account Api - Email Confirmation Page");

        this.customerId = this.route.snapshot.paramMap.get('id');

        if (environment.debug_mode) {
            console.log("EmailConfirmationComponent, customerId: " + this.customerId);
        }

        if (!isPlatformServer(this.platformId)) {

            if (!this.customerId) {
              alert("Email Confirmation must have a CustomerId in the url.");
              return;
            }

            this.ShowLoading = true;

            // --------------------------------------------
            // Confirm - begin
            // --------------------------------------------
            this.accountsService.EmailConfirmation(this.customerId)
            .subscribe(
                (response: CustomerDTO) => {

                  if (environment.debug_mode) {
                      console.log("response: " + JSON.stringify(response));
                  }

                  alert("INFORMATION: Customer: " + response.BillingFirstName + " " + response.BillingLastName + " has been confirmed.");
                  
                  this.ShowLoading = false;

                }
                ,
                (err: HttpErrorResponse) => {

                  console.log(err);
                  alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                  this.ShowLoading = false;

                });
            // --------------------------------------------
            // Confirm - end
            // --------------------------------------------
        }
        else {
          if (environment.debug_mode) {
            console.log("EmailConfirmationPageComponent, ngOnInit(): app running on the server, skip EmailConfirmation for now.");
          }
        }
        
      }

}