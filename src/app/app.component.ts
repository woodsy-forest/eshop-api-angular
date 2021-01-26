import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthMsgService } from '../services/auth-msg.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { TokenDTO } from '../DTOs/TokenDTO';
import { ConstantRoles } from '../core/constants/Role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public TodayDate: Date = new Date();
  public screenWidth: number = 0;
  public breakMedia: number = 960;
  public sideNavToggled: boolean = false;
  public IsAuthenticated: boolean = false;
  public currYear: number = 2021;
  public subIsAuth: Subscription = new Subscription();
  public Welcome: string = "";
  public IsAdmin = false;
  public displaySubAccountApi: boolean = false;
  public ShowAccountAPI: boolean = false;
  public ShowCatalogAPI: boolean = false;
  public ShowMyAccount: boolean = false;

  public constructor(private authMsgService: AuthMsgService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: any,
    private authService: AuthService ) {


      if (!isPlatformServer(this.platformId)) {

        window.onresize = () => {
          this.screenWidth = window.innerWidth;

          if (this.screenWidth > this.breakMedia) {
            this.sideNavToggled = false;
          }

          if (environment.debug_mode) {
            console.log("MainNavComponent, innerHeight: " + window.innerHeight);
          }

        };
      }
      else {
        if (environment.debug_mode) {
          console.log("MainNavComponent, running on the server => ignore window.innerHeight");
        }
      }

  }

  public ngOnInit(): void { 

    this.currYear = (new Date()).getFullYear();

    this.sideNavToggled = false;

    if (!isPlatformServer(this.platformId)) {
		const bases = this.document.getElementsByTagName('base');

		if (bases.length > 0) {
			bases[0].setAttribute('href', environment.baseHref);
		}
	}

	if (environment.debug_mode) {
		console.log("AppComponent, isPlatformServer(this.platformId):" + isPlatformServer(this.platformId));
	}

	this.IsAuthenticated = this.authService.isLoggedIn();  

	if (environment.debug_mode) {
		console.log("AppComponent, IsAuthenticated=" + this.IsAuthenticated);
	}

	this.subIsAuth = this.authMsgService.getMessage()
	.subscribe(message => {
		this.procSubscribe(message);

	});
	

	//Reactive SendMessage if it is still LoggedIn
	//After closing the browser and reopen it.
	if (this.authService.isLoggedIn()) {
		this.procSubscribe(true);
	}

    if (!isPlatformServer(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
	
	if (environment.debug_mode) {
		console.log("MainNavComponent, initial screenWidth: " + this.screenWidth);
	}

	//this is to prevent the splash page to display the menu icon,
	//until the download complete.
	if (this.screenWidth == undefined) {
		this.screenWidth = 1253;
	}

	if (environment.debug_mode) {
		console.log("MainNavComponent, initial screenWidth: " + this.screenWidth);
    }

  }

  procSubscribe(message: boolean) {

		this.IsAuthenticated = message as boolean;
	
		if (environment.debug_mode) {
		  console.log('MainNavComponent, authMsgService.getMessage()=' + message);
		}

		var tokenDTO: TokenDTO = this.authService.getUserDetails();

		if (tokenDTO != null) { 
			this.Welcome = "Welcome " + tokenDTO.customerfirstname + " " + tokenDTO.customerlastname;
		}


		if (environment.debug_mode) {
		  console.log("Role Admin: " + this.authService.hasPermissionRole(ConstantRoles.Admin));
		  console.log("Role Registered: " + this.authService.hasPermissionRole(ConstantRoles.Registered));
		}

		//Admin can see debug mode.
		this.IsAdmin = false;
		if (this.IsAuthenticated) {
			if (this.authService.hasPermissionRole(ConstantRoles.Admin)) {
			environment.debug_mode = true;
			this.IsAdmin = true;
			}
		}
  }
  
  OpenMyAccount(): void {
    this.ShowMyAccount = !this.ShowMyAccount;
    this.ShowCatalogAPI = false;
    this.ShowAccountAPI = false;
  }

  OpenAccountAPI(): void {
    this.ShowAccountAPI = !this.ShowAccountAPI;
    this.ShowCatalogAPI = false;
    this.ShowMyAccount = false;
  }

  OpenCatalogAPI(): void {
    this.ShowCatalogAPI = !this.ShowCatalogAPI;
    this.ShowAccountAPI = false;
    this.ShowMyAccount = false;
  }

  sidenavToggle(): void {
    this.sideNavToggled = !this.sideNavToggled;
  }

  SelectedMenu(): void {
    this.sideNavToggled = false;
    this.ShowAccountAPI = false;
    this.ShowCatalogAPI = false;

    //------------------------------------------
    // Check valid login - begin
    //------------------------------------------
    if (environment.debug_mode) {
      console.log("SelectedMenu, isLoggedIn()=" + this.authService.isLoggedIn());
    }
    this.authMsgService.sendMessage(this.authService.isLoggedIn());
    //------------------------------------------
    // Check valid login - begin
    //------------------------------------------
  }


  MainDivClick(): void {
    if (environment.debug_mode) {
      console.log("Clicked on MainDivClick()");
    }
    //this.sideNavToggled = false;
  }

  MenuDivClick(): void {
    if (environment.debug_mode) {
      console.log("Clicked on Menu Div.");
    }
    this.sideNavToggled = false;
  }  

  TitleDivClick(): void {
    if (environment.debug_mode) {
      console.log("Clicked on Title Div.");
    }
    this.sideNavToggled = false;
  }

  WelcomeDivClick(): void {
    if (environment.debug_mode) {
      console.log("Clicked on Welcome Div.");
    }
    this.sideNavToggled = false;
  }

  RouterOutLetClick(): void {
    if (environment.debug_mode) {
      console.log("Clicked on Router Outlet Component.");
    }
    this.sideNavToggled = false;
  }

  ngOnDestroy(): void {
	// unsubscribe to ensure no memory leaks
	this.subIsAuth.unsubscribe();
  }

}
