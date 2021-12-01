import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearComentarioComponent } from './principal/crear-comentario/crear-comentario.component';
import { InicioComponent } from './principal/inicio/inicio.component';
import { LoginComponent } from './principal/login/login.component';
import { MenuComponent } from './principal/menu/menu.component';
import { SugerenciasComponent } from './principal/sugerencias/sugerencias.component';

const routes: Routes = [

  {
    path:'inicio',
    component: MenuComponent,
    children:[
      {
        path:'',
        redirectTo:'comentarios',
        pathMatch:'full'
      },
      {
        path:'comentarios',
        component: InicioComponent
      },
      {
        path:'crear-comentario',
        component: CrearComentarioComponent
      },
      {
        path:'sugerencias',
        component: SugerenciasComponent
      }
    ]
  }, 
//  {
//    path : 'inicio',
//    loadChildren : () => import('./principal/principal.module').then(modulo => modulo.PrincipalModule) 
//  },
 {
  path : 'login',
  component: LoginComponent
},
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
