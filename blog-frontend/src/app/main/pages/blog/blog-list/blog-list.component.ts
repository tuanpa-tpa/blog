import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BlogListService } from 'app/main/pages/blog/blog-list/blog-list.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogListComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public categories: any;


  public rowIndex: any;
  public formListProfile: FormGroup;
  public sizePage: number[] = [5, 10, 15, 20, 50, 100];
  public moreOption = true;
  public role;
  // public typeProfile = ['Cá nhân','Tổ chức','Thiết bị/dịch vụ'];
  //page setup
  // public pagedData = new PagedData<Blog>();
  // public rowsData = new Array<UserInfo>();
  public isLoading: boolean = false;
  //Table of personal data
  public totalItems: any = 0;
  public selected = [];
  public chkBoxSelected = [];
  public dataExport: any;
  public pagedData: any;

  public contains: any;


  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;
  image: any;



  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {BlogListService} _blogListService
   */
  constructor(private _blogListService: BlogListService, private httpClient: HttpClient, private fb : FormBuilder) {
    this._unsubscribeAll = new Subject();
    this.formListProfile = this.fb.group({
      contains: [null],
    });
  }

  selectImg() {
    this.httpClient
    .get('http://localhost:8080/get/image/info/' + this.image)
    .subscribe((res) => {
      this.postResponse = res;
      this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
    });
  }


  onSubmit() {
    this.isLoading = true;
    console.log("djksajdkjakdasdsa");
    
    console.log(this.formListProfile.value.contains);
    const body = {
      page: 0,
      contains: this.formListProfile.value.contains,
      sort: null,
      fromDate: null,
      toDate: null,
      size: 1000,
    };
    // this.formListProfile.patchValue({ page: pageInfo.offset });
    this._blogListService
      .getListBlog(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.pagedData = response.data.data;
        
      });
  }

  



  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  ngOnInit(): void {
    // this._blogListService.onBlogListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    // });
    const body = {
      page: 0,
      contains: null,
      sort: null,
      fromDate: null,
      toDate: null,
      size: 1000,
    };

    this._blogListService
      .getListBlog(JSON.stringify(body))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          this.pagedData = response.data.data;
          console.log("list blog");
          console.log(response.data);
          console.log(response)
      });

      this._blogListService
      .getAllCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          this.categories = response;
          console.log('category');
          console.log(this.categories.data.categories);
          console.log(response);
      });



    // content header
    this.contentHeader = {
      headerTitle: 'Blog List',
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
            name: 'List',
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
