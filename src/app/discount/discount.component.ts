import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DiscountService } from './discount.service';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PagedDiscountDTO } from '../../DTOs/PagedDiscountDTO';
import { DiscountDTO } from '../../DTOs/DiscountDTO';
import { PagedProductDTO } from '../../DTOs/PagedProductDTO';
import { ProductDTO } from '../../DTOs/ProductDTO';
import { ProductCommonService } from '../../services/product-common.service';
import { DiscountAppliedToProductDTO } from '../../DTOs/DiscountAppliedToProductDTO';


@Component({
    selector: 'discount',
    templateUrl: './discount.component.html'
  })
export class DiscountComponent  implements OnInit, OnDestroy { 

    public ShowLoading: boolean = false;
    public search = new FormControl();
    public obSearch: Observable<any> = new Observable<any>();
    public pageSize: number = 1;
    public currentPage: number = 10;
    public pagedDiscountDTO: PagedDiscountDTO = new PagedDiscountDTO();
    public PageTitle: string = '';
    public Mode: string = '';
    public selDiscountDTO: DiscountDTO = new DiscountDTO();
    public ShowNoProductFound: boolean = false;
    public ShowProductList: boolean = false;
    public searchProduct = new FormControl();
    public obProduct: Observable<any> = new Observable<any>();
    public productDTOs: ProductDTO[] = [];
    public pagedProductDTO: PagedProductDTO = new PagedProductDTO();
    public ShowLoadingProduct: boolean = false;

    constructor (
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: any,
        private productCommonService: ProductCommonService,
        private discountService: DiscountService) {
    
    }
    
    ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Discount Api");

        this.searchProduct.setValue("");

        if (!isPlatformServer(this.platformId)) {

          this.obProduct = this.searchProduct.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            filter((val: string) => (val.length >= 1)),
            switchMap((search: string) => this.GetProductSearch(search)),
          );

          this.obProduct.subscribe(
            (response: PagedProductDTO) => {

              if (environment.debug_mode) {
                console.log("GetSearchProducts, response: " + JSON.stringify(response));
              }
            
              this.pagedProductDTO = response;
              for (var i = 0; i<this.selDiscountDTO.Products.length; i++) {
                this.pagedProductDTO.Products = this.pagedProductDTO.Products.filter(p => p.Id != this.selDiscountDTO.Products[i].Id);
              }

              this.ShowLoadingProduct = false;
              if (this.pagedProductDTO.Products.length == 0) {
                this.ShowNoProductFound = true;
                this.ShowProductList = false;
              }
              else {
                this.ShowNoProductFound = false;
                this.ShowProductList = true;
              }
            
            },
            (err: HttpErrorResponse) => {
            
              console.log(err);
              alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
              this.ShowLoadingProduct = false;
              this.ShowProductList = false;
              this.ShowNoProductFound = false;
            }
          ); 


          this.obSearch = this.search.valueChanges.pipe(
              debounceTime(400),
              distinctUntilChanged(),
              filter((val: string) => (val.length >= 0)),
              switchMap((tmp: string) => this.GetSearchDiscounts(tmp))
          );


