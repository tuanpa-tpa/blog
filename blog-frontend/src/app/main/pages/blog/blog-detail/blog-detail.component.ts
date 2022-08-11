import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BlogDetailService } from 'app/main/pages/blog/blog-detail/blog-detail.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public comments: any;
  public lastValue: any;
  public formComment: FormGroup;
  public url = this.router.url;
  public categories: any;
  // private
  private _unsubscribeAll: Subject<any>;
  public user: boolean = false;
  public admin: boolean = false;
  public username: string;

  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;
  image: any;

  //get currentUser
  private readonly currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );

  /**
   * Constructor
   *
   * @param {BlogEditService} _blogDetailsService
   */
  constructor(
    private _blogDetailsService: BlogDetailService,
    private router: Router,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    this.url = this.router.url;
    this._unsubscribeAll = new Subject();

    this.formComment = this.fb.group({
      comment: [null, Validators.required],
    });
    console.log(this.currentUser);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */

  ngOnInit(): void {
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);

    this._blogDetailsService
      .getData(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.data = response;
        console.log("testdjsdkjskajdkajkdsadsa");
        console.log(this.data);
        
        this.httpClient
        .get('http://localhost:8080/get/image/info/' + this.data.data.img)
        .subscribe((res) => {
          
          this.postResponse = res;
          this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
        });

        console.log(response);
      });

    this._blogDetailsService
      .getComment(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.comments = response;
        console.log(response);
      });

    this._blogDetailsService
      .getAllCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.categories = response;
        console.log(response);
      });

    if (this.currentUser.role.indexOf('ROLE_ADMIN') >= 0) {
      this.admin = true;
      return;
    }
    if (this.currentUser.role.indexOf('ROLE_USER') >= 0) {
      this.user = true;
      return;
    }
    this.username = this.currentUser.username;

    // content header
    this.contentHeader = {
      headerTitle: 'Blog Detail',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/',
          },
          {
            name: 'Detail',
            isLink: false,
          },
        ],
      },
    };
  }

  onSubmit() {
    this._blogDetailsService
      .postComment(JSON.stringify(this.formComment.value), this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        location.reload();
        console.log(response);
      });
  }

  onEdit() {
    console.log('/pages/blogs/blog-edit/' + this.lastValue);
    this.router.navigateByUrl('/pages/blogs/blog-edit/' + this.lastValue);
  }

  onDelete() {
    this._blogDetailsService
      .deleteBlog(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.router.navigate(['/pages/blogs/blog-list']);
        console.log(response);
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
