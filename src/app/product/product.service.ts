import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductDTO } from '../../DTOs/ProductDTO';


@Injectable()
export class ProductService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }


  GetProducts(currentPage: number, pageSize: number, filter: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/attribute?currentPage=' + currentPage + '&pageSize=' + pageSize + '&filter=' + filter;

    if (environment.debug_mode) {
      console.log("GetAttributes: " + url);
    }

    return this.http.get(url);

  }

  GetProductById(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/product/' + id;

    if (environment.debug_mode) {
      console.log("GetProductById: " + url);
    }

    return this.http.get(url);

  }

  DeleteProduct(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/product/' + id;

    if (environment.debug_mode) {
      console.log("DeleteProduct: " + url);
    }

    return this.http.delete(url);

  }

  AddProduct(productDTO: ProductDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/product';

    if (environment.debug_mode) {
      console.log("AddProduct: " + url);
      console.log("AddProduct Body: " + JSON.stringify(productDTO));
    }

    return this.http.post<any>(url, JSON.stringify(productDTO));

  }

  UpdateProduct(productDTO: ProductDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/product';

    if (environment.debug_mode) {
      console.log("UpdateProduct: " + url);
      console.log("UpdateProduct Body: " + JSON.stringify(productDTO));
    }

    return this.http.put<any>(url, JSON.stringify(productDTO));

  }

}
