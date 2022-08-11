import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ResponseData } from 'app/main/models/ResponseData';
import { UserInfo } from 'app/main/models/UserInfo';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AccountSettingsService implements Resolve<any> {

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

   public getProfileId(id): Observable<ResponseData<UserInfo>> {
    return this._httpClient.get<ResponseData<UserInfo>>(
      `${environment.apiUrl}/user/${id}`,
      this.option
    );
  }

  public getInfo(): Observable<ResponseData<UserInfo>> {
    return this._httpClient.get<ResponseData<UserInfo>>(
      `${environment.apiUrl}/user/info`,
      this.option
    );
  }

  public updateUser(body): Observable<ResponseData<UserInfo>> {
    return this._httpClient.put<ResponseData<UserInfo>>(
      `${environment.apiUrl}/user/update`, body,
      this.option
    );
  }

   public changePassword(body): Observable<ResponseData<UserInfo>> {
    return this._httpClient.post<ResponseData<UserInfo>>(
      `${environment.apiUrl}/user/change-password`, body,
      this.option
    );
  }
}
