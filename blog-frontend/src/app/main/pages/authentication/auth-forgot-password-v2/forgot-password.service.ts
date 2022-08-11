import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  
  constructor(private _http: HttpClient) { }
  private option = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  forgotPassword(email): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/user/reset_password_code/${email}`, email,this.option);
  }

}
