import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PictureDTO } from 'src/DTOs/PictureDTO';


@Injectable()
export class PictureCommonService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) { 

      this.eshop_api_url = environment.eshop_api_url;
  } 

  AddPicture(pictureDTO: PictureDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/picture';

    if (environment.debug_mode) {
      console.log("AddPicture: " + url);
      console.log("AddPicture Body: " + JSON.stringify(pictureDTO));
    }

    return this.http.post<any>(url, JSON.stringify(pictureDTO));

  }

}
