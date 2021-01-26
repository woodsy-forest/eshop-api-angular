import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderCommonService } from '../../services/order-common.service';
import { OrderDTO } from '../../DTOs/OrderDTO';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'invoice-order',
    templateUrl: './invoice-order.component.html',
    styleUrls: ['./invoice-order.component.scss']
  })
export class InvoiceOrderComponent {

  public ShowLoading: boolean = false;
  public orderDTO: OrderDTO = new OrderDTO();

  constructor(
    private route: ActivatedRoute,
    private orderCommonService: OrderCommonService,
    @Inject(PLATFORM_ID) private platformId: any) {

        
      } // end contructor
    
    
      ngOnInit(): void {


        var orderId = Number(this.route.snapshot.paramMap.get('id'));

        if (!isPlatformServer(this.platformId)) {

          this.ShowLoading = true;
      
          this.orderCommonService.GetOrderById(orderId)
          .subscribe(
            (response: OrderDTO) => {
      
              if (environment.debug_mode) {
                console.log("GetOrderById, response: " + JSON.stringify(response)); 
              }
      
              this.orderDTO = response;
      
              this.ShowLoading = false;      
      
            }
            ,
            (err: HttpErrorResponse) => {
      
              console.log(err);
              alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
              this.ShowLoading = false;
      
            });


        }
        
      } //ngOnInit

}
