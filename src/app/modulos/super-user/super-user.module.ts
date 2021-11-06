import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosSuperUserComponent } from './usuarios-super-user/usuarios-super-user.component';
import { DepuracionSuperUserComponent } from './depuracion-super-user/depuracion-super-user.component';
import { MenuSuperUserComponent } from './menu-super-user/menu-super-user.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { ComponentesModule } from '../componentes/componentes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ZonasModule } from '../zonas/zonas.module';
import { DepartamentosComponent } from '../zonas/departamentos/departamentos.component';
import { PlantasComponent } from '../zonas/plantas/plantas.component';

const routes : Routes = [
  {
    path:'',
    component: MenuSuperUserComponent,

    children:[
      {
        path:'',
        redirectTo:'usuarios',
        pathMatch:'full'
      },
      {
        path:'depuracion',
        component:DepuracionSuperUserComponent
      },
      {
        path:'usuarios',
        component: UsuariosSuperUserComponent
      },
      {
        path:'departamentos',
        component: DepartamentosComponent
      },
      {
        path:'plantas',
        component: PlantasComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    UsuariosSuperUserComponent,
    DepuracionSuperUserComponent,
    MenuSuperUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTableModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ComponentesModule,
    HttpClientModule,
    ZonasModule

  ]
})
export class SuperUserModule { }
