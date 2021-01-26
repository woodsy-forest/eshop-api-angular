import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class CustomerCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetCustomerById(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/customer/' + id;

    if (environment.debug_mode) {
      console.log("GetCustomer: " + url);
    }

    return this.http.get(url);

  }

  GetCustomers(lastname: string, currentPage: number, pageSize: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/customer?lastname' + lastname + "&currentPage=" + currentPage + "&pageSize=" + pageSize;

    if (environment.debug_mode) {
      console.log("GetCustomers: " + url);
    }

    return this.http.get(url);

  }

}
