import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PagedProductDTO } from '../../DTOs/PagedProductDTO';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs";
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './product.service';
import { ProductCommonService } from '../../services/product-common.service';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { CategoryCommonService } from '../../services/category-common.service';
import { AttributeCommonService } from '../../services/attribute-common.service';
import { ShoppingCartCommonService } from '../../services/shopping-cart-common.service';
import { ProductDTO } from '../../DTOs/ProductDTO';
import { ProductPictureDTO} from '../../DTOs/ProductPictureDTO';
import { ProductCategoryDTO } from '../../DTOs/ProductCategoryDTO';
import { ProductAttributeDTO } from '../../DTOs/ProductAttributeDTO';
import { PictureDTO } from '../../DTOs/PictureDTO';
import { PictureCommonService } from '../../services/picture-common.service';
import { AttributeDTO } from '../../DTOs/AttributeDTO';
import { PagedAttributeDTO } from '../../DTOs/PagedAttributeDTO';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProductAttributeValueDTO } from '../../DTOs/ProductAttributeValueDTO';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsDialog } from './product-details.dialog';
import { ShoppingCartDTO } from '../../DTOs/ShoppingCartDTO';
import { ConstantCartMode } from '../../core/constants/CartMode';
import { ShoppingCartItemDTO } from 'src/DTOs/ShoppingCartItemDTO';
import { ShoppingCartItemAttributeValueDTO } from '../../DTOs/ShoppingCartItemAttributeValueDTO';
import { Router } from "@angular/router";

@Component({
    selector: 'product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product.component.scss']
  })
export class ProductListComponent  implements OnInit, OnDestroy { 

    public pagedProductDTO: PagedProductDTO = new PagedProductDTO();
    public Mode: string = '';
    public ShowLoading: boolean = false;
    public search = new FormControl();
    public obSearch: Observable<any> = new Observable<any>();
    public pageSize: number = 10;
    public currentPage: number = 1;
    public categoryDTOs: CategoryDTO[] = [];
    public NavCategoryId: number = 0;
    public NavUpCategoryId: number = 0;
    public ProductListTitle: string = 'Product List';
    public LoadedCategories: boolean = true;
    public LoadedProducts: boolean = true;
    public selSortBy: string = 'displayOrder,ASC';
    public EditProductTitle: string = '';
    public selProductDTO: ProductDTO = new ProductDTO();
    public selTmpProductDTO: ProductDTO = new ProductDTO();
    public ShowNoCategoryFound: boolean = false;
    public ShowCategoryList: boolean = false;
    public searchCategory = new FormControl();
    public searchAttribute = new FormControl();
    public ShowLoadingCategory: boolean = false;
    public obCategory: Observable<any> = new Observable<any>();
    public obAttribute: Observable<any> = new Observable<any>();
    public productCategoryDTOs: CategoryDTO[] = [];
    public selProductPictureAltAttribute: string = '';
    public selProductPictureTitleAttribute: string = '';
    public selProductPictureDisplayOrder: number = 0;
    public selectedFile: any;
    public SelectedTab: string = 'Product';
    public ShowLoadingAttribute: boolean = false;
    public ShowNoAttributeFound: boolean = false;
    public ShowAttributeList: boolean = false;
    public productAttributeDTOs: AttributeDTO[] = [];
    public selectedProductAttributeId: number = 0;
    public displayProductAttributeValueIdPictureList: number = 0;
    public displayProductAttributeValuePictureList: boolean = false;
    public screenWidth: number = 0;
    public breakMedia: number = 599;
    public sideNavToggled: boolean = false;
    
 

