import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ShoppingCartService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }  

  GetShoppingCart(id: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/shoppingcart/' + id;

    if (environment.debug_mode) {
      console.log("GetShoppingCart: " + url);
    }

    return this.http.get(url);

  }

}
