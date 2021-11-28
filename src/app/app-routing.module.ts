import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
 {
   path : 'inicio',
   loadChildren : () => import('./principal/principal.module').then(modulo => modulo.PrincipalModule) 
 },
  {
    path:'',
    redirectTo:'inicio',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
