import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AttributeDTO } from '../../DTOs/AttributeDTO';


@Injectable()
export class AttributeService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }

  DeleteAttribute(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/attribute/' + id;

    if (environment.debug_mode) {
      console.log("DeleteAttribute: " + url);
    }

    return this.http.delete(url);

  }

  AddAttribute(attributeDTO: AttributeDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/attribute';

    if (environment.debug_mode) {
      console.log("AddAttribute: " + url);
      console.log("AddAttribute Body: " + JSON.stringify(attributeDTO));
    }

    return this.http.post<any>(url, JSON.stringify(attributeDTO));

  }

  UpdateAttribute(attributeDTO: AttributeDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/attribute';

    if (environment.debug_mode) {
      console.log("UpdateAttribute: " + url);
      console.log("UpdateAttribute Body: " + JSON.stringify(attributeDTO));
    }

    return this.http.put<any>(url, JSON.stringify(attributeDTO));

  }

}
