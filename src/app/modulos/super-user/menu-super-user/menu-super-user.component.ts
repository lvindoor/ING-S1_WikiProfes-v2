
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-super-user',
  templateUrl: './menu-super-user.component.html',
  styleUrls: ['./menu-super-user.component.css']
})
export class MenuSuperUserComponent implements OnInit {

  @ViewChild(MatSidenav, {static: false }) menu: MatSidenav;
    
  constructor(
    public auth: AuthService,
    private router: Router,
    private matSnack: MatSnackBar
  ) {

   
   }

  ngOnInit(): void {

  }

  public windowWidth = window.innerWidth;

  public opcionesMenu: menuOpcion[] =[
    {
      nombre:'Usuarios',
      link:'usuarios',
      img:'supervised_user_circle'
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
  ];

  public cerrarSesion(){

    this.auth.cerrarSesion().then( ()=>{

      //console.log('Cerro sesion');
      localStorage.clear();

      this.router.navigateByUrl('login', { replaceUrl: true});

    });

  }

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
