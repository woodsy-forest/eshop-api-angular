import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../../DTOs/OrderDTO';
import { OrderService } from './order.service';
import { StatusService } from '../../services/status.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderStatusDTO } from '../../DTOs/OrderStatusDTO';
import { StatusDTO } from '../../DTOs/StatusDTO';

@Component({
  selector: 'order-status-list',
  templateUrl: './order-status-list.dialog.html'
})
export class OrderStatusListDialog implements OnInit {

  public orderDTO: OrderDTO = new OrderDTO();
  public Mode: string = 'List';
  public ShowLoading: boolean = false;
  public statusDTOs: StatusDTO[] = [];
  public selStatusId: number = 0;

  constructor(
    public dialogRef: MatDialogRef<OrderStatusListDialog>,
    public orderService: OrderService,
    public statusService: StatusService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onCloseClick(): void {
    this.dialogRef.close(this.orderDTO);
  }

  ngOnInit() {
      
      if (environment.debug_mode) {
        console.log("OrderStatusListDialog - Init, data: " + JSON.stringify(this.data));
      }

      this.ShowLoading = true;

      this.orderDTO = this.data.order;

      if (this.orderDTO.OrderStatuses.length>0) {
        this.selStatusId = this.orderDTO.OrderStatuses[0].Id;
      }
    
      this.statusService.GetStatuses()
      .subscribe(
          (response: StatusDTO[]) => {
  
              if (environment.debug_mode) {
                  console.log("GetStatuses, response: " + JSON.stringify(response));
              }
  
              this.statusDTOs = response;
  
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

  onUpdateStatus(): void {
    this.Mode = "Update";
    if (this.orderDTO.OrderStatuses.length>0) {
      this.selStatusId = this.orderDTO.OrderStatuses[0].Id;
    }
  }

  Cancel(): void {
    this.Mode = 'List';
  }

  UpdateStatus(): void {

    this.ShowLoading = true;
  
    var orderStatusDTO = new OrderStatusDTO();
    orderStatusDTO.Id = this.selStatusId;

    if (environment.debug_mode) {
      console.log("UpdateStatus, selStatusId:" + this.selStatusId);
    }
  
    this.orderService.UpdateOrderStatus(this.orderDTO.Id, orderStatusDTO)
    .subscribe(
        (response: OrderDTO) => {

            if (environment.debug_mode) {
                console.log("UpdateStatus, response: " + JSON.stringify(response));
            }

            this.orderDTO = response;

            this.ShowLoading = false;
            this.Mode = 'List';
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