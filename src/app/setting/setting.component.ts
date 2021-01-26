import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SettingService } from './setting.service';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PagedSettingDTO } from '../../DTOs/PagedSettingDTO';
import { SettingDTO } from 'src/DTOs/SettingDTO';


@Component({
    selector: 'setting',
    templateUrl: './setting.component.html'
  })
export class SettingComponent  implements OnInit, OnDestroy { 

    public ShowLoading: boolean = false;
    public search = new FormControl();
    public obSearch: Observable<any> = new Observable<any>();
    public pageSize: number = 1;
    public currentPage: number = 1;
    public pagedSettingDTO: PagedSettingDTO = new PagedSettingDTO();
    public PageTitle: string = '';
    public Mode: string = '';
    public selSettingDTO: SettingDTO = new SettingDTO();

    constructor (
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: any,
        private settingService: SettingService) {
    
    }
    
    ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Discount Api");

        if (!isPlatformServer(this.platformId)) {


          this.obSearch = this.search.valueChanges.pipe(
              debounceTime(400),
              distinctUntilChanged(),
              filter((val: string) => (val.length >= 0)),
              switchMap((tmp: string) => this.GetSearchSettings(tmp))
          );


          this.obSearch.subscribe(
              (response: PagedSettingDTO) => {

                  if (environment.debug_mode) {
                      console.log("GetSearchSettings, response: " + JSON.stringify(response));
                    }
            
                    this.pagedSettingDTO = response;
                  
                    this.ShowLoading = false;
              
              },
              (err: HttpErrorResponse) => {
              
                  console.log(err);
                  alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                  this.ShowLoading = false;
              }); 

          this.search.setValue("");

        }
        else {
          if (environment.debug_mode) {
            console.log("SettingComponent, ngOnInit(): app running on the server, skip obSearch for now.");
          }
        }
          
      } 

      SelUpdateSetting(settingDTO: SettingDTO): void {
          this.PageTitle = "Update Setting";
          this.selSettingDTO = settingDTO;
          this.Mode = "U";

      }


      UpdateSetting() : void {


        this.ShowLoading = true;
      
        this.settingService.UpdateSetting(this.selSettingDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("UpdateSetting, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.currentPage = 1;
            this.GetSettings(this.search.value);

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      CancelEdit(): void {
          this.Mode = '';
      }

      NavigateNext(): void {
        if (this.currentPage < this.pagedSettingDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetSettings(this.search.value);
        }
      }

      NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetSettings(this.search.value);
        }
      }

      NavigateFirst(): void {
        if (this.currentPage > 1) {
          this.currentPage = 1;
          this.GetSettings(this.search.value);
        }
      }

      NavigateLast(): void {
        if (this.currentPage < this.pagedSettingDTO.PageResult.PageCount) {
            this.currentPage = this.pagedSettingDTO.PageResult.PageCount;
            this.GetSettings(this.search.value);
        }
      }

      InputSearch_valuechange(event: any): void {

        this.currentPage = 1;
    
        if (environment.debug_mode) {
          console.log("InputSearch_valuechange: " + event.target.value)
        }
    }

    GetSearchSettings(search: string): any {

        this.ShowLoading = true;
        return this.settingService.GetSettings(this.currentPage, this.pageSize, search);
  
      }

      GetSettings(search: string): void {

        this.ShowLoading = true;
    
        this.settingService.GetSettings(this.currentPage, this.pageSize, search)
        .subscribe(
          (response: PagedSettingDTO) => {
    
            if (environment.debug_mode) {
              console.log("GetSettings, response: " + JSON.stringify(response));
            }
    
            this.pagedSettingDTO = response;
                
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