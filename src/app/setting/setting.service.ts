import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingDTO } from '../../DTOs/SettingDTO';


@Injectable()
export class SettingService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }


  GetSettings(currentPage: number, pageSize: number, filter: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/setting?currentPage=' + currentPage + '&pageSize=' + pageSize + '&filter=' + filter;

    if (environment.debug_mode) {
      console.log("GetSettings: " + url);
    }

    return this.http.get(url);

  }

  UpdateSetting(settingDTO: SettingDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/setting';

    if (environment.debug_mode) {
      console.log("UpdateSetting: " + url);
      console.log("UpdateSetting Body: " + JSON.stringify(settingDTO));
    }

    return this.http.put<any>(url, JSON.stringify(settingDTO));

  }

}
