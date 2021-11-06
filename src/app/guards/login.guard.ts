import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { IUsuario } from '../modelos/usuario';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor( 
    private auth: AuthService,
    private router: Router,

    ){

  }
  
  canLoad(): Promise<boolean>  {

   
    return new Promise( (resolve, reject)=>{

     
      if(localStorage.getItem('login')){

        this.auth.afAuth.authState.subscribe( usuario =>{
  
          if(usuario ){

            this.auth.firestore.collection<IUsuario>('/users', ref => ref.limit(1).where( 'email', '==', usuario.email ))
            .get().subscribe( querySnapshot =>{
          
              if( querySnapshot.empty ){
               
                resolve(true);
        
              }else{
  
                this.auth.usuarioGoogle = usuario;
          
               
                querySnapshot.forEach( document =>{
        
                  const usuario= document.data();
                  usuario.id = document.id;
        
                  if( usuario.authorized ){
                    this.auth.cargarUsuario( usuario );

                    //console.log('Usuario cargado', usuario);
                    switch( usuario.idRole){
  
                      case 'superUser':
                        this.router.navigateByUrl('admin', { replaceUrl: true });
                      break;
                      case 'user': this.router.navigateByUrl('inicio', { replaceUrl: true });
                      break;
                      case 'admin': this.router.navigateByUrl('admin', { replaceUrl: true });
                      break;      
  
                      
                    }
  
                    resolve(false);
  
        
                  }else{
                    
                    resolve(true);
                  }
                  
                 });
        
              }
          
             
            });
    
          }else{
  
            resolve(true);
          }
          
        });

      }else{

        resolve( true );
      }

    

    });


  }


  
}
