import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { AttributeService } from './attribute.service';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PagedAttributeDTO } from '../../DTOs/PagedAttributeDTO';
import { AttributeDTO } from 'src/DTOs/AttributeDTO';
import { AttributeCommonService } from '../../services/attribute-common.service';

@Component({
    selector: 'attribute',
    templateUrl: './attribute.component.html'
  })
export class AttributeComponent  implements OnInit, OnDestroy { 

    public ShowLoading: boolean = false;
    public search = new FormControl();
    public obSearch: Observable<any> = new Observable<any>();
    public pageSize: number = 10;
    public currentPage: number = 1;
    public pagedAttributeDTO: PagedAttributeDTO = new PagedAttributeDTO();
    public PageTitle: string = '';
    public Mode: string = '';
    public selAttributeDTO: AttributeDTO = new AttributeDTO();

    constructor (
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: any,
        private attributeCommonService: AttributeCommonService,
        private attributeService: AttributeService) {
    
    }
    
    ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Attribute Api");

        if (!isPlatformServer(this.platformId)) {


          this.obSearch = this.search.valueChanges.pipe(
              debounceTime(400),
              distinctUntilChanged(),
              filter((val: string) => (val.length >= 0)),
              switchMap((tmp: string) => this.GetSearchAttributes(tmp))
          );


          this.obSearch.subscribe(
              (response: PagedAttributeDTO) => {

                  if (environment.debug_mode) {
                      console.log("GetSearchAttributes, response: " + JSON.stringify(response));
                    }
            
                    this.pagedAttributeDTO = response;
                  
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
            console.log("AttributeComponent, ngOnInit(): app running on the server, skip obSearch for now.");
          }
        }
          
      } 

      DeleteAttribute(attribute: AttributeDTO): void {

        if (confirm("Are you sure you want to delete " + attribute.Name + "?")) {

            this.ShowLoading = true;
      
            this.attributeService.DeleteAttribute(attribute.Id)
            .subscribe(
              (response: any) => {
      
                if (environment.debug_mode) {
                  console.log("DeleteAttribute, response: " + JSON.stringify(response));
                }
              
                this.currentPage = 1;
                this.GetAttributes(this.search.value);

              }
              ,
              (err: HttpErrorResponse) => {
      
                console.log(err);
                alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                this.ShowLoading = false;
      
              });
      
          }

      }

      SelUpdateAttribute(attributDTO: AttributeDTO): void {
          this.PageTitle = "Update Attribute";
          this.selAttributeDTO = attributDTO;
          this.Mode = "U";

      }

      SelAddAttribute(): void {
        this.PageTitle = "Add New Attribute";
        this.selAttributeDTO = new AttributeDTO();
        this.Mode = "A";
      }

      UpdateAttribute() : void {


        this.ShowLoading = true;
      
        this.attributeService.UpdateAttribute(this.selAttributeDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("UpdateAttribute, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.currentPage = 1;
            this.GetAttributes(this.search.value);

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      AddAttribute(): void {

        this.ShowLoading = true;
      
        this.attributeService.AddAttribute(this.selAttributeDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("UpdateAttribute, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.currentPage = 1;
            this.GetAttributes(this.search.value);

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
        if (this.currentPage < this.pagedAttributeDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetAttributes(this.search.value);
        }
      }

      NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetAttributes(this.search.value);
        }
      }

      NavigateFirst(): void {
        if (this.currentPage > 1) {
          this.currentPage = 1;
          this.GetAttributes(this.search.value);
        }
      }

      NavigateLast(): void {
        if (this.currentPage < this.pagedAttributeDTO.PageResult.PageCount) {
            this.currentPage = this.pagedAttributeDTO.PageResult.PageCount;
            this.GetAttributes(this.search.value);
        }
      }

      InputSearch_valuechange(event: any): void {

        this.currentPage = 1;
    
        if (environment.debug_mode) {
          console.log("InputTis_valuechange: " + event.target.value)
        }
    }

      GetSearchAttributes(search: string): any {

        this.ShowLoading = true;
        return this.attributeCommonService.GetAttributes(this.currentPage, this.pageSize, search);
  
      }

      GetAttributes(search: string): void {

        this.ShowLoading = true;
    
        this.attributeCommonService.GetAttributes(this.currentPage, this.pageSize, search)
        .subscribe(
          (response: PagedAttributeDTO) => {
    
            if (environment.debug_mode) {
              console.log("GetAttributes, response: " + JSON.stringify(response));
            }
    
            this.pagedAttributeDTO = response;
                
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