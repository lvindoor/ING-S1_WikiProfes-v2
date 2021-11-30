import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUsuario} from '../modelos/usuario';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuario: IUsuario;
  public usuarioGoogle:any;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore
  ) 
  
  { 

 

   }

   public cargarUsuario( data:any ){
     this.usuario = data;
     
   
    console.log('Se cargo el usuario', this.usuario);

   }

   public cerrarSesion(){
     this.usuario = null;
     localStorage.clear();
    return this.afAuth.signOut();
   }

   public signInGoogle(){

    const provider = new firebase.auth.GoogleAuthProvider();
    
    return this.afAuth.signInWithRedirect(provider);

   }

}