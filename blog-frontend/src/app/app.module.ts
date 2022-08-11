import { OverlayModule } from "@angular/cdk/overlay";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule, CoreThemeCustomizerModule } from "@core/components";
import { CoreModule } from "@core/core.module";
import { FakeDbService } from "@fake-db/fake-db.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { coreConfig } from "app/app-config";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging/";
import { AppComponent } from "app/app.component";
import {
  JwtInterceptor
} from "app/auth/helpers"; // used to create fake backend
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { LayoutModule } from "app/layout/layout.module";
import { environment } from "environments/environment";
import "hammerjs";
import { ToastrModule } from "ngx-toastr"; // For auth after login toast
import { SpinnerComponent } from './main/loading/spinner/spinner.component';

const appRoutes: Routes = [
  {
    path: "pages",
    loadChildren: () =>
      import("./main/pages/pages.module").then((m) => m.PagesModule),
  },
  {
    path: "forms",
    loadChildren: () =>
      import("./main/forms/forms.module").then((m) => m.FormsModule),
      canActivate: [AuthGuard]
  },
  {
    path: "apps",
    loadChildren: () =>
      import("./main/apps/apps.module").then((m) => m.AppsModule),
      canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "/pages/blogs/blog-list",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  entryComponents: [ SpinnerComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OverlayModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true,
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled", // Add options right here
      relativeLinkResolution: "legacy",
      useHash: true 
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),
    
    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    OverlayModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
  ],
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy}
    
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
