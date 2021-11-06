import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoticiasComponent } from '../admin/noticias/noticias.component';
import { MiPerfilComponent } from '../admin/mi-perfil/mi-perfil.component';
import { RouterModule, Routes } from '@angular/router';
import { MenuUsuarioComponent } from './menu-usuario/menu-usuario.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentesModule } from '../componentes/componentes.module';
import { NoticiasModule } from '../noticias/noticias.module';
import { MatSelectModule } from '@angular/material/select';

const routes :Routes =[
  {
    path:'',
    component: MenuUsuarioComponent,

    children:[
      {
        path:'',
        redirectTo:'noticias',
        pathMatch:'full'
      },
      {
        path: 'noticias',
        component: NoticiasComponent,
        children:[
          {
            path: ':id'
          }
        ]
      },
      {
        path:'mi-perfil',
        component: MiPerfilComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    MenuUsuarioComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    ComponentesModule,
    NoticiasModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule

    // 

  ]
})
export class UsuarioModule { }
