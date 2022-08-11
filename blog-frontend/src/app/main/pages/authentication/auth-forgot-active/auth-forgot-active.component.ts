
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthForgotActiveService } from './auth-forgot-active.service';

@Component({
  selector: 'app-auth-forgot-active',
  templateUrl: './auth-forgot-active.component.html',
  styleUrls: ['./auth-forgot-active.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthForgotActiveComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public submitted = false;
  public roles = ['USER'];
  public notifiFalse = false;
  // public typeSubscription = ['Tổ chức','Cá nhân','Thiết bị/dịch vụ'];
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param {AuthRegisterV2Service} _registerService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _forgotService: AuthForgotActiveService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    console.log('check submit');
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.confirmOpen();
  }

  confirmOpen() {
    const request = JSON.stringify({
      code: this.f.code.value,
      password: this.f.password.value,
    });
    Swal.fire({
      title: 'Các thông tin không thể sửa đổi',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        return await this._forgotService
          .reset(request)
          .pipe(first())
          .pipe(takeUntil(this._unsubscribeAll))
          .toPromise()
          .then((res) => {
            if (res.result == false) {
              throw new Error(res.message);
            }
            return res;
          })
          .catch(function (error) {
            Swal.showValidationMessage('Mã lỗi:  ' + error + '');
          });
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, thông tin chính xác!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Thông tin tài khoản đã được cập nhật. Vui lòng kiểm tra email để kích hoạt tài khoản.',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group(
      {
        code: ['', [Validators.required]],
        password: ['', Validators.required],
        confPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confPassword'),
      }
    );

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
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

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl?.errors && !matchingControl?.errors?.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
