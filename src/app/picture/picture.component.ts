import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { PictureService } from './picture.service';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { PagedPictureDTO } from '../../DTOs/PagedPictureDTO';



@Component({
    selector: 'picture',
    templateUrl: './picture.component.html',
    styleUrls: ['./picture.component.scss']
  })
export class PictureComponent  implements OnInit, OnDestroy { 

  public ShowLoading: boolean = false;
  public pageSize: number = 2;
  public currentPage: number = 1;
  public pagedPictureDTO: PagedPictureDTO = new PagedPictureDTO();


    constructor (
        private titleService: Title,
        @Inject(PLATFORM_ID) private platformId: any,
        private pictureService: PictureService) {
    
    }
    
    ngOnInit(): void {
    
        this.titleService.setTitle("eShop Api Documentation: Picture Api");

        if (!isPlatformServer(this.platformId)) {

          this.GetPictures();

        }
        else {
          if (environment.debug_mode) {
            console.log("PictureComponent, ngOnInit(): app running on the server, skip obSearch for now.");
          }
        }
          
      } 

      RemovePicture(id: number): void {

        this.ShowLoading = true;
    
        this.pictureService.DeletePicture(id)
        .subscribe(
          (response: any) => {
    
            this.currentPage = 1;
            this.GetPictures();
                
          }
          ,
          (err: HttpErrorResponse) => {
    
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
    
          });

      }

      NavigateNext(): void {
        if (this.currentPage < this.pagedPictureDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetPictures();
        }
      }

      NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetPictures();
        }
      }

      NavigateFirst(): void {
        if (this.currentPage > 1) {
          this.currentPage = 1;
          this.GetPictures();
        }
      }

      NavigateLast(): void {
        if (this.currentPage < this.pagedPictureDTO.PageResult.PageCount) {
            this.currentPage = this.pagedPictureDTO.PageResult.PageCount;
            this.GetPictures();
        }
      }



      GetPictures(): void {

        this.ShowLoading = true;
    
        this.pictureService.GetPictures(this.currentPage, this.pageSize)
        .subscribe(
          (response: PagedPictureDTO) => {
    
            this.pagedPictureDTO = response;
                
            this.ShowLoading = false;
    
          }
          ,
          (err: HttpErrorResponse) => {
    
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
    
          });
    
      }

    

      ngOnDestroy(): void {
        // unsubscribe to ensure no memory leaks
      }

}