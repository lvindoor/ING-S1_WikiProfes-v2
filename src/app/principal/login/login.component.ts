import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { IUsuario, IUsuarioGoogle }  from '../../modelos/usuario';
import { CargandoComponent } from '../cargando/cargando.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor( 
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private matDialog: MatDialog,
    private auth: AuthService,
    private router: Router,
    private matSnack: MatSnackBar
    ) {

      this.afAuth.getRedirectResult().then( (usuario) =>{

        if(usuario.user){
          console.log('Hay una sesion', usuario);
          this.cargarSesion( usuario.user );
        }
  
      });   
  }

  ngOnInit(): void {}

  private mostrarCargando( mensaje:string , id:string ){

    this.matDialog.open( CargandoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: mensaje,
        id
      });
  }

  private cargarSesion( usuario: IUsuarioGoogle ){

    this.mostrarCargando('Verificando datos del usuario','sesion');

    this.firestore.collection<IUsuario>('/usuarios', ref => ref.limit(1).where( 'email', '==', usuario.email ))
    .get().subscribe( querySnapshot => {
  
      if( querySnapshot.empty ) {
        
        if(usuario.email.endsWith('@alumnos.udg.mx')){
          console.log('Se registra el usuario ');
      
          const nuevoUsuario : IUsuario ={ 
              nombreCompleto : usuario.displayName,
              email : usuario.email,
              image : usuario.photoURL,
              role : "usuario"
          } 

          this.firestore.collection("usuarios").add(nuevoUsuario).then((doc) => {

            const usuarios : IUsuario = {
              ...nuevoUsuario,
              key: doc.id,      
            };
            
            this.auth.cargarUsuario( usuarios );            

            switch( nuevoUsuario.role) {
  
              case 'super-usuario': this.router.navigateByUrl('inicio', { replaceUrl: true });
              break;

              case 'usuario':  this.router.navigateByUrl('inicio', { replaceUrl: true });
              break;

              case 'administrador': this.router.navigateByUrl('inicio', { replaceUrl: true });
              break;      

            } 
          })

        } else {
          this.mostrarSncak("Error. No Esta Autorizado (No es Alumno)", "snackRojo");
        }         

      } else {
  
        console.log('El usuario esta registrado ');

        querySnapshot.forEach( document => {
          
          const usuario = document.data();
          usuario.key = document.id;    

          this.auth.cargarUsuario( usuario );            

          switch( usuario.role) {

            case 'super-usuario': this.router.navigateByUrl('inicio', { replaceUrl: true });
            break;

            case 'usuario':  this.router.navigateByUrl('inicio', { replaceUrl: true });
            break;

            case 'administrador': this.router.navigateByUrl('inicio', { replaceUrl: true });
            break;      

          } 
          
         });
      }
  
        this.matDialog.closeAll();
     
    }, err=> {
      this.matDialog.closeAll();
    });

  }

  private mostrarSncak(mensaje: string, color:string){

    this.matSnack.open(mensaje, null, {
      panelClass: color,
      duration: 3000
    });

  }

  public async iniciarSesion() {
   await this.auth.signInGoogle();
  }

  public async estadoSesion() {

    const sesion = await this.afAuth.currentUser;

    if(sesion!= null) {
     console.log('Tiene una sesion cargada', sesion);
    } else {
     console.log('No tiene ninguna sesion cargada');
    }   
  }

  public async cerrarSesion() {
    await  this.afAuth.signOut();
  }
}

