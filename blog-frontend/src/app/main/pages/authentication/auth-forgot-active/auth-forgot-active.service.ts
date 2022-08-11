import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthForgotActiveService {

  constructor(private _http: HttpClient) { }
  private option = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  reset(body): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/user/reset`, body,this.option);
  }
}
