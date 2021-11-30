import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild(MatSidenav, {static: false }) menu: MatSidenav;

  public opcionesMenu : menuOpcion [] ;
  

  constructor(
    private router: Router,
    public auth: AuthService
    
  ) { 

    this.cargarRutas();
  }

  ngOnInit(): void {
    
    
  
  }

  public cargarRutas(){

    if(this.auth.usuario.role === 'usuario'){
      this.opcionesMenu = [
        {
          link:'comentarios',
          icon:'question_answer',
          nombre:'Comentarios'
        },
        {
        link:'crear-comentario',
        nombre:'Crear comentario',
        icon:'add_comment'
      },

    ];
    }

  }

  public windowWith(){
    return window.innerWidth;
  }

  public cerrarSesion(){

    this.auth.cerrarSesion().then( ()=>{

      //console.log('Cerro sesion');

      localStorage.clear();

      this.router.navigateByUrl('login', { replaceUrl: true});

    });

  }

  public cerrarMenu(){

    if( window.innerWidth < 1000){
      this.menu.close();
    }
  }


  public sideNavMode():string{

    if( window.innerWidth < 1000){
      return 'over';
    }else{
      return 'side';
    }

  }





}

interface menuOpcion{
  nombre:string;
  link:string;
  icon:string;
}
