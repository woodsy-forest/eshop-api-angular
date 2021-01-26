import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
  })
export class HomeComponent  implements OnInit { 

    constructor (
      private titleService: Title) {

    }

  ngOnInit(): void {

    this.titleService.setTitle("eShop Api Documentation: Home Page");

  }

}
