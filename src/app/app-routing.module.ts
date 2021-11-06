import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { SuperUserGuard } from './guards/super-user.guard';

const routes: Routes = [
{
  path:'login',
  loadChildren:() => import('./modulos/login/login.module')
  .then( modulo => modulo.LoginModule),
  canLoad: [ LoginGuard]
},
{
  path:'',
  redirectTo:'login',
  pathMatch:'full',
  canLoad: [ LoginGuard]
},
{
  path:'admin',
  loadChildren: ()=> import('./modulos/admin/admin.module')
  .then( modulo => modulo.AdminModule),
  canLoad:[ AdminGuard]
},
{
  path:'super-user',
  loadChildren: ()=> import('./modulos/super-user/super-user.module')
  .then( modulo => modulo.SuperUserModule),
  canLoad:[ SuperUserGuard ]
},
{
  path:'inicio',
  loadChildren: ()=> import('./modulos/usuario/usuario.module')
  .then( modulo => modulo.UsuarioModule),
  canLoad: [ UserGuard ]
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
