import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
    selector: 'not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
  })
export class NotFoundComponent {


  constructor(
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: any) {

        
      } // end contructor
    
    
      ngOnInit(): void {

        this.titleService.setTitle("eShop Api Documentation: Page Not Found");
        
      } //ngOnInit

}
