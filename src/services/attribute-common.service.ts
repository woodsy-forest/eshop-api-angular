import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class AttributeCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetAttributes(currentPage: number, pageSize: number, filter: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/attribute?currentPage=' + currentPage + '&pageSize=' + pageSize + '&filter=' + filter;

    if (environment.debug_mode) {
      console.log("GetAttributes: " + url);
    }

    return this.http.get(url);

  }

}
