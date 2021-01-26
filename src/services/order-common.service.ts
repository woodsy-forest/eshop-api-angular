import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDTO } from '../DTOs/CreateOrderDTO';


@Injectable()
export class OrderCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetOrderById(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/order/' + id;

    if (environment.debug_mode) {
      console.log("GetOrderById: " + url);
    }

    return this.http.get(url);

  }

  CreateCheckMoneyOrder(createOrderDto: CreateOrderDTO): Observable<any> {

    const url: string = this.eshop_api_url + '/api/order/check-money-order';

    if (environment.debug_mode) {
      console.log("CreateOrder: " + url);
    }

    return this.http.post<any>(url, JSON.stringify(createOrderDto));

  }

  CreatePayPalSmartPaymentOrder(cartId: string, orderId: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/order/paypal-smart-payment?cartId=' + cartId + '&orderId=' + orderId;

    if (environment.debug_mode) {
      console.log("CreatePayPalSmartPaymentOrder: " + url);
    }

    return this.http.post<any>(url, {});

  }

}
