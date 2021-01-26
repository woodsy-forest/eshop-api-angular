import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegisterDTO } from '../../DTOs/RegisterDTO';


@Injectable()
export class AccountService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }

  Login(email: string, password: string, rememberMe: boolean): Observable<any> {

    const url: string = this.eshop_api_url + '/api/account/login?email=' + email + '&password=' + password + '&rememberMe=' + rememberMe;

    if (environment.debug_mode) {
      console.log("Login: " + url);
    }

    return this.http.get(url);

  }

  ChangePassword(newPassword: string): Observable<any> {

  
    const url: string = this.eshop_api_url + '/api/account/change-password/' + newPassword;

    if (environment.debug_mode) {
      console.log("ChangePassword: " + url);
    }

    return this.http.put<any>(url, {});

  }

  EmailConfirmation(customerId: string): Observable<any> {

    const url: string = this.eshop_api_url + '/api/account/email-confirmation/' + customerId;

    if (environment.debug_mode) {
      console.log("EmailConfirmation: " + url);
    }

    return this.http.get(url);

  }

  ResetPassword(customerId: number): Observable<any> {

  
    const url: string = this.eshop_api_url + '/api/account/reset-password/' + customerId;

    if (environment.debug_mode) {
      console.log("ResetPassword: " + url);
    }

    return this.http.put<any>(url, {});

  }

  Register(registerDTO: RegisterDTO): Observable<any> {

    const url: string = this.eshop_api_url + '/api/account/register';

    if (environment.debug_mode) {
      console.log("Register: " + url);
      console.log("Register Body: " + JSON.stringify(registerDTO));
    }

    return this.http.post<any>(url, JSON.stringify(registerDTO));

  }

}
