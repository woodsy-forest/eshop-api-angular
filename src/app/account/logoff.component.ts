import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
    template: ''
})
export class LogoffComponent  implements OnInit { 


    constructor (private authService: AuthService) {

    }


    ngOnInit(): void {


        if (environment.debug_mode) {
            console.log("Logging off...")
        }

        this.authService.logoff();
    }
}

