import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';


import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { CargandoComponent } from './cargando/cargando.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InicioComponent } from './inicio/inicio.component';
import {MatTabsModule} from '@angular/material/tabs';


const routes : Routes =[
  {
    path:'',
    component: LoginComponent
  }, 
  {
    path:'comentarios',
    component: InicioComponent
  }
]


@NgModule({
  declarations: [
    LoginComponent,
    CargandoComponent,
    InicioComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule
  ]
})


export class PrincipalModule { }
