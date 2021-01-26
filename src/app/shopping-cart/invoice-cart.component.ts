import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartDTO } from '../../DTOs/ShoppingCartDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { ShoppingCartCommonService} from '../../services/shopping-cart-common.service';

@Component({
    selector: 'invoice-cart',
    templateUrl: './invoice-cart.component.html',
    styleUrls: ['./invoice-cart.component.scss']
  })
export class InvoiceCartComponent {

  public ShowLoading: boolean = false;
  public shoppingCartDTO: ShoppingCartDTO = new ShoppingCartDTO();

  constructor(
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private shoppingCartCommonService: ShoppingCartCommonService,
    @Inject(PLATFORM_ID) private platformId: any) {

        
      } // end contructor
    
    
      ngOnInit(): void {


        if (!isPlatformServer(this.platformId)) {

          this.ShowLoading = true;

          var cartId = this.shoppingCartCommonService.GetShoppingCartId();
      
          this.shoppingCartService.GetShoppingCart(cartId)
          .subscribe(
            (response: ShoppingCartDTO) => {
      
              if (environment.debug_mode) {
                console.log("GetShoppingCart, response: " + JSON.stringify(response)); 
              }
      
              this.shoppingCartDTO = response;
      
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
