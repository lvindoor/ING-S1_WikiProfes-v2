import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.css']
})
export class MenuUsuarioComponent implements OnInit {

  @ViewChild(MatSidenav, {static: false }) menu: MatSidenav;

  public windowWidth = window.innerWidth;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  public opcionesMenu: menuOpcion[] =[
    {
      nombre:'Noticias',
      link:'noticias',
      img:'article'
    },
    {
      nombre:'Mi perfil',
      link:'mi-perfil',
      img:'account_circle'
    }
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

  public cerrarSesion(){

    this.auth.cerrarSesion().then( ()=>{

      //console.log('Cerro sesion');
      localStorage.clear();
      this.router.navigateByUrl('login', { replaceUrl: true});

    });

  }

}


interface menuOpcion{
  nombre:string;
  link:string;
  img:string;
}