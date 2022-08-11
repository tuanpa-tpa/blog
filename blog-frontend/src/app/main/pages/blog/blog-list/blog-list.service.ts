import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BlogList, Categories } from 'app/main/models/Blog';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class BlogListService implements Resolve<any> {
  // Public
  public apiData: any;
  public onBlogListChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    this.onBlogListChanged = new BehaviorSubject({});
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

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
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


  public getData(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<BlogList>>>(
      `${environment.apiUrl}/blog/listtest`,
      this.option
    );
  }

  public getAllCategories(): Observable<any> {
    return this._httpClient.get<ResponseData<Categories>>(
      `${environment.apiUrl}/category/list`,
      this.option
    );
  }
  
  public getListBlog(body): Observable<ResponseData<PagedData<BlogList>>> {
    return this._httpClient.post<ResponseData<PagedData<BlogList>>>(
      `${environment.apiUrl}/blog/list`,body,
      this.option
    );
  }
}
