import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CustomerDTO } from '../../DTOs/CustomerDTO';


@Injectable()
export class CustomerService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }  

  UpdateCustomer(customerDTO: CustomerDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/customer';

    if (environment.debug_mode) {
      console.log("UpdateCustomer: " + url);
      console.log("UpdateCustomer Body: " + JSON.stringify(customerDTO));
    }

    return this.http.put<any>(url, JSON.stringify(customerDTO));

  }

}
