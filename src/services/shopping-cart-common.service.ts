import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCartDTO } from '../DTOs/ShoppingCartDTO';
import { Guid } from '../core/guid';

@Injectable()
export class ShoppingCartCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  }
  
  ClearShoppingCartId(): void {
    localStorage.removeItem('eshop-cart-id');
  }

  GetShoppingCartId(): string {

    if (environment.debug_mode) {
      console.log("GetShoppingCartId, localStorage.getItem('eshop-cart-id'): " + localStorage.getItem('eshop-cart-id'));
    }

    if (localStorage.getItem('eshop-cart-id') == null) {
      //generate Guid
      var id = Guid.newGuid();

      if (environment.debug_mode) {
        console.log("GetShoppingCartId, Guid.newGuid(): " + Guid.newGuid());
      }

      //save Guid
      localStorage.setItem('eshop-cart-id', id);

      return id;
    }
    else {
    return localStorage.getItem('eshop-cart-id')!;
    }

  }

  UpdateShoppingCartItem(shoppingCartDTO: ShoppingCartDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/shoppingcart';

    if (environment.debug_mode) {
      console.log("UpdateShoppingCartItem: " + url);
      console.log("UpdateShoppingCartItem Body: " + JSON.stringify(shoppingCartDTO));
    }

    return this.http.put<any>(url, JSON.stringify(shoppingCartDTO));

  }

}
