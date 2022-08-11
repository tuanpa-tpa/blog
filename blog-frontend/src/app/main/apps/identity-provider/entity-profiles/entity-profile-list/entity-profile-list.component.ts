import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CoreConfigService } from '@core/services/config.service';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { PagedData } from 'app/main/models/PagedData';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityProfileService } from '../entity-profile.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserInfo } from 'app/main/models/UserInfo';

@Component({
  selector: 'app-profile-list',
  templateUrl: './entity-profile-list.component.html',
  styleUrls: ['./entity-profile-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileListComponent implements OnInit, OnDestroy {
  minDate: Date;
  maxDate: Date;
  private _unsubscribeAll: Subject<any>;
  public SelectionType = SelectionType;
  public rowIndex: any;
  public formListProfile: FormGroup;
  public contentHeader: object;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public moreOption = true;
  public role;
  // public typeProfile = ['Cá nhân','Tổ chức','Thiết bị/dịch vụ'];
  //page setup
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public pagedData = new PagedData<UserInfo>();
  public rowsData = new Array<UserInfo>();
  public isLoading: boolean = false;
  //Table of personal data
  public totalItems: any = 0;
  public selected = [];
  public ColumnMode = ColumnMode;
  public chkBoxSelected = [];
  public dataExport: any;
  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private _entityProfileService: EntityProfileService,
    private dateAdapter: DateAdapter<any>,
    private _router: Router,
    private _toastrService: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 4, 0, 1);
    this.maxDate = new Date(currentYear + 2, 11, 31);
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.dateAdapter.setLocale(config.app.appLanguage);
      });
  }

  ngOnInit(): void {
    this.formListProfile = this.fb.group({
      contains: ['', Validators.required],
      fromDate: [null],
      sort: [null],
      toDate: [null],
      page: [null],
      size: [this.sizePage[3]]
    });
    // content header profile
    this.contentHeader = {
      headerTitle: 'Users',
      actionButton: true,
      breadcrumb: {
        type: 'chevron',
        links: [
          {
            name: 'Danh sách',
            isLink: false,
          },
        ],
      },
    };
  
    // end content header profile
    this.setPage({
      offset: 0,
      pageSize: this.formListProfile.get('size').value,
    });
    // this.getAllOrganizations();
    // this.getListTypeProfile();
  }
  // get seleted item
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log('Select Event', selected, this.selected);
  }
  customCheckboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  //Set Table View
  setPage(pageInfo) {
    console.log(pageInfo);
    this.isLoading = true;
    console.log(this.formListProfile.value);
    const body = {
      page: this.formListProfile.value.page,
      contains: this.formListProfile.value.contains,
      sort: this.formListProfile.value.sort,
      fromDate: this.formListProfile.value.fromDate,
      toDate: this.formListProfile.value.toDate,
      size: this.formListProfile.value.size,
    };
    console.log(body);
    this.formListProfile.patchValue({ page: pageInfo.offset });
    this._entityProfileService
      .getListProfiles(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagedData) => {
        this.totalItems = pagedData.data.totalItems;
        this.pagedData = pagedData.data;
        this.rowsData = pagedData.data.data.map((profileList: any) => ({
          ...profileList,
          // subjectDnAttribute: profileList.distinguishedName.map((d) => d.name),
          role: profileList.roles.map((d) => d.roleName),
          // typeProfile: profileList.endEntityProfileType,
        }));
        console.log(this.pagedData);
        console.log(this.rowsData);
        this.isLoading = false;
      });
  }
  // set active row
  onActivate(event) {
    if (
      event.event.type === 'click' &&
      event.column.name != 'Hành động' &&
      event.column.name != 'checkbox'
    ) {
      this._router.navigate([
        '/apps/ip/profiles/profile-edit',
        event.row.endEntityProfileId,
      ]);
    }
  }


  // selectOrganizationId(e) {
  //   this.formListProfile.controls['organizationId'].setValue(e.organizationId);
  //   console.log(e.organizationId);
  //   this.formListProfile.patchValue({
  //     organizationId: e.organizationId,
  //   })
  //   const body = {
  //     page: this.formListProfile.value.page,
  //     contains: this.formListProfile.value.contains,
  //     sort: this.formListProfile.value.sort,
  //     fromDate: this.formListProfile.value.fromDate,
  //     organizationId: this.formListProfile.value.organizationId,
  //     toDate: this.formListProfile.value.toDate,
  //     size: this.formListProfile.value.size,
  //   };
  //   console.log(body);
  //   this._entityProfileService
  //     .getListProfiles(JSON.stringify(body))
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((pagedData) => {
  //       this.totalItems = pagedData.data.totalItems;
  //       this.pagedData = pagedData.data;
  //       this.rowsData = pagedData.data.data.map((profileList: any) => ({
  //         ...profileList,
  //         subjectDnAttribute: profileList.distinguishedName.map((d) => d.name),
  //         subjectDnAlternative: profileList.alternativeName.map((d) => d.name),
  //         typeProfile: profileList.endEntityProfileType,
  //       }));
  //       console.log(this.pagedData);
  //       console.log(this.rowsData);
  //       this.isLoading = false;
  //     });
  // }
  // changeProfileType(e){
  //    this.formListProfile.controls['profileType'].setValue(e.endEntityProfileType);
  //    console.log(e.endEntityProfileType);
  //    this.formListProfile.patchValue({
  //      profileType: e.endEntityProfileType
  //    })
  //    const body = {
  //     page: this.formListProfile.value.page,
  //     contains: this.formListProfile.value.contains,
  //     sort: this.formListProfile.value.sort,
  //     fromDate: this.formListProfile.value.fromDate,
  //     profileType: this.formListProfile.value.profileType,
  //     toDate: this.formListProfile.value.toDate,
  //     size: this.formListProfile.value.size,
  //   };
  //   console.log(body);
  //   this._entityProfileService
  //     .getListProfiles(JSON.stringify(body))
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((pagedData) => {
  //       this.totalItems = pagedData.data.totalItems;
  //       this.pagedData = pagedData.data;
  //       this.rowsData = pagedData.data.data.map((profileList: any) => ({
  //         ...profileList,
  //         subjectDnAttribute: profileList.distinguishedName.map((d) => d.name),
  //         subjectDnAlternative: profileList.alternativeName.map((d) => d.name),
  //         typeProfile: profileList.endEntityProfileType,
  //       }));
  //       console.log(this.pagedData);
  //       console.log(this.rowsData);
  //       this.isLoading = false;
  //     });
  // }
  // get Organizations
  // remove profile item
  removeProfile(entityId) {
    console.log(entityId);
    this._entityProfileService.deleteProfileId(entityId).subscribe((res) => {
      if (res.result) {
        this.setPage({
          offset: 0,
          pageSize: this.formListProfile.get('size').value,
        });
      }
    });
  }

  deleteProfile(entityId) {
    this.confirmRemoveProfile(entityId);
    console.log(entityId);
  }
  confirmRemoveProfile(entityId) {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        return this.removeProfile(entityId);
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result: any) {
      console.log(result);
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  // end remove profile item
  // remove list profile
  removeListProfile() {
    this.confirmRemoveListProfile();
  }
  confirmRemoveListProfile() {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác điều này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      preConfirm: async () => {
        this.selected.map((profile) => {
          this.removeProfile(profile.endEntityProfileId);
        });
        this.chkBoxSelected = [];
      },
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Thoát',
      confirmButtonText: 'Đúng, tôi muốn xóa!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1',
      },
      allowOutsideClick: () => {
        return !Swal.isLoading();
      },
    }).then(function (result: any) {
      console.log(result);
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã xóa thành công',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      }
    });
  }
  // end remove list profile
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
