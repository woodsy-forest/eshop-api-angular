import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { CustomerDTO } from '../../DTOs/CustomerDTO';
import { CustomerService } from './customer.service';
import { CustomerCommonService } from '../../services/customer-common.service'; 
import { CountryCommonService } from '../../services/country-common.service';
import { StateProvinceCommonService } from '../../services/state-province-common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { TokenDTO } from '../../DTOs/TokenDTO';
import { Router } from "@angular/router";
import { CountryDTO } from '../../DTOs/CountryDTO';
import { StateProvinceDTO } from '../../DTOs/StateProvinceDTO';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs";
import { debounceTime, repeat } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { PagedCustomerDTO } from '../../DTOs/PagedCustomerDTO';
import { ConstantRoles } from '../../core/constants/Role';

@Component({
    selector: 'customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
  })
export class CustomerComponent {

  public customerDTO: CustomerDTO = new CustomerDTO();
  public billingCountryDTOs: CountryDTO[] = [];
  public billingStateProvinceDTOs: StateProvinceDTO[] = [];
  public shippingCountryDTOs: CountryDTO[] = [];
  public shippingStateProvinceDTOs: StateProvinceDTO[] = [];
  public ShowLoading: boolean = false;
  public ShowLoadingShippingStateProvinces: boolean = false;
  public ShowLoadingBillingStateProvinces: boolean = false;
  public ShowLoadingtateProvinces: boolean = false;
  public IsAuthenticated: boolean = false;
  public ShowMyDetails: boolean = true;
  public ShowBillingAddress: boolean = false;
  public ShowShippingAddress: boolean = false;
  public search = new FormControl();
  public obSearch: Observable<any> = new Observable<any>();
  public pagedCustomerDTO: PagedCustomerDTO = new PagedCustomerDTO();
  public pageSize: number = 10;
  public currentPage: number = 1;
  public Mode: string = 'List';
  public IsAdmin = false;

  
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private countryCommonService: CountryCommonService,
    private stateProvinceCommonService: StateProvinceCommonService,
    private customerCommonService: CustomerCommonService,
    @Inject(PLATFORM_ID) private platformId: any) {

        
      } // end contructor
    
    
      ngOnInit(): void {

        this.titleService.setTitle("eShop Api Documentation: Customer Api");

        this.IsAuthenticated = this.authService.isLoggedIn()

        this.IsAdmin = false;
        if (this.IsAuthenticated) {
          if (this.authService.hasPermissionRole(ConstantRoles.Admin)) {
          this.IsAdmin = true;
          }
        }

        if (!isPlatformServer(this.platformId)) {

          if (!this.IsAuthenticated) {
            if (environment.debug_mode) {
              console.log("CustomerComponent - ngOnInit, IsAuthenticated: " + this.IsAuthenticated);
            }
  
            alert("You must login first.");
            this.router.navigateByUrl('/account/login');
            return;
          }

          if (!this.IsAdmin) {
            this.Mode = 'Edit';
            var tokenDTO: TokenDTO = this.authService.getUserDetails();
            this.GetCustomerCountry(tokenDTO.customerid)
          }
          else {

              this.Mode = 'List';
              //Search - begin

                this.obSearch = this.search.valueChanges.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  filter((val: string) => (val.length >= 0)),
                  switchMap((search: string) => this.GetSearchCustomers(search))
              );


              this.obSearch.subscribe(
                  (response: PagedCustomerDTO) => {

                      if (environment.debug_mode) {
                          console.log("GetSearchCustomers, response: " + JSON.stringify(response));
                        }
                
                        this.pagedCustomerDTO = response;
                        this.ShowLoading = false;
                      
                      
      
                  },
                  (err: HttpErrorResponse) => {
                  
                      console.log(err);
                      alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                      this.ShowLoading = false;
                  }); 

              this.search.setValue("");


              //Search - end
            }

        }
        else {
    
          if (environment.debug_mode) {
            console.log("CustomerComponent, ngOnInit(): app running on the server, skip GetCustomer() for now.");
          }
    
        }
        
      } //ngOnInit

      GetCustomerCountry(customerId: number): void {

        this.ShowLoading = true;
        this.customerCommonService.GetCustomerById(customerId)
        .subscribe(
          (response: CustomerDTO) => {
            if (environment.debug_mode) {
              console.log("GetCustomer, response: " + JSON.stringify(response));
            }

            this.customerDTO = response;

            //Load Countries - begin
            this.countryCommonService.GetCountries()
            .subscribe(
              (response: CountryDTO[]) => {
                if (environment.debug_mode) {
                  console.log("GetCountry, response: " + JSON.stringify(response));
                }
    
                this.billingCountryDTOs = response;
                this.shippingCountryDTOs = response;

                this.ShowLoading = false;
  
                if (this.customerDTO.BillingCountryCode) {
                  var countryId = this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Id;
                  this.getBillingStateProvinces(countryId);
                }
  
                if (this.customerDTO.ShippingCountryCode) {
                  var countryId =  this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Id;
                  this.getShippingStateProvinces(countryId);
                }
  
              }
              ,
              (error: HttpErrorResponse) => {
                console.log(error);
                alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
                this.ShowLoading = false;
              }
            );


            //Load Countries - end


            this.ShowLoading = false;
          }
          ,
          (error: HttpErrorResponse) => {
            console.log(error);
            alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
            this.ShowLoading = false;
          }
        );


      }

      GetSearchCustomers(search: string): any {

        this.ShowLoading = true;

        return this.customerCommonService.GetCustomers(search, this.currentPage, this.pageSize);


      }

      Cancel(): void {
        this.Mode = "List";
      }

      EditCustomer(customer: CustomerDTO): void {

        this.GetCustomerCountry(customer.Id)

        this.Mode = "Edit";
      }

      NavigateNext(): void {
        if (this.currentPage < this.pagedCustomerDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetCustomers(this.search.value);
        }
      }

    NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetCustomers(this.search.value);
        }
    }

    NavigateFirst(): void {
        if (this.currentPage > 1) {
            this.currentPage = 1;
            this.GetCustomers(this.search.value);
        }
    }

    NavigateLast(): void {
        if (this.currentPage < this.pagedCustomerDTO.PageResult.PageCount) {
            this.currentPage = this.pagedCustomerDTO.PageResult.PageCount;
            this.GetCustomers(this.search.value);
        }
    }

    GetCustomers(search: string): void {

      this.ShowLoading = true;


      this.customerCommonService.GetCustomers(search, this.currentPage, this.pageSize)
      .subscribe(
          (response: PagedCustomerDTO) => {

              if (environment.debug_mode) {
                  console.log("GetCustomers, response: " + JSON.stringify(response));
              }

              this.pagedCustomerDTO = response;

              
              this.ShowLoading = false;


          }
          ,
          (err: HttpErrorResponse) => {

              console.log(err);
              alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
              this.ShowLoading = false;

          }
      );

  }


      InputSearch_valuechange(event: any): void {

        this.currentPage = 1;

        if (environment.debug_mode) {
          console.log("InputSearch_valuechange: " + event.target.value)
        }
      }

      DisplayMyDisplay(): void {
        this.ShowMyDetails = !this.ShowMyDetails;
        this.ShowBillingAddress = false;
        this.ShowShippingAddress = false;
      }

      DisplayBilligAddress(): void {
        this.ShowBillingAddress = !this.ShowBillingAddress;
        this.ShowMyDetails = false;
        this.ShowShippingAddress = false;
      }

      DisplayShippingAddress(): void {
        this.ShowShippingAddress = !this.ShowShippingAddress;
        this.ShowMyDetails = false;
        this.ShowBillingAddress = false;
      }

      getBillingStateProvinces(countryId: number): void {
        
        this.ShowLoadingBillingStateProvinces = true;

        this.billingStateProvinceDTOs = [];

        this.stateProvinceCommonService.GetStateProvincesByCountryId(countryId)
        .subscribe(
          (response: StateProvinceDTO[]) => {

              this.billingStateProvinceDTOs = response;

              if (this.billingStateProvinceDTOs.length>0) {
                   this.customerDTO.BillingStateProvince = '';
              }
              else {
                this.customerDTO.BillingStateProvinceCode = '';
              }
       
              this.ShowLoadingBillingStateProvinces = false;

              if (!this.ShowLoadingBillingStateProvinces && !this.ShowLoadingShippingStateProvinces) {
                this.ShowLoadingtateProvinces = false;
              }

          }
          ,
          (error: HttpErrorResponse) => {
            console.log(error);
            alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
            this.ShowLoadingBillingStateProvinces = false;
          }
        );

      }

      getShippingStateProvinces(countryId: number): void {

        this.ShowLoadingShippingStateProvinces = true;

        this.shippingStateProvinceDTOs = [];

        this.stateProvinceCommonService.GetStateProvincesByCountryId(countryId)
        .subscribe(
          (response: StateProvinceDTO[]) => {

            this.shippingStateProvinceDTOs = response;

            if (this.shippingStateProvinceDTOs.length>0) {
              this.customerDTO.ShippingStateProvince = '';
            }
            else {
              this.customerDTO.ShippingStateProvinceCode = '';
            }

            this.ShowLoadingShippingStateProvinces = false;

            if (!this.ShowLoadingBillingStateProvinces && !this.ShowLoadingShippingStateProvinces) {
              this.ShowLoadingtateProvinces = false;
            }

          }
          ,
          (error: HttpErrorResponse) => {
            console.log(error);
            alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
            this.ShowLoadingShippingStateProvinces = false;
          }
        );

      }

      selectBillingCountry(): void {

        if (this.billingCountryDTOs.length>0) {
          var countryId = this.billingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Id;
          this.getBillingStateProvinces(countryId);
        }

      }

      selectShippingCountry(): void {

        if (this.shippingCountryDTOs.length>0) {
          var countryId = this.shippingCountryDTOs.filter(c => c.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Id;
          this.getShippingStateProvinces(countryId);
        }

      }

      UpdateMyDetails(): void {

        if (environment.debug_mode) {
          console.log("customerDTO.BillingStateProvinceCode: " + this.customerDTO.BillingStateProvinceCode)
          console.log("customerDTO.BillingStateProvince: " + this.customerDTO.BillingStateProvince);
          console.log("customerDTO.BillingCountryCode: " + this.customerDTO.BillingCountryCode);
          console.log("customerDTO.ShippingStateProvinceCode: " + this.customerDTO.ShippingStateProvinceCode);
          console.log("customerDTO.ShippingStateProvince: " + this.customerDTO.ShippingStateProvince);
          console.log("customerDTO.ShippingCountryCode: " + this.customerDTO.ShippingCountryCode);
        }

        //Billing
        if (this.customerDTO.BillingStateProvinceCode?.length > 0) {
          this.customerDTO.BillingStateProvince = this.billingStateProvinceDTOs.filter(a => a.Abbreviation == this.customerDTO.BillingStateProvinceCode)[0].Name;
        }
        if (this.customerDTO.BillingCountryCode?.length > 0 ) {
          this.customerDTO.BillingCountry = this.billingCountryDTOs.filter(a => a.TwoLetterIsoCode == this.customerDTO.BillingCountryCode)[0].Name;
        }
        //Shipping
        if (this.customerDTO.ShippingStateProvinceCode?.length > 0 ) {
          this.customerDTO.ShippingStateProvince = this.shippingStateProvinceDTOs.filter(a => a.Abbreviation == this.customerDTO.ShippingStateProvinceCode)[0].Name;
        }
        if (this.customerDTO.ShippingCountryCode?.length > 0) {
          this.customerDTO.ShippingCountry = this.shippingCountryDTOs.filter(a => a.TwoLetterIsoCode == this.customerDTO.ShippingCountryCode)[0].Name;
        } 

        if (environment.debug_mode) {
          console.log("customerDTO.BillingStateProvince: " + this.customerDTO.BillingStateProvince);
          console.log("customerDTO.ShippingStateProvince: " + this.customerDTO.ShippingStateProvince);
        }

        if (this.IsAdmin) {
          this.Mode = "List";
        }

        this.ShowLoading = true;

   
        this.customerService.UpdateCustomer(this.customerDTO)
        .subscribe(
          (response: CustomerDTO) => {
    
            if (environment.debug_mode) {
              console.log("UpdateCustomer, response: " + JSON.stringify(response));
            }

            if (this.IsAdmin) {
              //update record in the list
              for (var i=0;i<this.pagedCustomerDTO.Customers.length;i++) {
                if (this.pagedCustomerDTO.Customers[i].Id == response.Id) {
                  this.pagedCustomerDTO.Customers[i] = response;
                }
              }          
            }
  
            alert("This record has been updated.");
            this.ShowLoading = false;
    
          }
          ,
          (err: HttpErrorResponse) => {
    
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
    
          });

      }

}
