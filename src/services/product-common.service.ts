import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ProductCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetProducts(categoryId: number, productName: string, currentPage: number, pageSize: number, orderBy: string, orderType: string): Observable<any> {

  
    const url: string = this.eshop_api_url + '/api/product?categoryId=' + categoryId + '&productName=' + productName + '&currentPage=' + currentPage + '&pageSize=' + pageSize + '&orderBy=' + orderBy + '&orderType=' + orderType;

    if (environment.debug_mode) {
      console.log("GetProducts: " + url);
    }

    return this.http.get(url);

  }

}
