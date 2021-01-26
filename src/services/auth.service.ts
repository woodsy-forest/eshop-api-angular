import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from "@angular/router";
import { TokenDTO } from '../DTOs/TokenDTO';
import { AuthMsgService } from './auth-msg.service';
import { DOCUMENT } from '@angular/common';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class AuthService {

  private loggedIn = false;
  private token: any;

  constructor(private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private authMsgService: AuthMsgService) { };

  public saveToken(token: string): void {
    localStorage.setItem('eshop-api-token', token);
    this.token = token;
  }

  public getToken(): string {
    if (!isPlatformServer(this.platformId)) {
      if (!this.token) {
        this.token = localStorage.getItem('eshop-api-token');
      }
      return this.token;
    }
    else {
      if (environment.debug_mode) {
        console.log("AuthService running on the server => getToken returns blank.");
      }
      return "";
    }
  }

  public forceHttps(): void {
    if (((this.document.location.protocol === 'http:')) &&
      (this.document.location.host.substr(0, 9) != 'localhost')) {
      this.document.location.href = this.document.location.href.replace('http://', 'https://');
    }
  }

  public logoff(): void {
    this.token = '';
    this.authMsgService.sendMessage(false);
    localStorage.removeItem('eshop-api-token');
    this.router.navigateByUrl('/');
  }

  // isLogged is true when there is a valid token!!!
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now().valueOf() / 1000;
    } 
    else {
      return false;
    }
  }

  public getUserDetails(): any {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  IsInRole(apiRole: string, userRoles: string[]): boolean {

   for (var i=0; i<userRoles.length; i++) {
        if (userRoles[i] == apiRole) {
            return true;
        }
   }

   return false;

}

  hasPermissionRole(role: string): boolean {
     
    let hasPermission: boolean = false;

    //if (environment.debug_mode){
    //  console.log("hasPermissionRole, getUserDetails=" + JSON.stringify(this.getUserDetails()));
    //}

    if (this.isLoggedIn()) {

      let tokenDTO: TokenDTO = this.getUserDetails();

      hasPermission = this.IsInRole(role, tokenDTO.roles);

    }

    return hasPermission; 

  }

  checkLogin(): boolean {


    if (!this.isLoggedIn()) {

      this.authMsgService.sendMessage(false);

      if (environment.debug_mode) {
        console.log("isLoggedIn(): " + this.isLoggedIn() + ", token not valid, redirect to the login page...");
      }
      this.router.navigate(['./login'])
    }

    return this.isLoggedIn();

  }

}


