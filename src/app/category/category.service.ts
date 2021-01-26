import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryDTO } from '../../DTOs/CategoryDTO';


@Injectable()
export class CategoryService {

  public eshop_api_url = '';

  constructor(private http: HttpClient) {
      this.eshop_api_url = environment.eshop_api_url;
  }

  GetCategoryByParentId(parentId: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/category/parent/' + parentId;

    if (environment.debug_mode) {
      console.log("GetCategoryByParentId: " + url);
    }

    return this.http.get(url);

  }

  GetCategoryById(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/category/' + id;

    if (environment.debug_mode) {
      console.log("GetCategoryById: " + url);
    }

    return this.http.get(url);

  }

  AddCategory(categoryDTO: CategoryDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/category';

    if (environment.debug_mode) {
      console.log("AddCategory: " + url);
      console.log("AddCategory Body: " + JSON.stringify(categoryDTO));
    }

    return this.http.post<any>(url, JSON.stringify(categoryDTO));

  }

  UpdateCategory(categoryDTO: CategoryDTO): Observable<any> {


    const url: string = this.eshop_api_url + '/api/category';

    if (environment.debug_mode) {
      console.log("UpdateCategory: " + url);
      console.log("UpdateCategory Body: " + JSON.stringify(categoryDTO));
    }

    return this.http.put<any>(url, JSON.stringify(categoryDTO));

  }

  DeleteCategory(id: number): Observable<any> {

    const url: string = this.eshop_api_url + '/api/category/' + id;

    if (environment.debug_mode) {
      console.log("DeleteCategory: " + url);
    }

    return this.http.delete(url);

  }

}
