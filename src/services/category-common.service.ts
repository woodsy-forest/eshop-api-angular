import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class CategoryCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetCategories(filter: String): Observable<any> {

    const url: string = this.eshop_api_url + '/api/category?filter=' + filter;

    if (environment.debug_mode) {
      console.log("GetCategories: " + url);
    }

    return this.http.get(url);

  }

}
