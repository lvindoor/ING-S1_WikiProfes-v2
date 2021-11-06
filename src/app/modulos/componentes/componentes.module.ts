import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaComponent } from './alerta/alerta.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CargandoComponent } from './cargando/cargando.component';
import { ConfirmarComponent } from './confirmar/confirmar.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SlidesUrlPipe } from 'src/app/pipes/slides-url.pipe';





@NgModule({
  declarations: [
    AlertaComponent, 
    CargandoComponent, 
    ConfirmarComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule
    
  ]
  
})
export class ComponentesModule { }
