import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BlogEditService } from 'app/main/pages/blog/blog-edit/blog-edit.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogEditComponent implements OnInit, OnDestroy {
  public contentHeader: object;
  public data: any;
  public dataCurrent: any;
  public selectCategories: any[];
  public tmp: any[]=[];
  public selectCategoriesSelected: any[] = [];
  public formBlog: FormGroup;
  public featuredImage: string;
  public categotyList:any[] = [];
  public categoryTmpList: any[] = [];
  public userInfo: any;
  public fileName = undefined;
  public tmpCategory: any[]=[];
  public checkUpload: boolean= false;

  public lastValue: any;
  public url = this.router.url;

  uploadedImage: File;  
  dbImage: any; 
  postResponse: any;
  successResponse: string;
  image: any;

   // Private
   private _unsubscribeAll: Subject<any>;

   constructor(private _blogEditService: BlogEditService, private fb: FormBuilder, private httpClient: HttpClient,  private router: Router) {
      this.url = this.router.url;
     this._unsubscribeAll = new Subject();
     this.formBlog = this.fb.group({
         title: ['title'],
         content: ['content'],
         img: [this.featuredImage],
         categories: [this.selectCategoriesSelected],
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

    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);


    this.featuredImage = 'assets/images/slider/03.jpg';
    this.selectCategories = ['Java', 'Món Ăn']
    this._blogEditService
      .getCategory()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        console.log(response)
        this.categotyList = response.data;
        
        console.log("cate")
      });
    this._blogEditService
      .getUserInfo()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.userInfo = response;
        console.log("user")
        console.log(response);
      });
   
      this._blogEditService
      .getData(this.lastValue)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
          console.log("ạdkjskdjskạdkakdjskạdksjdks");
          console.log(response);
          
          this.dataCurrent = response;
          this.tmpCategory = this.dataCurrent.data.tags;
          for (let index = 0; index < this.tmpCategory.length; index++) {
            this.selectCategoriesSelected.push(this.tmpCategory[index].categoryName);
          }
          this.formBlog.controls['categories'].setValue(this.selectCategoriesSelected);
          this.formBlog.controls['title'].setValue(this.dataCurrent.title)
          this.formBlog.controls['content'].setValue(this.dataCurrent.content)
          this.formBlog.controls['img'].setValue(this.dataCurrent.data.img)
          // this.formBlog.controls['title'].setValue(this.dataCurrent.title)
          this.httpClient.get('http://localhost:8080/get/image/info/' + this.dataCurrent.data.img)
          .subscribe(
            res => {
              this.postResponse = res;          
              this.featuredImage = 'data:image/jpeg;base64,' + this.postResponse.image;
            }
          );
          console.log(response)
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
            name: 'Edit',
            isLink: true,
            link: '/',
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
    this.checkUpload = true;
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

    this.httpClient.post(`${environment.apiUrl}/upload/image/`, imageFormData, this.option)
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

  viewImage() {
    this.httpClient.get(`${environment.apiUrl}/get/image/info/` + this.image)
      .subscribe(
        res => {
          this.postResponse = res;          
          this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
        }
      );
  }

  onSubmit() {

    // this.formBlog.value.categories.forEach(e => {
    //   this.categoryTmpList.push(e.category)
    // });
    
    this.formBlog.value.categories.forEach(e => {
      this.categoryTmpList.push(e.category)
    });
    // const body={
    //   img :this.featuredImage,
    //   title : this.formBlog.value.title,
    //   content : this.formBlog.value.content,
    //   categories : this.categoryTmpList,
    // }
      const imageFormData = new FormData();
      if (this.checkUpload) {
        imageFormData.append('img', this.uploadedImage, this.uploadedImage.name);
      }
      imageFormData.append('title', this.formBlog.value.title);
      imageFormData.append('id', this.lastValue);
      imageFormData.append('content', this.formBlog.value.content);
      // imageFormData.append('categories', this.formBlog.value.categories);
      imageFormData.append('categories', this.categoryTmpList.join(','));

      console.log("ảnh")
  
      this.httpClient.post(`${environment.apiUrl}/blog/update`, imageFormData, this.option)
        .subscribe((response) => {
          this.router.navigate(['/pages/blogs/blog-list']);
          if (response) { 
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
