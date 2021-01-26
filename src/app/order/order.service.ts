import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OrderNoteDTO } from '../../DTOs/OrderNoteDTO';
import { OrderStatusDTO } from '../../DTOs/OrderStatusDTO';


@Injectable()
export class OrderService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  } 
  
  GetOrders(lastname: string, currentPage: number, pageSize: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/order?lastname=' + lastname + "&currentPage=" + currentPage + "&pageSize=" + pageSize;

    if (environment.debug_mode) {
      console.log("GetOrders: " + url);
    }

    return this.http.get(url);

  }

  AddOrderNote(orderId: number, orderNoteDTO: OrderNoteDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/order/' + orderId + '/note';

    if (environment.debug_mode) {
      console.log("AddOrderNote: " + url);
      console.log("AddOrderNote Body: " + JSON.stringify(orderNoteDTO));
    }

    return this.http.post<any>(url, JSON.stringify(orderNoteDTO));

  }

  DeleteOrderNote(orderId: number, id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/order/' + orderId + '/note/' + id;

    if (environment.debug_mode) {
      console.log("DeleteOrderNote: " + url);
    }

    return this.http.delete(url);

  }

  UpdateOrderStatus(orderId: number, orderStatusDTO: OrderStatusDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/order/' + orderId + '/status';

    if (environment.debug_mode) {
      console.log("UpdateOrderStatus: " + url);
      console.log("UpdateOrderStatus Body: " + JSON.stringify(orderStatusDTO));
    }

    return this.http.put<any>(url, JSON.stringify(orderStatusDTO));

  }

}
