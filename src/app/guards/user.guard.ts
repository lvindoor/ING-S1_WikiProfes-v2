import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';

import { IUsuario } from '../modelos/usuario';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanLoad {

  constructor(
    private auth: AuthService
    ) {
    
  }
 
  canLoad():Promise<boolean>  {

    return new Promise( (resolve,reject)=>{

      if( this.auth.usuarioGoogle && (this.auth.usuario.authorized &&  this.auth.usuario.idRole == 'user')){

        resolve( true );

      }else{

        this.auth.afAuth.authState.subscribe( usuario =>{

          //console.log('Chequando el usuario', usuario);
  
          if(usuario ){

          

            this.auth.firestore.collection<IUsuario>('/users', ref => ref.limit(1).where( 'email', '==', usuario.email ))
            .get().subscribe( querySnapshot =>{
          
              if( querySnapshot.empty ){
                //console.log('El usuario no esta registrado ');
                resolve(false);
        
              }else{
  
                this.auth.usuarioGoogle = usuario;
          
                //console.log('El usuario esta registrado ');
                querySnapshot.forEach( document =>{
        
                  const usuario= document.data();
                  usuario.id = document.id;
                
        
                  if( usuario.authorized &&  usuario.idRole == 'user' ){

                    this.auth.cargarUsuario( usuario );
                   resolve(true);
                  
                  }else{
                    
                    resolve(false);
                  }
                  
                 });
        
              }
          
             
            });
    
          }else{
  
            resolve(false);
          }
          
        }); 


      }



    });
    
  }

  


}
