import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class StateProvinceCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

    this.eshop_api_url = environment.eshop_api_url;

  } 

  GetStateProvincesByCountryId(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/stateprovince/country/' + id;

    if (environment.debug_mode) {
      console.log("GetStateProvincesByCountryId: " + url);
    }

    return this.http.get(url);

  }

}
