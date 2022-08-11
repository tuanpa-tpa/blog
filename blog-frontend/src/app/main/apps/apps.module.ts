import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes:Routes = [
  
  {
    path: 'ip',
    loadChildren: () => import('./identity-provider/identity-provider.module').then(m => m.IdentityProviderModule),
  },
  {
    path: "**",
    redirectTo: "/pages/miscellaneous/error", //Error 404 - Page not found
  },
]
@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  providers : [
    
  ],
})
export class AppsModule { }