          this.obSearch.subscribe(
              (response: PagedDiscountDTO) => {

                  if (environment.debug_mode) {
                      console.log("GetSearchDiscounts, response: " + JSON.stringify(response));
                    }
            
                    this.pagedDiscountDTO = response;
                  
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
            console.log("DiscountComponent, ngOnInit(): app running on the server, skip obSearch for now.");
          }
        }
          
      } 

      GetProductSearch(search: string): any {

        this.ShowLoadingProduct = true;
        return this.productCommonService.GetProducts(0, search, 1, 10, 'name', 'ASC');
  
      }

      RemoveDiscountProduct(discountProduct: DiscountAppliedToProductDTO): void {

        this.selDiscountDTO.Products = this.selDiscountDTO.Products.filter(p => p.Id != discountProduct.Id);

      }

      AddDiscountProduct(productDTO: ProductDTO): void {

        if (environment.debug_mode) {
          console.log("AddProduct: " + productDTO.Name);
        }

        var discountProduct = new DiscountAppliedToProductDTO();
        discountProduct.Id = productDTO.Id;
        discountProduct.Name = productDTO.Name;

        this.selDiscountDTO.Products.push(discountProduct);
        this.ShowProductList = false;
        this.searchProduct.setValue('');

      }

      DeleteDiscount(discount: DiscountDTO): void {

        if (confirm("Are you sure you want to delete " + discount.Name + "?")) {

            this.ShowLoading = true;
      
            this.discountService.DeleteDiscount(discount.Id)
            .subscribe(
              (response: any) => {
      
                if (environment.debug_mode) {
                  console.log("DeleteDiscount, response: " + JSON.stringify(response));
                }
              
                this.currentPage = 1;
                this.GetDiscounts(this.search.value);

              }
              ,
              (err: HttpErrorResponse) => {
      
                console.log(err);
                alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                this.ShowLoading = false;
      
              });
      
          }

      }

      SelUpdateDiscount(discountDTO: DiscountDTO): void {
          this.PageTitle = "Update Discount";
          this.selDiscountDTO = discountDTO;
          this.Mode = "U";
      }

      SelAddDiscount(): void {
        this.PageTitle = "Add New Discount";
        this.selDiscountDTO = new DiscountDTO();
        this.Mode = "A";
      }

      UpdateDiscount() : void {


        this.ShowLoading = true;
      
        this.discountService.UpdateDiscount(this.selDiscountDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("UpdateDiscount, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.currentPage = 1;
            this.GetDiscounts(this.search.value);

          }
          ,
          (err: HttpErrorResponse) => {
  
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
  
          });

      }

      AddDiscount(): void {

        this.ShowLoading = true;
      
        this.discountService.AddDiscount(this.selDiscountDTO)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("AddDiscount, response: " + JSON.stringify(response));
            }
          
            this.Mode = '';
            this.currentPage = 1;
            this.GetDiscounts(this.search.value);

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
        if (this.currentPage < this.pagedDiscountDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetDiscounts(this.search.value);
        }
      }

      NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetDiscounts(this.search.value);
        }
      }

      NavigateFirst(): void {
        if (this.currentPage > 1) {
          this.currentPage = 1;
          this.GetDiscounts(this.search.value);
        }
      }

      NavigateLast(): void {
        if (this.currentPage < this.pagedDiscountDTO.PageResult.PageCount) {
            this.currentPage = this.pagedDiscountDTO.PageResult.PageCount;
            this.GetDiscounts(this.search.value);
        }
      }

      InputSearch_valuechange(event: any): void {

        this.currentPage = 1;
    
        if (environment.debug_mode) {
          console.log("InputTis_valuechange: " + event.target.value)
        }
    }

      GetSearchDiscounts(search: string): any {

        this.ShowLoading = true;
        return this.discountService.GetDiscounts(this.currentPage, this.pageSize, search);
  
      }

      GetDiscountType(discountType: number): string {

        switch (discountType) {
          case 0:
            return "AssignedToOrderTotal";
          case 1:
            return "AssignedToProducts";
          default:
            return "";
        }

      }

      selectDiscountType(): void {

        this.selDiscountDTO.DiscountType = Number(this.selDiscountDTO.DiscountType);

        if (environment.debug_mode) {
          console.log("selectDiscountType changed, selDiscountDTO.DiscountType: " + this.selDiscountDTO.DiscountType);
        
        }
      }

      changeUsePercentage(e: any): void {
        if (environment.debug_mode) {
          console.log("changeUsePercentage, e.target.checked: " + e.target.checked);
        }

      }

      changeInputProduct(event: any): void {

        this.ShowNoProductFound = false;
        this.ShowProductList = false;

        if (environment.debug_mode) {
          console.log("changeInputProduct: " + event.target.value)
        }
          
      } 

      GetDiscounts(search: string): void {

        this.ShowLoading = true;
    
        this.discountService.GetDiscounts(this.currentPage, this.pageSize, search)
        .subscribe(
          (response: PagedDiscountDTO) => {
    
            if (environment.debug_mode) {
              console.log("GetDiscounts, response: " + JSON.stringify(response));
            }
    
            this.pagedDiscountDTO = response;
                
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