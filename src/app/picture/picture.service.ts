import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class PictureService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }

  GetPictures(currentPage: number, pageSize: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/picture?currentPage=' + currentPage + '&pageSize=' + pageSize;

    if (environment.debug_mode) {
      console.log("GetPictures: " + url);
    }

    return this.http.get(url);

  }

  DeletePicture(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/picture/' + id;

    if (environment.debug_mode) {
      console.log("DeletePicture: " + url);
    }

    return this.http.delete(url);

  }
  

}
