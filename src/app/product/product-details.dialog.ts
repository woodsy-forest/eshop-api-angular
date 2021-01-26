import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'product-details',
  templateUrl: './product-details.dialog.html'
})
export class ProductDetailsDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
      
      if (environment.debug_mode) {
        console.log("ProductDetailsDialog - Init, product: " + JSON.stringify(this.data));
      }
  }
}