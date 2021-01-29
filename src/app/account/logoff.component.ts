import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';

@Component({
    template: ''
})
export class LogoffComponent  implements OnInit { 


    constructor (private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: any) {

    }


    ngOnInit(): void {


        if (environment.debug_mode) {
            console.log("Logging off...")
        }

        if (!isPlatformServer(this.platformId)) {
            this.authService.logoff();
        }
    }
}

