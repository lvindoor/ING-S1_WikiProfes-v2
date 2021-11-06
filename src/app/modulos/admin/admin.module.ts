import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';



import {MenuComponent} from './menu/menu.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { CrearNoticiaComponent } from './crear-noticia/crear-noticia.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { CrearCategoriaComponent } from './crear-categoria/crear-categoria.component';
import { CategoriaModalComponent } from './crear-categoria/categoria-modal/categoria-modal.component';
import { CrearNotificacionComponent } from './crear-notificacion/crear-notificacion.component';
import { HttpClientModule } from '@angular/common/http';

import { EstadisticaComponent } from './estadistica/estadistica.component';
import { GraficosComponent } from './estadistica/graficos/graficos.component';

// import SwiperCore from 'swiper/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EditarNoticiaComponent } from './editar-noticia/editar-noticia.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NoticiasModule } from '../noticias/noticias.module';
import { DepuracionUsuariosComponent } from './depuracion-usuarios/depuracion-usuarios.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ZonasModule } from '../zonas/zonas.module';
import { DepartamentosComponent } from '../zonas/departamentos/departamentos.component';
import { PlantasComponent } from '../zonas/plantas/plantas.component';
import { ExcelService } from 'src/app/services/excel.service';
import { ActividadUsuariosModule } from '../actividad-usuarios/actividad-usuarios.module';
import { IngresoAppComponent } from '../actividad-usuarios/ingreso-app/ingreso-app.component';
import { IngresoNoticiaComponent } from '../actividad-usuarios/ingreso-noticia/ingreso-noticia.component';

const routes : Routes =[
  {
    path:'',
    component: MenuComponent,
    children :[
      {
        path:'',
        redirectTo:'noticias',
        pathMatch:'full'
      },
      {
        path:'noticias',
        component: NoticiasComponent,
        children:[
          {
            path:':id'
          }
        ]
      },
      {
        path:'crear-noticia',
        component: CrearNoticiaComponent
      },
      {
        path:'usuarios',
        component: UsuariosComponent
      },
      {
        path:'categorias',
        component: CrearCategoriaComponent
      },
      {
        path:'crear-notificacion',
        component: CrearNotificacionComponent
      },
      {
        path:'estadisticas',
        component: EstadisticaComponent
      },
      {
        path:'mi-perfil',
        component: MiPerfilComponent
      },
      {
        path:'depuracion',
        component: DepuracionUsuariosComponent
      },
      {
        path:'departamentos',
        component: DepartamentosComponent
      },
      {
        path:'plantas',
        component: PlantasComponent
      },
      {
        path:'app',
        component: IngresoAppComponent
      }
    ]
  }
];

// const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
//   direction: 'horizontal',
//   slidesPerView: 'auto',
  
// };


@NgModule({
  declarations: [
    MenuComponent,
    CrearNoticiaComponent,
    UsuariosComponent,
    CrearCategoriaComponent,
    CategoriaModalComponent,
    CrearNotificacionComponent,
    EstadisticaComponent,
    GraficosComponent,
    EditarNoticiaComponent,
    DepuracionUsuariosComponent,
    
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    NgxChartsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    NoticiasModule,
    MatButtonModule,
    MatSelectModule,
    CKEditorModule,
    ZonasModule,
    ActividadUsuariosModule
  ]
 
  
})
export class AdminModule { }
