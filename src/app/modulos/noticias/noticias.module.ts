import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DomseguroPipe } from 'src/app/pipes/domseguro.pipe';
import { MiPerfilComponent } from '../admin/mi-perfil/mi-perfil.component';
import { NoticiaComponent } from '../admin/noticias/noticia/noticia.component';
import { NoticiasComponent } from '../admin/noticias/noticias.component';
import { SliderComponent } from '../componentes/slider/slider.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { VerMasPipe } from 'src/app/pipes/ver-mas.pipe';
import { HtmlSeguroPipe } from 'src/app/pipes/html-seguro.pipe';
import { VistasZonasComponent } from './vistas-zonas/vistas-zonas.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NumeroEmpleadoComponent } from '../admin/mi-perfil/numero-empleado/numero-empleado.component';
import { MatInputModule } from '@angular/material/input';
import { SlidesUrlPipe } from 'src/app/pipes/slides-url.pipe';

@NgModule({
  declarations: [
    NoticiasComponent,
    NoticiaComponent,
    SliderComponent,
    DomseguroPipe,
    MiPerfilComponent,
    VerMasPipe,
    HtmlSeguroPipe,
    VistasZonasComponent,
    NumeroEmpleadoComponent,
    SlidesUrlPipe
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonModule,
    NgxChartsModule,
    MatSlideToggleModule,
    MatTableModule,
    MatCheckboxModule
    
  ],
  exports:[
    NoticiasComponent,
    NoticiaComponent,
    SliderComponent,
    DomseguroPipe,
    VerMasPipe,
    MiPerfilComponent,
    HtmlSeguroPipe,
    NumeroEmpleadoComponent,
    SlidesUrlPipe

  ]
})
export class NoticiasModule { }
