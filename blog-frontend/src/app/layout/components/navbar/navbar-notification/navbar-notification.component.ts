import { Component, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
// import { Message } from 'app/firebase/models/message';

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// // Interface
// interface notification {
//   messages: [];
//   systemMessages: [];
//   system: Boolean;
// }

interface notification {
  title: string;
  body: string;
  image: string;
  time: string;
  data: string;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
})
export class NavbarNotificationComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  // Public
  public notifications: notification[];
  public newNotification: number;
  public currentUser: User;
  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    private _toastrService: ToastrService,
    private _authenticationService: AuthenticationService
  ) {
    this._unsubscribeAll = new Subject();
    // this.requestPermission();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this.requestPermission();
    // this._notificationsService.getNotifications(15);
    this._notificationsService.onApiDataChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log('????????????????????');
        this.notifications = res;
      });
    this._notificationsService.newNotification
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.newNotification = res;
      });
  }

  // requestPermission() {
  //   if (!('Notification' in window)) {
  //     alert('This browser does not support desktop notification');
  //   }
  //   else if (Notification.permission === 'granted') {
  //     // var notification = new Notification('Hi there!');
  //     console.log("Notification granted!");
  //   }
  //   else if (Notification.permission !== 'denied') {
  //     this._toastrService.warning(
  //       "Nhấn vào chuông trên thanh công cụ phía trên để đăng ký nhận thông báo.",
  //       "Thông báo!",
  //       {
  //         positionClass: 'toast-top-center',
  //         toastClass: 'toast ngx-toastr',
  //         closeButton: true,
  //       }
  //     );
  //     Notification.requestPermission().then(function (permission) {
  //       if (permission === 'granted') {
  //         new Notification('Bật thông báo thành công!');
  //       }
  //     });

  //   }
  // }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