    constructor (
        private titleService: Title,
        private productService: ProductService,
        private categoryCommonService: CategoryCommonService,
        private productCommonService: ProductCommonService,
        private attributeCommonService: AttributeCommonService,
        private shoppingCartCommonService: ShoppingCartCommonService,
        private router: Router,
        private pictureCommonService: PictureCommonService,
        public dialog: MatDialog,
        @Inject(PLATFORM_ID) private platformId: any) {  

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
              console.log("ProductListComponent, running on the server => ignore window.innerHeight");
            }
          }


    }

    ngOnInit(): void {

        this.sideNavToggled = false;
   
        this.titleService.setTitle("eShop Api Documentation: Product Api");

        if (isPlatformServer(this.platformId)) {
            if (environment.debug_mode) {
                console.log("ProductListComponent, the app is running on the server.");
            }
        }
        else {


            this.searchAttribute.setValue("");

            this.obAttribute = this.searchAttribute.valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter((val: string) => (val.length >= 1)),
                switchMap((search: string) => this.GetAttributeSearch(search)),
            );

            this.obAttribute.subscribe(
                (response: PagedAttributeDTO) => {
    
                  if (environment.debug_mode) {
                    console.log("GetAttributeSearch, response: " + JSON.stringify(response));
                    }
                
                  this.productAttributeDTOs = response.Attributes;
                  for (var i = 0; i<this.selProductDTO.Attributes.length; i++) {
                    this.productAttributeDTOs = this.productAttributeDTOs.filter(p => p.Id != this.selProductDTO.Attributes[i].Id);
                  }
    
                  this.ShowLoadingAttribute = false;
                  if (this.productAttributeDTOs.length == 0) {
                    this.ShowNoAttributeFound = true;
                    this.ShowAttributeList = false;
                  }
                  else {
                    this.ShowNoAttributeFound = false;
                    this.ShowAttributeList = true;
                  }
                
                },
                (err: HttpErrorResponse) => {
                
                  console.log(err);
                  alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                  this.ShowLoadingAttribute = false;
                  this.ShowAttributeList = false;
                  this.ShowNoAttributeFound = false;
                }
            ); 


            this.searchCategory.setValue("");

            this.obCategory = this.searchCategory.valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter((val: string) => (val.length >= 1)),
                switchMap((search: string) => this.GetCategorySearch(search)),
            );

            this.obCategory.subscribe(
                (response: CategoryDTO[]) => {
    
                  if (environment.debug_mode) {
                    console.log("GetCategorySearch, response: " + JSON.stringify(response));
                  }
                
                  this.productCategoryDTOs = response;
                  for (var i = 0; i<this.selProductDTO.Categories.length; i++) {
                    this.productCategoryDTOs = this.productCategoryDTOs.filter(p => p.Id != this.selProductDTO.Categories[i].Id);
                  }
    
                  this.ShowLoadingCategory = false;
                  if (this.productCategoryDTOs.length == 0) {
                    this.ShowNoCategoryFound = true;
                    this.ShowCategoryList = false;
                  }
                  else {
                    this.ShowNoCategoryFound = false;
                    this.ShowCategoryList = true;
                  }
                
                },
                (err: HttpErrorResponse) => {
                
                  console.log(err);
                  alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                  this.ShowLoadingCategory = false;
                  this.ShowCategoryList = false;
                  this.ShowNoCategoryFound = false;
                }
            ); 


            this.obSearch = this.search.valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter((val: string) => (val.length > 0)),
                switchMap((prod: string) => this.GetSearchProducts(prod))
            );
  
  
            this.obSearch.subscribe(
                (response: PagedProductDTO) => {
  
                    if (environment.debug_mode) {
                        console.log("GetSearchProducts, response: " + JSON.stringify(response));
                      }
              
                      this.pagedProductDTO = response;
                      this.LoadedProducts = true;
                    
                      if ((this.LoadedProducts) && (this.LoadedCategories)) {
                        this.ShowLoading = false;
                      }
     
                },
                (err: HttpErrorResponse) => {
                
                    console.log(err);
                    alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                    this.ShowLoading = false;
                }); 
  
            this.search.setValue("");

            this.GetCategories('');

        }

        if (!isPlatformServer(this.platformId)) {
          this.screenWidth = window.innerWidth;
        }

        //this is to prevent the splash page to display the menu icon,
        //until the download complete.
        if (this.screenWidth == undefined) {
          this.screenWidth = 1253;
        }

        if (environment.debug_mode) {
          console.log("ProductListComponent, initial screenWidth: " + this.screenWidth);
        }

    }

    sidenavToggle(): void {
      this.sideNavToggled = !this.sideNavToggled;
    }
    
    openProductDetails(product: ProductDTO): void {
      const dialogRef = this.dialog.open(ProductDetailsDialog, {
        width: '80%',
        data: {product}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (environment.debug_mode) {
          console.log("openProductDetails, result:" + JSON.stringify(result));
        }
      });
    }

    addToCart(product: ProductDTO, productAttributes: ProductAttributeDTO[]): void {
      if (environment.debug_mode) {
        console.log("Add to cart, product: " + JSON.stringify(product));
        console.log("Add to cart, productAttribute: " + JSON.stringify(productAttributes));
      }

      this.ShowLoading = true;

      var cart: ShoppingCartDTO = new ShoppingCartDTO();
      cart.Id = this.shoppingCartCommonService.GetShoppingCartId();
      cart.Mode = ConstantCartMode.Cart;
      var cartItem: ShoppingCartItemDTO = new ShoppingCartItemDTO();
      cartItem.Picture = product.Picture;
      cartItem.Id = product.Id;
      cartItem.Quantity = 1;
      for(var i=0; i<productAttributes.length;i++) {
        var cartItemAttributeValue: ShoppingCartItemAttributeValueDTO = new ShoppingCartItemAttributeValueDTO();
        cartItemAttributeValue.Id = productAttributes[i].SelectedAttributeValueId;
        cartItem.AttributeValues.push(cartItemAttributeValue);
      }
      cart.Items.push(cartItem);   

  
      this.shoppingCartCommonService.UpdateShoppingCartItem(cart)
      .subscribe(
        (response: any) => {

          if (environment.debug_mode) {
            console.log("addToCart, response: " + JSON.stringify(response));
          }
        
          this.ShowLoading = false;

          //redirect to ShoppingCart Page
          this.router.navigateByUrl('/cart');

        }
        ,
        (err: HttpErrorResponse) => {

          console.log(err);
          alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
          this.ShowLoading = false;

        });

    }

    setProductPicture(product:ProductDTO, productPicture: ProductPictureDTO): void {
      product.Picture = productPicture;
    }

    selectProductValue(product: ProductDTO, productAttribute: ProductAttributeDTO): void {

      if (environment.debug_mode) {
        console.log("selectProductValue, productAttribute.SelectedAttributeValueId: " + productAttribute.SelectedAttributeValueId);
      }

      if (product.Pictures.length > 0) {
        product.Picture.Id = product.Pictures[0].Id;
        product.Picture.AltAttribute =  product.Pictures[0].AltAttribute;
        product.Picture.TitleAttribute =  product.Pictures[0].TitleAttribute;
        product.Picture.FileAsBase64 =  product.Pictures[0].FileAsBase64;
      }

      for (var i=0; i<productAttribute.Values.length;i++) {

        if (productAttribute.Values[i].Id == productAttribute.SelectedAttributeValueId) {

          if (productAttribute.Values[i].Picture) {

            product.Picture.Id = productAttribute.Values[i].Picture.Id;
            product.Picture.AltAttribute =  productAttribute.Values[i].Picture.AltAttribute;
            product.Picture.TitleAttribute =  productAttribute.Values[i].Picture.TitleAttribute;
            product.Picture.FileAsBase64 =  productAttribute.Values[i].Picture.FileAsBase64;

          }

        }
      }

    }

    selectProductAttributeValuePictureList(attributeValueId: number) : void {
      this.displayProductAttributeValueIdPictureList = attributeValueId;
      this.displayProductAttributeValuePictureList = !this.displayProductAttributeValuePictureList;
    }

    selectProductAttributeValuePicture(attributeValue: ProductAttributeValueDTO, picture: PictureDTO): void {

      //set the picture to AttributeValue.Picture
      attributeValue.Picture = picture;

      //close the list
      this.displayProductAttributeValuePictureList = false;
    }
    
    deselectProductAttributeValuePicture(attributeValue: ProductAttributeValueDTO): void {

      //set the picture to AttributeValue.Picture
      attributeValue.Picture = new PictureDTO();

      //close the list
      this.displayProductAttributeValuePictureList = false;
    }
    displayProductAttributeValuePicture(attributeValue: ProductAttributeValueDTO): boolean {

        if (environment.debug_mode) {
          console.log("displayProductAttributeValuePicture, attributeValue: " + JSON.stringify(attributeValue));
        }

        if (!attributeValue.Picture) {
          if (environment.debug_mode) {
            console.log("displayProductAttributeValuePicture, return false");
          }
          return false;
        }

        if (attributeValue.Picture.Id > 0) {
          if (environment.debug_mode) {
            console.log("displayProductAttributeValuePicture, return true");
          }
          return true;
        }
        else {
          return false;
        }


    }

    DeleteProduct(productDTO: ProductDTO): void {

      if (confirm("Are you sure you want to delete " + productDTO.Name + "?")) {
  
        this.ShowLoading = true;
  
        this.productService.DeleteProduct(productDTO.Id)
        .subscribe(
          (response: any) => {
  
            if (environment.debug_mode) {
              console.log("DeleteProduct, response: " + JSON.stringify(response));
            }
          
            this.ShowLoading = false;
            this.currentPage = 1;
            this.GetProducts('');
            alert("The Product " + productDTO.Name +  " has been deleted.");
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

    selectProductAttribute(): void {
        if (environment.debug_mode) {
          console.log("selectProductAttribute changed, selectedProductAttributeId: " + this.selectedProductAttributeId);
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
          this.selProductPictureAltAttribute = this.selectedFile.name;
          this.selProductPictureTitleAttribute = this.selectedFile.name;
    
          if (environment.debug_mode) {
            console.log(this.selectedFile.name);
          }
    
          // Set theFile property
          //this.selectedFile.name = event.target.files[0].name;
          //this.selectedFile.size = event.target.files[0].size;
          //this.selectedFile.type = event.target.files[0].type;
          
        }
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
          var picture = new PictureDTO();
          picture.FileAsBase64 = reader.result!.toString();
          picture.FileName = this.selectedFile.name;
          picture.AltAttribute = this.selProductPictureAltAttribute;
          picture.TitleAttribute = this.selProductPictureTitleAttribute;
    
          this.pictureCommonService.AddPicture(picture)
            .subscribe(
              (response: PictureDTO) => {
                if (environment.debug_mode) {
                  console.log("uploadPicture, response: " + JSON.stringify(response));
                }

                var pictureDTO = response;
                var productPictureDTO = new ProductPictureDTO();
                productPictureDTO.Id = pictureDTO.Id;
                productPictureDTO.FileName = picture.FileName;
                productPictureDTO.AltAttribute = pictureDTO.AltAttribute;
                productPictureDTO.TitleAttribute = pictureDTO.TitleAttribute;
                productPictureDTO.FileAsBase64 = pictureDTO.FileAsBase64;
                productPictureDTO.DisplayOrder = this.selProductPictureDisplayOrder;
    
                this.selProductDTO.Pictures.push(productPictureDTO);

                //re-order pictures by DisplayOrder
                this.selProductDTO.Pictures.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1 );
 
                //reset vars
                this.selProductPictureDisplayOrder = 0;
                this.selProductPictureAltAttribute = '';
                this.selProductPictureTitleAttribute = '';
    
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

    getProductAttributeNameDisplay(productAttribute: ProductAttributeDTO): string {
      if (productAttribute.PromptText.length == 0) {
        return productAttribute.Name;
      }
      else {
        return productAttribute.PromptText;
      }
    }

    removeProductAttribute(attributeId: number): void {

      if (environment.debug_mode) {
        console.log("removeProductAttribute, attributeId: " + attributeId);
      }

      this.selProductDTO.Attributes = this.selProductDTO.Attributes.filter(a => a.Id != attributeId);
    }

    addNewProductAttributeValue(productAttributeId: number): void {
      var newValue = new ProductAttributeValueDTO();

      if (environment.debug_mode) {
        console.log("addNewProductAttributeValue, productAttributeId: " + productAttributeId);
        console.log("addNewProductAttributeValue, this.selProductDTO.Attributes.filter=" + JSON.stringify(this.selProductDTO.Attributes.filter(a => a.Id == productAttributeId)));
      }

      this.selProductDTO.Attributes.filter(a => a.Id == productAttributeId)[0].Values.push(newValue);
    
      this.selProductDTO.Attributes.filter(a => a.Id == productAttributeId)[0].Values.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1 );

    
    }

    DeleteProductAttributeValue(name: string): void {
      this.selProductDTO.Attributes.filter(a => a.Id == this.selectedProductAttributeId)[0].Values = this.selProductDTO.Attributes.filter(a => a.Id == this.selectedProductAttributeId)[0].Values.filter(n => n.Name != name);
    }

    changeInputDisplayOrder(event: any): void {
      if (environment.debug_mode) {
        console.log("changeInputDisplayOrder, types: " +  event.target.value);
      }
      this.selProductDTO.Pictures.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1 );
    }

    onDropProductPicture(event: CdkDragDrop<ProductPictureDTO[]>): void {

      var container: ProductPictureDTO = event.container.data[event.currentIndex];
      var previousContainer: ProductPictureDTO =  event.previousContainer.data[event.previousIndex];


      if (environment.debug_mode) {
        console.log("onDropProductPicture, container.Id: " + container.Id);
        console.log("onDropProductPicture, container.FileName: " + container.FileName);
        console.log("onDropProductPicture, container.DisplayOrder: " + container.DisplayOrder);
        console.log("onDropProductPicture, previousContainer.Id: " + previousContainer.Id);
        console.log("onDropProductPicture, previousContainer.FileName: " + previousContainer.FileName);
        console.log("onDropProductPicture, previousContainer.DisplayOrder: " + previousContainer.DisplayOrder);
        console.log("onDropProductPicture, event.previousIndex: " + event.previousIndex);
        console.log("onDropProductPicture, event.currentIndex: " + event.currentIndex);
      }

      if (previousContainer.DisplayOrder == container.DisplayOrder) {
        alert("You can not move the order when DisplayOrder of the two pictures are the same!")
      }
      else {
        //move picture in the list
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        //swap DisplayOrder
        var prevDisplayOrder  = event.previousContainer.data[event.previousIndex].DisplayOrder;
        event.previousContainer.data[event.previousIndex].DisplayOrder = event.container.data[event.currentIndex].DisplayOrder;
        event.container.data[event.currentIndex].DisplayOrder = prevDisplayOrder;
      }
    }

    GetAttributeSearch(search: string): any {

        this.ShowLoadingAttribute = true;
        return this.attributeCommonService.GetAttributes(1, 10, search);
  
    }
    

    GetCategorySearch(search: string): any {

        this.ShowLoadingCategory = true;
        return this.categoryCommonService.GetCategories(search);
  
    }

    changeInputCategory(event: any): void {

        this.ShowNoCategoryFound = false;
        this.ShowCategoryList = false;

        if (environment.debug_mode) {
          console.log("changeInputCategory: " + event.target.value)
        }
          
    } 

    changeInputAttribute(event: any): void {

        this.ShowNoAttributeFound = false;
        this.ShowAttributeList = false;

        if (environment.debug_mode) {
          console.log("changeInputAttribute: " + event.target.value)
        }
          
    } 

    RemoveProductCategory(productCategory: ProductCategoryDTO): void {

        this.selProductDTO.Categories = this.selProductDTO.Categories.filter(p => p.Id != productCategory.Id);

    }

    RemoveProductPicture(productPicture: ProductPictureDTO): void {

        this.selProductDTO.Pictures = this.selProductDTO.Pictures.filter(p => p.Id != productPicture.Id);

    }

    AddProductCategory(categoryDTO: CategoryDTO): void {

        if (environment.debug_mode) {
          console.log("AddProductCategory: " + categoryDTO.Name);
        }

        var productCategory = new ProductCategoryDTO();
        productCategory.Id = categoryDTO.Id;
        productCategory.Name = categoryDTO.Name;

        this.selProductDTO.Categories.push(productCategory);
        this.ShowCategoryList = false;
        this.searchCategory.setValue('');

    }

    AddProductAttribute(attributeDTO: AttributeDTO): void {

        if (environment.debug_mode) {
          console.log("AddProductAttribute: " + attributeDTO.Name);
        }

        var productAttribute = new ProductAttributeDTO();
        productAttribute.Id = attributeDTO.Id;
        productAttribute.Name = attributeDTO.Name;

        //pre-select
        this.selectedProductAttributeId = attributeDTO.Id;

        this.selProductDTO.Attributes.push(productAttribute);
        this.ShowAttributeList = false;
        this.searchAttribute.setValue('');

    }

    selectSortBy(): void {
        if (environment.debug_mode) {
            console.log("selectSortBy: " + this.selSortBy);
        }
        this.currentPage = 1;
        this.GetProducts(this.search.value);
    }

    selectCurrPage(): void {
        if (environment.debug_mode) {
            console.log("selectCurrPage: " + this.pageSize);
        }
        this.currentPage = 1;
        this.GetProducts(this.search.value);

    }

    GetProductAltAttribute(pictures: ProductPictureDTO[]): string {

        if (pictures.length > 0 ) {
            return pictures[0].AltAttribute;
        }
        else {
            return '';
        }
    }

    GetProductTitleAttribute(pictures: ProductPictureDTO[]): string {

        if (pictures.length > 0 ) {
            return pictures[0].TitleAttribute;
        }
        else {
            return '';
        }
    }

    GetProductPicture(pictures: ProductPictureDTO[]): string {

        if (pictures.length > 0 ) {
            return pictures[0].FileAsBase64;
        }
        else {
            return '';
        }
    }

    NavigateNext(): void {
        if (this.currentPage < this.pagedProductDTO.PageResult.PageCount) {
            this.currentPage += 1;
            this.GetProducts(this.search.value);
        }
      }

    NavigatePrevious(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.GetProducts(this.search.value);
        }
    }

    NavigateFirst(): void {
        if (this.currentPage > 1) {
            this.currentPage = 1;
            this.GetProducts(this.search.value);
        }
    }

    NavigateLast(): void {
        if (this.currentPage < this.pagedProductDTO.PageResult.PageCount) {
            this.currentPage = this.pagedProductDTO.PageResult.PageCount;
            this.GetProducts(this.search.value);
        }
    }
      
    SelSubCategories(categoryDTO: CategoryDTO): void {

        this.sideNavToggled = false;
        this.NavCategoryId = categoryDTO.Id;
        this.currentPage = 1;
        this.Mode = '';
        this.ProductListTitle = "Product List for: " + categoryDTO.Name;  
        this.GetProducts('');

    }

    GetCategories(search: string): void {

        this.ShowLoading = true;
        this.LoadedCategories = false;
        
        this.categoryCommonService.GetCategories(search)
          .subscribe(
            (response: CategoryDTO[]) => {
    
              if (environment.debug_mode) {
                console.log("GetCategories, response: " + JSON.stringify(response));
              }

              // RIORGANISE CATEGORIES IN A TREE - BEGIN
              var categories = response;
              var catBase = categories.filter(c => c.ParentCategoryId == 0);

              catBase.sort((a, b) => (b.DisplayOrder > a.DisplayOrder) ? 1 : (a.DisplayOrder === b.DisplayOrder) ? ((b.Name > a.Name) ? 1 : -1) : -1 );
              
              if (environment.debug_mode) {
                  console.log("GetCategories, catBase:");
                  for(var i=0; i<catBase.length;i++) {
                      console.log(catBase[i].Name);
                  }
              }

              while  (catBase.length > 0) {

                var cat = catBase.pop();
                this.categoryDTOs.push(cat!);

                var catTmp = categories.filter(c => c.ParentCategoryId == cat!.Id);
                catTmp.sort((a, b) => (b.DisplayOrder > a.DisplayOrder) ? 1 : (a.DisplayOrder === b.DisplayOrder) ? ((b.Name > a.Name) ? 1 : -1) : -1 );

                for (var i=0; i<catTmp.length;i++) {
                    catBase.push(catTmp[i]);
                }

                if (environment.debug_mode) {
                    console.log("GetCategories, catBase:");
                    for(var i=0; i<catBase.length;i++) {
                        console.log(catBase[i].Name);
                    }
                }


              }

              // RIORGANISE CATEGORIES IN A TREE - END

              //set first category, if any
              if ((this.categoryDTOs.length > 0) && (this.NavCategoryId == 0)) {
                  this.SelSubCategories(this.categoryDTOs[0]);
              }


              this.LoadedCategories = true;
            
              if ((this.LoadedProducts) && (this.LoadedCategories)) {
                this.ShowLoading = false;
              }
            }
            ,
            (err: HttpErrorResponse) => {
    
              console.log(err);
              alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
              this.ShowLoading = false;
    
            });
    
      }

    GetCategoryTreeLevel(categoryDTO: CategoryDTO): number {

        if (categoryDTO.ParentCategoryId == 0) {
            return 0;
        }

        var level = 0;

        var catLevel = [];
        catLevel.push(categoryDTO);

        while (catLevel.length > 0) {
            var tmp = catLevel.pop();
            for(var i=0; i<this.categoryDTOs.length;i++) {
                if (tmp!.ParentCategoryId == this.categoryDTOs[i].Id) {
                    level += 1;
                    catLevel.push(this.categoryDTOs[i]);
                    break;
                }
            }
        }

        return (level * 15);

    }

    AddProduct(): void {

        this.ShowLoading = true;
    
        this.productService.AddProduct(this.selProductDTO)
        .subscribe(
          (response: ProductDTO) => {
    
            if (environment.debug_mode) {
              console.log("AddProduct, response: " + JSON.stringify(response));
            }
          
            this.ShowLoading = false;
            this.currentPage = 1;
            this.GetProducts('')
            alert("The Product " + this.selProductDTO.Name + " has been added");
            this.selProductDTO = new ProductDTO();
            this.Mode = '';
          }
          ,
          (err: HttpErrorResponse) => {
    
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
    
          });
    
      }

      GetPrice(product: ProductDTO): number {

        var newPrice = product.Price;
        //calculate the actual price
        for (var i=0; i<product.Attributes.length;i++) {
          for(var j=0; j<product.Attributes[i].Values.length; j++)
          {
            if (product.Attributes[i].Values[j].Id == product.Attributes[i].SelectedAttributeValueId) {
              if (product.Attributes[i].Values[j].PriceAdjustmentUsePercentage) {
                newPrice += product.Price * product.Attributes[i].Values[j].PriceAdjustment / 100;
              }
              else {
                newPrice += product.Attributes[i].Values[j].PriceAdjustment;
              }
            }
          }
        }

        if (environment.debug_mode) {
          console.log("GetPrice: " + newPrice);
        }

        //calculate the discounts
        //productDiscounts has only valid discounts
        var tmpDiscountAmount = 0;
        for (var i=0;i<product.Discounts.length;i++) {
          if (product.Discounts[i].UsePercentage) {
              tmpDiscountAmount += newPrice * product.Discounts[i].DiscountPercentage / 100;
          }
          else {
              tmpDiscountAmount += product.Discounts[i].DiscountAmount;
          }
        }

        return newPrice - tmpDiscountAmount;
      }

    GetProductAttributeValuePriceAdjustment(price: number, productAttributeValue: ProductAttributeValueDTO): number {

      var priceAdjustment = 0;

      if (productAttributeValue.PriceAdjustmentUsePercentage) {
          priceAdjustment = price * productAttributeValue.PriceAdjustment / 100;
      }
      else {
        priceAdjustment = productAttributeValue.PriceAdjustment;
      }

      return priceAdjustment;

    }

    UpdateProduct(): void {


        this.ShowLoading = true;

        this.selProductDTO.ManageInventoryType = Number(this.selProductDTO.ManageInventoryType);
    
        this.productService.UpdateProduct(this.selProductDTO)
        .subscribe(
          (response: ProductDTO) => {
    
            if (environment.debug_mode) {
              console.log("UpdateProduct, response: " + JSON.stringify(response));
            }

            var updatedProductDTO = response;

            //updates product in the list
            for (var i=0; i<this.pagedProductDTO.Products.length;i++) {
              if (this.pagedProductDTO.Products[i].Id == updatedProductDTO.Id) {
                this.pagedProductDTO.Products[i] = updatedProductDTO;
              }
            }

            if (environment.debug_mode) {
              console.log("UpdateProduct, updated pagedProductDTO: " + JSON.stringify(this.pagedProductDTO));
            }

            this.ShowLoading = false;
            alert("The Product " + this.selProductDTO.Name + " has been updated.");

             this.Mode = '';
          }
          ,
          (err: HttpErrorResponse) => {
    
            console.log(err);
            alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
            this.ShowLoading = false;
    
          });
    
    }

    changeInputAttributeDisplayOrder(selectedProductAttributes: ProductAttributeDTO[]): void {
      selectedProductAttributes.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1 );
    }

    changeInputAttributeValueDisplayOrder(selectedProductAttributeValues: ProductAttributeValueDTO[]) {
      selectedProductAttributeValues.sort((a, b) => (a.DisplayOrder > b.DisplayOrder) ? 1 : -1 );
    }

    InputSearch_valuechange(event: any): void {

        this.currentPage = 1;
        this.Mode = '';

        if (event.target.value.length == 0) {
            this.ProductListTitle = "Product List for: ";  
        }
        else
        {
            this.ProductListTitle = "Search for: " + event.target.value;
        }
    
        if (environment.debug_mode) {
          console.log("InputSearch_valuechange: " + event.target.value)
        }
    }

    GetSearchProducts(search: string): any {

        this.ShowLoading = true;
        var categoryId = this.NavCategoryId;
        if (search.length > 0) {
            categoryId = 0;
        }

        var orderBy = this.selSortBy.split(',')[0];
        var orderType = this.selSortBy.split(',')[1];

        return this.productCommonService.GetProducts(categoryId, search, this.currentPage, this.pageSize, orderBy, orderType);
  
    }


    selTab(tab: string): void {

        this.SelectedTab = tab;

    }

    SelUpdateProduct(productDTO: ProductDTO) : void {

        this.Mode = "U";
        this.selProductDTO = productDTO;
        this.selTmpProductDTO = JSON.parse(JSON.stringify(productDTO));
        this.selProductPictureAltAttribute = '';
        this.selProductPictureTitleAttribute = '';
        this.selProductPictureDisplayOrder = 0;
        this.selectedProductAttributeId = 0;
        this.EditProductTitle = "Update Product";

    }

    SelAddProduct() : void {

        this.Mode = "A";
        this.selProductDTO = new ProductDTO();
        this.EditProductTitle = "Add New Product";

    }


    CancelEdit(): void {

      //restore any changes   
      for (var i=0; i<this.pagedProductDTO.Products.length;i++) {
        if (this.pagedProductDTO.Products[i].Id == this.selProductDTO.Id) {
          this.pagedProductDTO.Products[i] = JSON.parse(JSON.stringify(this.selTmpProductDTO));
        }
      }
      this.pagedProductDTO.Products

      if (environment.debug_mode) {
        console.log("CancelEdit, selTmpProductDTO: " + JSON.stringify(this.selTmpProductDTO));
      }

      this.Mode = '';

    }

    GetProducts(search: string): void {

        this.ShowLoading = true;
        this.LoadedProducts = false;

        var categoryId = this.NavCategoryId;
        if (search.length > 0) {
            categoryId = 0;
        }

        var orderBy = this.selSortBy.split(',')[0];
        var orderType = this.selSortBy.split(',')[1];

        this.productCommonService.GetProducts(categoryId, search, this.currentPage, this.pageSize, orderBy, orderType)
        .subscribe(
            (response: PagedProductDTO) => {

                if (environment.debug_mode) {
                    console.log("GetProducts, response: " + JSON.stringify(response));
                }

                this.pagedProductDTO = response;

                this.LoadedProducts = true;
                    
                if ((this.LoadedProducts) && (this.LoadedCategories)) {
                    this.ShowLoading = false;
                }

            }
            ,
            (err: HttpErrorResponse) => {

                console.log(err);
                alert("ERROR - STATUS: " + err.status + " - MESSAGE: " + err.error);
                this.ShowLoading = false;

            }
        );

    }

    ngOnDestroy(): void {
        // unsubscribe to ensure no memory leaks
      }

}