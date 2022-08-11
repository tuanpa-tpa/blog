import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PagedData } from "app/main/models/PagedData";
import { ResponseData } from "app/main/models/ResponseData";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { UserInfo } from "app/main/models/UserInfo";
import { Role } from "app/auth/models";

@Injectable({
  providedIn: "root",
})
export class EntityProfileService {
  constructor(private _httpClient: HttpClient) {}
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
  public getListProfiles(body): Observable<ResponseData<PagedData<UserInfo>>> {
    return this._httpClient.post<ResponseData<PagedData<UserInfo>>>(
      `${environment.apiUrl}/user/list`,body,
      this.option
    );
  }

  public getProfileId(id): Observable<ResponseData<UserInfo>> {
    return this._httpClient.get<ResponseData<UserInfo>>(
      `${environment.apiUrl}/user/${id}`,
      this.option
    );
  }
  public deleteProfileId(id): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}/user/delete/${id}`,
      this.option
    );
  }
  public getRoleUsername(username): Observable<any> {
    return this._httpClient.get<ResponseData<PagedData<UserInfo>>>(
      `${environment.apiUrl}/role/${username}`,
      this.option
    );
  }

  public updateRole(body): Observable<any> {
    return this._httpClient.put<any>(
      `${environment.apiUrl}/role/update`,body,
      this.option
    );
  }

}
