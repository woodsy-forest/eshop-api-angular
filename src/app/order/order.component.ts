import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ConstantRoles } from '../../core/constants/Role';
import { PagedOrderDTO } from '../../DTOs/PagedOrderDTO';
import { OrderService } from './order.service';
import { Router } from "@angular/router";
import { TokenDTO } from '../../DTOs/TokenDTO';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs";
import { debounceTime, repeat } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { OrderNoteListDialog } from './order-note-list.dialog';
import { OrderStatusListDialog } from './order-status-list.dialog';
import { OrderDTO } from '../../DTOs/OrderDTO';
import { OrderStatusDTO } from 'src/DTOs/OrderStatusDTO';
import { DatePipe } from '@angular/common'

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
  })
export class OrderComponent {

  public ShowLoading: boolean = false;
  public IsAdmin = false;
  public IsAuthenticated: boolean = false;
  public pagedOrderDTO: PagedOrderDTO = new PagedOrderDTO();
  public pageSize: number = 10;
  public currentPage: number = 1;
  public search = new FormControl();
  public obSearch: Observable<any> = new Observable<any>();


  constructor(
    private titleService: Title,
    private authService: AuthService,
    private orderService: OrderService,
    public datepipe: DatePipe,
    private router: Router,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: any) {

        
      } // end contructor
    
    
      ngOnInit(): void {

        this.titleService.setTitle("eShop Api Documentation: Order Api");

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
              console.log("OrderComponent - ngOnInit, IsAuthenticated: " + this.IsAuthenticated);
            }
  
            alert("You must login first.");
            this.router.navigateByUrl('/account/login');
            return;
          }

          if (!this.IsAdmin) {
            var tokenDTO: TokenDTO = this.authService.getUserDetails();
            this.GetOrders("");
          }
          else {

              //Search - begin
                this.obSearch = this.search.valueChanges.pipe(
                  debounceTime(400),
                  distinctUntilChanged(),
                  filter((val: string) => (val.length >= 0)),
                  switchMap((search: string) => this.GetSearchOrders(search))
              );


              this.obSearch.subscribe(
                  (response: PagedOrderDTO) => {

                      if (environment.debug_mode) {
                          console.log("GetSearchOrders, response: " + JSON.stringify(response));
                        }
                
                        this.pagedOrderDTO = response;
                        this.ShowLoading = false;
                      
                      
      
                  },
                  (err: HttpErrorResponse) => {
                  
                      console.log(err);
                      alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                      this.ShowLoading = false;
                  }); 
                //Search - end
            }

            this.search.setValue("");

        }
        else {
    
          if (environment.debug_mode) {
            console.log("OrderComponent, ngOnInit(): app running on the server, skip GetOrders() for now.");
          }
    
        }
        
      } //ngOnInit

      showNotes(order: OrderDTO):void {

        const dialogRef = this.dialog.open(OrderNoteListDialog, {
          width: '80%',
          data: {order}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (environment.debug_mode) {
            console.log("openOrderNoteList, result:" + JSON.stringify(result));
          }
          order.OrderNotes = result;
        });

      }

      GetCurrentStatus(statuses: OrderStatusDTO[]): string {

        if (statuses.length>0) {
          return statuses[0].Name + ' on ' + this.datepipe.transform(statuses[0].CreatedOnUtc, 'yyyy-MM-dd');;
        }
        else {
          return "";
        }

      }

      showStatuses(order: OrderDTO): void {

        const dialogRef = this.dialog.open(OrderStatusListDialog, {
          width: '80%',
          data: {order}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (environment.debug_mode) {
            console.log("openOrderStatusList, result:" + JSON.stringify(result));
          }
          let orderDTO: OrderDTO = result;
          for (var i=0; i<this.pagedOrderDTO.Orders.length;i++) {
            if (this.pagedOrderDTO.Orders[i].Id == orderDTO.Id) {
              this.pagedOrderDTO.Orders[i].OrderStatuses = orderDTO.OrderStatuses;
            }
          }
        });

      }

      GetSearchOrders(search: string): any {

        this.ShowLoading = true;

        return this.orderService.GetOrders(search, this.currentPage, this.pageSize);


      }

      InputSearch_valuechange(event: any): void {

        this.currentPage = 1;

        if (environment.debug_mode) {
          console.log("InputSearch_valuechange: " + event.target.value)
        }
      }

      NavigateNext(): void {
        if (this.currentPage < this.pagedOrderDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetOrders(this.search.value);
        }
      }

      NavigatePrevious(): void {
          if (this.currentPage > 1) {
              this.currentPage -= 1;
              this.GetOrders(this.search.value);
          }
      }

      NavigateFirst(): void {
          if (this.currentPage > 1) {
              this.currentPage = 1;
              this.GetOrders(this.search.value);
          }
      }

      NavigateLast(): void {
          if (this.currentPage < this.pagedOrderDTO.PageResult.PageCount) {
              this.currentPage = this.pagedOrderDTO.PageResult.PageCount;
              this.GetOrders(this.search.value);
          }
      }

      GetOrders(search: string): void {

        this.ShowLoading = true;
  
  
        this.orderService.GetOrders(search, this.currentPage, this.pageSize)
        .subscribe(
            (response: PagedOrderDTO) => {
  
                if (environment.debug_mode) {
                    console.log("GetOrders, response: " + JSON.stringify(response));
                }
  
                this.pagedOrderDTO = response;
  
                
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
  


}
