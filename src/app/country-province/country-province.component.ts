import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { CountryProvinceService } from './country-province.service'
import { CountryCommonService } from '../../services/country-common.service';
import { StateProvinceCommonService } from '../../services/state-province-common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryDTO } from '../../DTOs/CountryDTO';
import { StateProvinceDTO } from '../../DTOs/StateProvinceDTO';



@Component({
    selector: 'country-province',
    templateUrl: './country-province.component.html'
  })
export class CountryProvinceComponent  implements OnInit, OnDestroy { 

  public selectedCountryId: number = 0;
  public ShowLoading: boolean = false;
  public CountryDTOs: CountryDTO[] = [];
  public StateProvinceDTOs: StateProvinceDTO[] = [];
  public selCountryDTO: CountryDTO = new CountryDTO();
  public selStateProvinceDTO: StateProvinceDTO = new StateProvinceDTO();
  public Mode: string = '';
  
    constructor (
        private titleService: Title,
        private countryCommonService: CountryCommonService,
        private countryProvinceService: CountryProvinceService,
        private stateProvinceCommonService: StateProvinceCommonService,
        @Inject(PLATFORM_ID) private platformId: any) {
    
    }
    
    ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Country ProvinceState Api");

        if (!isPlatformServer(this.platformId)) {

          this.GetCountries();

        }
        else {
          if (environment.debug_mode) {
            console.log("CountryProvinceComponent, ngOnInit(): app running on the server, skip obSearch for now.");
          }
        }
          
      } 

      onAddCountry(): void {

        this.selCountryDTO = new CountryDTO();
        this.Mode = "A";
      }

      CancelCountry(): void {
        this.selectedCountryId = 0;
        this.Mode = '';
      }

      AddCountry(): void {

        this.ShowLoading = true;
      
        this.countryProvinceService.AddCountry(this.selCountryDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("AddNewCountry, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.ShowLoading = false;
            alert("Country has been added.");
            this.GetCountries();

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      DeleteCountry(): void {

        this.ShowLoading = true;
      
        this.countryProvinceService.DeleteCountry(this.selCountryDTO.Id)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("DeleteCountry, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.ShowLoading = false;
            alert("Country has been delete.");
            this.GetCountries();

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      EditStateProvince(): void {

        this.Mode = "Province";

      }

      UpdateCountry(): void {

        this.ShowLoading = true;
      
        this.countryProvinceService.UpdateCountry(this.selCountryDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("UpdateCountry, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.ShowLoading = false;
            alert("Country has been updated.");
            this.GetCountries();

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      AddStateProvince(): void {

        this.ShowLoading = true;
      
        this.selStateProvinceDTO.CountryId = this.selCountryDTO.Id;
        this.countryProvinceService.AddStateProvince(this.selStateProvinceDTO)
        .subscribe(
          (response: StateProvinceDTO) => {
  
            if (environment.debug_mode) {
              console.log("AddStateProvince, response: " + JSON.stringify(response));
            }
          
            this.Mode = 'Province';
            this.ShowLoading = false;
            alert("StateProvince has been added.");
            this.getStateProvince(this.selCountryDTO.Id);

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      DeleteStateProvince(id: number) {

        this.ShowLoading = true;
      
        this.countryProvinceService.DeleteStateProvince(id)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("DeleteStateProvince, response: " + JSON.stringify(response));
            }
          
            this.Mode = 'Province';
            this.ShowLoading = false;
            alert("StateProvince has been delete.");
            this.getStateProvince(this.selCountryDTO.Id);

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });


      }

      onAddStateProvince(): void {
        this.Mode = "ProvinceAdd"
        this.selStateProvinceDTO = new StateProvinceDTO();
      }

      onAddStateProvinceCancel(): void {
        this.Mode = "U"
      }

      getStateProvince(id: number) {

        this.ShowLoading = true;
      
        this.stateProvinceCommonService.GetStateProvincesByCountryId(id)
        .subscribe(
          (response: StateProvinceDTO[]) => {
  
            if (environment.debug_mode) {
              console.log("getStateProvince, response: " + JSON.stringify(response));
            }

            this.StateProvinceDTOs = response;
            this.ShowLoading = false;

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      selectCountry(): void {

  
        if (environment.debug_mode) {
          console.log("selectCountry changed, selectedCountryId: " + this.selectedCountryId);
        
        }

        this.Mode = "U";
        for (var i=0;i<this.CountryDTOs.length;i++) {
          if (this.CountryDTOs[i].Id == this.selectedCountryId) {
            this.selCountryDTO = this.CountryDTOs[i];
            //get the StateProvince - begin
            this.getStateProvince(this.selCountryDTO.Id);
            //get the StateProvince - end
          }
        }
        
      }

      GetCountries() : void {


        this.ShowLoading = true;
      
        this.countryCommonService.GetCountries()
        .subscribe(
          (response: CountryDTO[]) => {
  
            this.CountryDTOs = response;
            this.selectedCountryId = 0;
            this.ShowLoading = false;


          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

    

      ngOnDestroy(): void {
        // unsubscribe to ensure no memory leaks
      }

}