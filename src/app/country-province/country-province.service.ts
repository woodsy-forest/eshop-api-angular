import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountryDTO } from '../../DTOs/CountryDTO';
import { StateProvinceDTO } from '../../DTOs/StateProvinceDTO';


@Injectable()
export class CountryProvinceService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }

  AddCountry(countryDTO: CountryDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/country';

    if (environment.debug_mode) {
      console.log("AddCountry: " + url);
      console.log("AddCountry Body: " + JSON.stringify(countryDTO));
    }

    return this.http.post<any>(url, JSON.stringify(countryDTO));

  }

  
  AddStateProvince(stateProvinceDTO: StateProvinceDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/stateprovince';

    if (environment.debug_mode) {
      console.log("AddStateProvince: " + url);
      console.log("AddStateProvince Body: " + JSON.stringify(stateProvinceDTO));
    }

    return this.http.post<any>(url, JSON.stringify(stateProvinceDTO));

  }

  DeleteCountry(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/country/' + id;

    if (environment.debug_mode) {
      console.log("DeleteCountry: " + url);
    }

    return this.http.delete(url);

  }

  DeleteStateProvince(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/stateprovince/' + id;

    if (environment.debug_mode) {
      console.log("DeleteStateProvince: " + url);
    }

    return this.http.delete(url);

  }

  UpdateCountry(countryDTO: CountryDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/country';

    if (environment.debug_mode) {
      console.log("UpdateCountry: " + url);
      console.log("UpdateCountry Body: " + JSON.stringify(countryDTO));
    }

    return this.http.put<any>(url, JSON.stringify(countryDTO
      ));
  }
  

}
