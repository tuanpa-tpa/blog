import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityProfileService } from '../entity-profile.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FlatpickrOptions } from 'ng2-flatpickr';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './entity-profile-edit.component.html',
  styleUrls: ['./entity-profile-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public formEdit: FormGroup;
  public lastValue: any;
  public roles: any;
  public tempRole: any;

  @ViewChild('accountForm') accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router, private _profileService: EntityProfileService, private fb: FormBuilder, private _router: Router) {
    this.url = this.router.url;
    this.formEdit = this.fb.group({
      role: [null],
      username: [null],
      email: [null],
      name: [null]
  })
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
    this.roles = ['Admin', 'User']

  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this._profileService
    .getProfileId(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
        this.currentRow = response;
        console.log(response)
    });
  }

  back() {
    this._router.navigate(['/apps/ip/profiles/profile-list']);
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

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      console.log('Submitted...!');
    }
  }


  
  selectRole(e) {
    console.log(e);
    this.formEdit.controls['role'].setValue(e);
  }


  onSubmit() {
    if (this.formEdit.value.role === 'Admin') {
      this.tempRole = ["ROLE_ADMIN","ROLE_USER"]
    } else {
      this.tempRole = ["ROLE_USER"]
    }

    const body = {
      username: this.formEdit.value.username,
      roles: this.tempRole
    }

    this._profileService
    .updateRole(JSON.stringify(body))
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
        this.currentRow = response;
        this._router.navigate(['/apps/ip/profiles/profile-list']);
        console.log(response)
    });

   
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {

    this._profileService
    .getProfileId(this.lastValue)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((response: any) => {
        this.currentRow = response;
        console.log(response)
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
