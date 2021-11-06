import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoAppComponent } from './ingreso-app/ingreso-app.component';
import { IngresoNoticiaComponent } from './ingreso-noticia/ingreso-noticia.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [
    IngresoAppComponent,
    IngresoNoticiaComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule, 
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    NgxChartsModule,
  ]
})
export class ActividadUsuariosModule { }
