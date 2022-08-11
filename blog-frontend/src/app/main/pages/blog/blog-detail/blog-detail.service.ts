import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BlogDetails, Categories, Comments } from 'app/main/models/Blog';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class BlogDetailService implements Resolve<any> {
  // Public
  public apiData: any;
  public onBlogDetailChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    this.onBlogDetailChanged = new BehaviorSubject({});
  }
  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  private readonly token = this.currentUser.token;
  private option = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
    },
  };

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Data
   */

  public getData(id): Observable<any> {
    return this._httpClient.get<ResponseData<BlogDetails>>(
      `${environment.apiUrl}/blog/details/${id}`,
      this.option
    );
  }

  public getComment(id): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Comments>>>(
      `${environment.apiUrl}/comment/list/${id}`,
      this.option
    );
  }

  public postComment(body, id): Observable<any> {
    console.log("body " + body);
    console.log("id post " + id);
    return this._httpClient.post<ResponseData<Comments>>(
      `${environment.apiUrl}/comment/post/${id}`,
      body,
      this.option
    );
  }

  public deleteBlog(id): Observable<any> {
    return this._httpClient.delete<ResponseData<BlogDetails>>(
      `${environment.apiUrl}/blog/delete/${id}`,
      this.option
    );
  }

  public getAllCategories(): Observable<any> {
    return this._httpClient.get<ResponseData<Categories>>(
      `${environment.apiUrl}/category/list`,
      this.option
    );
  }
}
