import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { OrderNoteDTO } from '../../DTOs/OrderNoteDTO';
import { OrderDTO } from '../../DTOs/OrderDTO';
import { OrderService } from './order.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'order-note-list',
  templateUrl: './order-note-list.dialog.html'
})
export class OrderNoteListDialog implements OnInit {

  public orderDTO: OrderDTO = new OrderDTO();
  public Mode: string = 'List';
  public newNote: string = '';
  public ShowLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<OrderNoteListDialog>,
    public orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onCloseClick(): void {
    this.dialogRef.close(this.orderDTO.OrderNotes);
  }

  onAddNew(): void {
    this.Mode = "Add";
    this.newNote = '';
  }

  DeleteNote(note: OrderNoteDTO): void {

    if (confirm("Are you sure you want to delete this note?")) {

        this.ShowLoading = true;

      
        this.orderService.DeleteOrderNote(this.orderDTO.Id, note.Id)
        .subscribe(
            (response: OrderDTO) => {

                if (environment.debug_mode) {
                    console.log("AddOrderNote, response: " + JSON.stringify(response));
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

  AddNew(): void {

    this.ShowLoading = true;
  
    var orderNoteDTO = new OrderNoteDTO();
    orderNoteDTO.Note = this.newNote;
  
    this.orderService.AddOrderNote(this.orderDTO.Id, orderNoteDTO)
    .subscribe(
        (response: OrderDTO) => {

            if (environment.debug_mode) {
                console.log("AddOrderNote, response: " + JSON.stringify(response));
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

  Cancel(): void {
    this.Mode = 'List';
  }

  ngOnInit() {
      
      if (environment.debug_mode) {
        console.log("OrderNoteListDialog - Init, data: " + JSON.stringify(this.data));
      }

      this.orderDTO = this.data.order;
  }
}