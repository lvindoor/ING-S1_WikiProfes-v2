import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUsuario} from '../modelos/usuario';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificacionesService } from './notificaciones.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuario: IUsuario;
  public usuarioGoogle:any;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private notificaciones: NotificacionesService
  ) {


   
  
   

   }


   public cargarUsuario( data:any ){
     this.usuario = data;
     localStorage.setItem('login', 'true');
    //console.log('Se cargo el usuario', this.usuario);

   }

   public cerrarSesion(){
     this.usuario = null;
     localStorage.clear();
     this.notificaciones.desuscribirse();
    return this.afAuth.signOut();
   }

   public signInGoogle(){

    const provider = new firebase.auth.GoogleAuthProvider();

    
    return this.afAuth.signInWithRedirect(provider);


   }


}
