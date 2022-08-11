import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ResponseData } from 'app/main/models/ResponseData';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  // Public
  public apiData: Message[];
  public onApiDataChange: BehaviorSubject<any>;
  public newNotification: BehaviorSubject<number>;
  public currentUser: User;
  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private _httpClient: HttpClient,
    private _authenticationService: AuthenticationService,
    private _toastrService: ToastrService
  ) {
    this.onApiDataChange = new BehaviorSubject(null);
    this.newNotification = new BehaviorSubject(0);
    this.currentUser = this._authenticationService.currentUserValue;
    const isLoggedIn = this.currentUser && this.currentUser.token;
    // this.requestPermission();
    if (isLoggedIn) {
      this.requestPermission();
      this.receiveMessage();
      this.getNotifications(15);
    }
  }

  public getNotifications(limit: number) {
    this._httpClient
      .get<ResponseData<Message[]>>(
        `${environment.apiUrl}/notification/${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.currentUser.token,
          },
        }
      )
      .subscribe((response: ResponseData<Message[]>) => {
        this.apiData = response.data;
        this.onApiDataChange.next(response.data);
      });
  }

  requestPermission() {
    this.angularFireMessaging.requestPermission
      .pipe(mergeMapTo(this.angularFireMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          /**
           * // send to server
           */
          if(Notification.permission === "granted"){
            this._httpClient
            .post(
              `${environment.apiUrl}/notification/refresh-token`,
              {
               "token":token
             }, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + this.currentUser.token,
                },
              }
            ).subscribe(res=>{
              console.log("Push tokenDevice to server: " + res);
            })
          }
           
        },
        (error) => {
          console.error(error);
        }
      );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      this._toastrService.info(
        payload.notification.body,
        payload.notification.title,
        {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
        }
      );
      console.log('new message received. ', payload);
      this.getNotifications(15);
      this.newNotification.next(this.newNotification.value + 1);
    });
  }
}
