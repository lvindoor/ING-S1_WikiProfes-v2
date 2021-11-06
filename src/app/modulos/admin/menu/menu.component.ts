import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild(MatSidenav, {static: false }) menu: MatSidenav;
    
  constructor(
    public auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private matSnack: MatSnackBar,
    private notifiaciones:NotificacionesService
  ) {

   
   }

  ngOnInit( ): void {

    
   
  }

  public usuarioAutorizado(){

//http://universidadvirtual.sanmina.com/extras/API/GetEmployee/EmployeeNumber/${this.auth.usuario.employeeNumber}
    this.http.get(`http://universidadvirtual.sanmina.com/extras/API/GetEmployee/EmployeeNumber/${this.auth.usuario.employeeNumber}`)
    .subscribe( resp =>{
      console.log('Resp al autorizacion ', resp);

    },err=>{

      console.log('Error al verificar la autorizacion',err);

      this.mostrarSnack('Error no estas conectado o autorizado','snackRojo');

    });

  }

  public mostrarSnack( mensaje:string, color:string ){
    
    this.matSnack.open(mensaje, null, {
      duration: 3000,
      panelClass:color
    });
  
  }

  public cerrarSesion(){

    this.auth.cerrarSesion().then( ()=>{

      //console.log('Cerro sesion');

      localStorage.clear();
      this.notifiaciones.desuscribirse();

      this.router.navigateByUrl('login', { replaceUrl: true});

    });

  }
  
  
  public windowWidth = window.innerWidth;


    public opcionesMenu: menuOpcion[] =[
      {
        nombre:'Noticias',
        link:'noticias',
        img:'article'
      },
      {
        nombre:'Estadisticas',
        link:'estadisticas',
        img:'assessment'
      },
      {
        nombre:'Ingresos a la app',
        link:'app',
        img:'login'
      },
      {
        nombre:'Crear Noticia',
        link:'crear-noticia',
        img:'post_add'
      },
      {
        nombre:'Crear Notificacion',
        link:'crear-notificacion',
        img:'notification_add'
      },
      {
        nombre:'Categorias',
        link:'categorias',
        img:'list'
      },
      {
        nombre:'Usuarios',
        link:'usuarios',
        img:'supervised_user_circle'
      },
      {
        nombre:'Mi perfil',
        link:'mi-perfil',
        img:'account_circle'
      },
      {
        nombre:'Departamentos',
        link:'departamentos',
        img:'maps_home_work'
      },
      {
        nombre:'Plantas',
        link:'plantas',
        img:'apartment'
      }

      //
    ];

  
    public cerrarMenu(){

      if( this.windowWidth < 1000){
        this.menu.close();
      }
    }

  public sideNavMode():string{

    if( this.windowWidth < 1000){
      return 'over';
    }else{
      return 'side';
    }

  }

}

interface menuOpcion{
  nombre:string;
  link:string;
  img:string;
}
