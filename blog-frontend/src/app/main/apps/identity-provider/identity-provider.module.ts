import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProfileModule } from './entity-profiles/entity-profile.module';


/**
 * Routing
 */

const routes: Routes = [
  {
    path : 'profiles',
    loadChildren:()=> import('./entity-profiles/entity-profile-routing.module').then(m => m.ProfileRoutingModule)
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", // Error 404 - Page not found
  },
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    ProfileModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'Không có dữ liệu', // Message to show when array is presented, but contains no values
        totalMessage: 'tổng', // Footer total message
        selectedMessage: 'selected' // Footer selected message
      }
    }),
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ReactiveFormsModule, 
  ],
  providers: [ 
  ],
})
export class IdentityProviderModule {
  constructor() {}
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {}
}
