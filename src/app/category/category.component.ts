import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { CategoryService } from './category.service';
import { CategoryCommonService } from '../../services/category-common.service';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { PictureCommonService } from '../../services/picture-common.service';
import { PictureDTO } from '../../DTOs/PictureDTO';


@Component({
    selector: 'category',
    templateUrl: './category.component.html'
  })
export class CategoryComponent  implements OnInit { 

  public ShowLoading = false;
  public categoryDTOs: CategoryDTO[] = [];
  public allCategoryDTOs: CategoryDTO[] = [];
  public selCategoryDTO: CategoryDTO = new CategoryDTO();
  public Mode: string = '';
  public selectedFile: any;
  public PageTitle: string = '';
  public NavCategoryId: number = 0;
  public NavUpCategoryId: number = 0;
  public showCategoryLevelUp: boolean = false;

  constructor (
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: any,
    private categoryService: CategoryService,
    private pictureCommonService: PictureCommonService,
    private categoryCommonService: CategoryCommonService) {

  }

  ngOnInit(): void {

    this.titleService.setTitle("eShop Api Documentation: Category Api");

    if (!isPlatformServer(this.platformId)) {

      this.GetCategories();

      this.GetAllCategories();

    }
    else {

      if (environment.debug_mode) {
        console.log("CategoryComponent, ngOnInit(): app running on the server, skip GetCategories() for now.");
      }

    }

  }

  removePicture(): void {

    this.selCategoryDTO.Picture = new PictureDTO();

  }

  uploadPicture(): void {

    if (!this.selectedFile)
    {
      alert("Please choose a picture.");
      return;
    }

    this.ShowLoading = true;

    const reader = new FileReader();

    // Setup onload event for reader
    reader.onload = () => {
      // Store base64 encoded representation of file
      this.selCategoryDTO.Picture.FileAsBase64 = reader.result!.toString();
      this.selCategoryDTO.Picture.FileName = this.selectedFile.name;

      this.pictureCommonService.AddPicture(this.selCategoryDTO.Picture)
        .subscribe(
          (response: PictureDTO) => {
            if (environment.debug_mode) {
              console.log("uploadPicture, response: " + JSON.stringify(response));
            }

            this.selCategoryDTO.Picture.Id = response.Id;

            this.ShowLoading = false;
          }
          ,
          (error: HttpErrorResponse) => {
            console.log(error);
            alert("ERROR - STATUS:" + error.status + " - MESSAGE:" + error.error);
            this.ShowLoading = false;
          });

    }

    // Read the file
    reader.readAsDataURL(this.selectedFile);

  }

  SelUpCategory(): void {

    this.NavCategoryId =  this.NavUpCategoryId;
    this.GetCategories();

  }

  GetCategoryById(id: number): CategoryDTO {

    this.ShowLoading = true;

    var categoryDTO = new CategoryDTO();

    this.categoryService.GetCategoryById(id)
    .subscribe(
      (response: CategoryDTO) => {

        if (environment.debug_mode) {
          console.log("GetCategoryById, response: " + JSON.stringify(response));
        }

        categoryDTO = response;

        this.NavUpCategoryId = categoryDTO.ParentCategoryId;
        if(environment.debug_mode) {
          console.log("GetCategoryById, this.NavUpCategoryId: " + this.NavUpCategoryId);
        }
      
        this.ShowLoading = false;

      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });


      return categoryDTO;


  }

  SelSubCategories(categoryDTO: CategoryDTO): void {

    this.NavCategoryId = categoryDTO.Id;
    this.GetCategories();

  }

  selectParentCategpry(): void {
    if (environment.debug_mode) {
      console.log("selectParentCategpry changed, selCategoryDTO.ParentCategoryId: " + this.selCategoryDTO.ParentCategoryId);
    }
  }

