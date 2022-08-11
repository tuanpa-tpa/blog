import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogCreateService } from './blog-create.service';

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { title } from 'process';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Categories } from 'app/main/models/Blog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogCreateComponent implements OnInit, OnDestroy {
  public contentHeader: object;
  public data: any;
  public selectCategories: any[];
  public tmp: any[]=[];
  public selectCategoriesSelected = [];
  public formBlog: FormGroup;
  public featuredImage: string;
  public categotyList:any[] = [];
  public categoryTmpList: any[] = [];
  public userInfo: any;
  public fileName = undefined;



  uploadedImage: File;  
  dbImage: any; 
  postResponse: any;
  successResponse: string;
  image: any;

   // Private
   private _unsubscribeAll: Subject<any>;

   constructor(private _blogCreateService: BlogCreateService, private fb: FormBuilder, private router: Router, private httpClient: HttpClient) {
     this._unsubscribeAll = new Subject();
     this.formBlog = this.fb.group({
         title: [null],
         content: [null],
         img: [this.featuredImage],
         categories: [null],
     })
   }


  private readonly currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );
  private readonly token = this.currentUser.token;
  private option = {
    headers: {
      Authorization: "Bearer " + this.token,
    },
  };


  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.featuredImage = event.target.result;
      };

      this.fileName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  ngOnInit(): void {
    // this._blogCreateService.onBlogCreateChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    //   this.featuredImage = this.data.blogEdit.featuredImage;
    // });
    this.featuredImage = 'assets/images/slider/03.jpg';
    this.selectCategories = ['Java', 'Món Ăn']
    this._blogCreateService
      .getCategory()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        console.log(response)
        this.categotyList = response.data;
        console.log("cate")
      });
    this._blogCreateService
      .getUserInfo()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.userInfo = response;
        console.log("user")
        console.log(response);
      });
   

    // Content Header
    this.contentHeader = {
      headerTitle: 'Blog Edit',
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
            name: 'Create',
            isLink: true,
            link: '/pages/blogs/blog-create',
          },
        ],
      },
    };
  }

  seclectCategories(e) {
    console.log(e.category);
    this.formBlog.controls['categories'].setValue(e.category);
  }

  

  public onImageUpload(event) {    
    console.log("chọn ảnh")
    this.uploadedImage = event.target.files[0];
    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.featuredImage = event.target.result;
    };

    this.fileName = event.target.files[0].name;
    reader.readAsDataURL(event.target.files[0]);
  }


  imageUploadAction() {    
    const imageFormData = new FormData();
    imageFormData.append('image', this.uploadedImage, this.uploadedImage.name);
    console.log("ảnh")

    this.httpClient.post('http://localhost:8080/upload/image/', imageFormData, this.option)
      .subscribe((response) => {
        this.router.navigate(['/pages/blogs/blog-list']);
        if (response) { 
          this.router.navigate(['/pages/blogs/blog-list']);
         console.log("okok")
        } else {
          this.successResponse = 'Image not uploaded due to some error!';
        }
      }
      );
    }

  viewImage() {
    this.httpClient.get('http://localhost:8080/get/image/info/' + this.image)
      .subscribe(
        res => {
          this.postResponse = res;          
          this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
        }
      );
  }

  onSubmit() {

      this.formBlog.value.categories.forEach(e => {
      this.categoryTmpList.push(e.category)
    });
    
    console.log(this.categoryTmpList.join(','));
    

    const imageFormData = new FormData();


      imageFormData.append('img', this.uploadedImage, this.uploadedImage.name);
      imageFormData.append('title', this.formBlog.value.title);
      imageFormData.append('content', this.formBlog.value.content);
      // imageFormData.append('categories', this.formBlog.value.categories);
      imageFormData.append('categories', this.categoryTmpList.join(','));

      console.log("ảnh")
      this.httpClient.post('http://localhost:8080/blog/post', imageFormData, this.option)
        .subscribe((response) => {
          if (response) { 
            this.router.navigate(['/pages/blogs/blog-list']);
           console.log("okok")
          } else {
            this.successResponse = 'Image not uploaded due to some error!';
          }
        }
        );
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
