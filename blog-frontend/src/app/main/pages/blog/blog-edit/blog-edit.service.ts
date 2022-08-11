import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BlogDetails, Categories } from 'app/main/models/Blog';
import { PagedData } from 'app/main/models/PagedData';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class BlogEditService implements Resolve<any> {
  
  apiData: any;
  public onBlogCreateChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) {
    this.onBlogCreateChanged = new BehaviorSubject({});
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

  public getCategory(): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<Categories>>>(
      `${environment.apiUrl}/category/list`,
      this.option
    );
  }

  public getUserInfo(): Observable<any> {
    return this._httpClient.get<ResponseData<BlogDetails>>(
      `${environment.apiUrl}/user/info`,
      this.option
    );
  }
  
    public postImg(
      form: FormGroup
    ): Observable<ResponseData<BlogDetails>> {
      const formData = new FormData();
      formData.append('img', form.get('img').value);
      formData.append('title', form.get('title').value);
      formData.append('content', form.get('content').value);
      formData.append('categories', '["Java"]');
  
      console.log(formData);
      console.log(form.value);
      const option = {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      };
      return this._httpClient.post<any>(
        `${environment.apiUrl}/blog/post`,
        formData,
        this.option
      );
    }

    public test(body): Observable<ResponseData<BlogDetails>> {
      console.log(body)
      const option = {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      };
      return this._httpClient.post<any>(
        `${environment.apiUrl}/upload`,
        body,
        this.option
      );
    }

}
