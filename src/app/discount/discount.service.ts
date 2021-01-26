import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DiscountDTO } from '../../DTOs/DiscountDTO';


@Injectable()
export class DiscountService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }


  GetDiscounts(currentPage: number, pageSize: number, filter: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/discount?currentPage=' + currentPage + '&pageSize=' + pageSize + '&filter=' + filter;

    if (environment.debug_mode) {
      console.log("GetDiscounts: " + url);
    }

    return this.http.get(url);

  }

  DeleteDiscount(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/discount/' + id;

    if (environment.debug_mode) {
      console.log("DeleteDiscount: " + url);
    }

    return this.http.delete(url);

  }

  AddDiscount(discountDTO: DiscountDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/discount';

    if (environment.debug_mode) {
      console.log("AddDiscount: " + url);
      console.log("AddDiscount Body: " + JSON.stringify(discountDTO));
    }

    return this.http.post<any>(url, JSON.stringify(discountDTO));

  }

  UpdateDiscount(discountDTO: DiscountDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/discount';

    if (environment.debug_mode) {
      console.log("UpdateDiscount: " + url);
      console.log("UpdateDiscount Body: " + JSON.stringify(discountDTO));
    }

    return this.http.put<any>(url, JSON.stringify(discountDTO));

  }

}
