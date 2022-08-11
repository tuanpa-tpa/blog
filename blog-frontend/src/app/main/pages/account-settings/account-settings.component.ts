import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';

import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public returnUrl: string;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  public formEdit: FormGroup;
  public formPassowrd: FormGroup;
  public lastValue: any;



  public username: any;
  public name: any;
  public email: any;
  public passOld: any;
  public passNew: any;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService, private fb: FormBuilder, private router: Router, private _route: ActivatedRoute) {
    this.lastValue = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this._unsubscribeAll = new Subject();
   
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmitInfo() {
    const body = {
      name: this.name
    }
    console.log(body);

    this._accountSettingsService
      .updateUser(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          console.log(response)
      });
      this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
      window.location.href = this.returnUrl;
  }
  onSubmitPassword() {
    const body = {
      oldPassword: this.passOld,
      newPassword: this.passNew
    }
    console.log(body);

    this._accountSettingsService
      .changePassword(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          console.log(response)
      });

      this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
      window.location.href = this.returnUrl;

      localStorage.removeItem('currentUser');
      location.reload;
      // notify
  }

  clickCancel() {
    this.username = this.data.data.username;
    this.name = this.data.data.name;
    this.email = this.data.data.email;
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    console.log("abc");
    
    this._accountSettingsService
      .getInfo()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          this.data = response;
          this.username = response.data.username;
          this.name = response.data.name;
          this.email = response.data.email;
          console.log(response)
      });
    // content header
    this.contentHeader = {
      headerTitle: 'Account Settings',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Account Settings',
            isLink: false
          }
        ]
      }
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