  onFileChange(event: any) {
    this.selectedFile = null;
    if (environment.debug_mode) {
      console.log("event.target.files.length: " + event.target.files.length);
    }
    if (event.target.files && event.target.files.length > 0) {
      if (environment.debug_mode) {
        console.log(event.target.files[0]);
      }

      this.selectedFile = event.target.files[0];
      // Set FileName as Default for Attributes
      this.selCategoryDTO.Picture.AltAttribute = this.selectedFile.name;
      this.selCategoryDTO.Picture.TitleAttribute = this.selectedFile.name;

      if (environment.debug_mode) {
        console.log(this.selectedFile.name);
      }

      // Set theFile property
      //this.selectedFile.name = event.target.files[0].name;
      //this.selectedFile.size = event.target.files[0].size;
      //this.selectedFile.type = event.target.files[0].type;
      
    }
  }

  AddCategory(): void {

    this.ShowLoading = true;

    this.categoryService.AddCategory(this.selCategoryDTO)
    .subscribe(
      (response: CategoryDTO) => {

        if (environment.debug_mode) {
          console.log("AddCategory, response: " + JSON.stringify(response));
        }
      
        this.ShowLoading = false;
        this.GetCategories();
        alert("The Category " + this.selCategoryDTO.Name + " has been added");
        this.selCategoryDTO = new CategoryDTO();
        this.Mode = '';
      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });

  }

  DeleteCategory(categoryDTO: CategoryDTO): void {

    if (confirm("Are you sure you want to delete " + categoryDTO.Name + "?")) {

      this.ShowLoading = true;

      this.categoryService.DeleteCategory(categoryDTO.Id)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("DeleteCategory, response: " + JSON.stringify(response));
          }
        
          this.ShowLoading = false;
          this.categoryDTOs = this.categoryDTOs.filter(category => category.Id !== categoryDTO.Id);
          alert("The Category " + categoryDTO.Name +  " has been deleted.");
          this.selCategoryDTO = new CategoryDTO();
          this.Mode = '';
        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });

    }


  }

  UpdateCategory(): void {


    this.ShowLoading = true;

    this.categoryService.UpdateCategory(this.selCategoryDTO)
    .subscribe(
      (response: CategoryDTO) => {

        if (environment.debug_mode) {
          console.log("UpdateCategory, response: " + JSON.stringify(response));
        }
      
        this.ShowLoading = false;
        this.GetCategories();
        alert("The Category " + this.selCategoryDTO.Name + " has been updated.");
        this.selCategoryDTO = new CategoryDTO();
        this.Mode = '';
      }
      ,
      (err: HttpErrorResponse) => {

        console.log(err);
        alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
        this.ShowLoading = false;

      });

  }

  SelUpdateCategory(categoryDTO: CategoryDTO): void {
    this.selCategoryDTO = categoryDTO;
    this.PageTitle = "Update Category";
    this.Mode = "U";
    this.GetAllCategories();
  }

  SelAddCategory(): void {
    this.PageTitle = "Add New Category";
    this.Mode = "A";
    this.selCategoryDTO = new CategoryDTO();
    this.GetAllCategories();
  }

  GetCategories(): void {

    this.ShowLoading = true;
    
    this.categoryService.GetCategoryByParentId(this.NavCategoryId)
      .subscribe(
        (response: CategoryDTO[]) => {

          if (environment.debug_mode) {
            console.log("GetCategories, response: " + JSON.stringify(response));
          }

          this.categoryDTOs = response;

          this.showCategoryLevelUp = true;
          if (this.categoryDTOs.length > 0) {
              if (this.categoryDTOs[0].ParentCategoryId>0) {
                this.GetCategoryById(this.categoryDTOs[0].ParentCategoryId);
              }
              else {
                this.showCategoryLevelUp = false;
              }
          }
          else {
            if (this.NavCategoryId>0){
              this.GetCategoryById(this.NavCategoryId);
            }
            else {
              this.showCategoryLevelUp = false;
            }
          }
        
          this.ShowLoading = false;
        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });

  }


  GetAllCategories(): void {

    this.ShowLoading = true;
    
    this.categoryCommonService.GetCategories('')
      .subscribe(
        (response: CategoryDTO[]) => {

          if (environment.debug_mode) {
            console.log("response: " + JSON.stringify(response));
          }

          this.allCategoryDTOs = response;
        
          this.ShowLoading = false;
        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });

  }



}
