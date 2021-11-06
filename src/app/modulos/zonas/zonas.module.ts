import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { PlantasComponent } from './plantas/plantas.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CrearDepartamentoComponent } from './departamentos/crear-departamento/crear-departamento.component';
import { CrearPlantaComponent } from './plantas/crear-planta/crear-planta.component';



@NgModule({
  declarations: [
    DepartamentosComponent,
    PlantasComponent,
    CrearDepartamentoComponent,
    CrearPlantaComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    

  ],

  
})
export class ZonasModule { }
