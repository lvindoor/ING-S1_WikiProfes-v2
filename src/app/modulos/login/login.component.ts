import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

import { AngularFirestore } from '@angular/fire/firestore';
import {IUsuario} from '../../modelos/usuario';
import { MatDialog } from '@angular/material/dialog';
import { AlertaComponent } from '../componentes/alerta/alerta.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CargandoComponent } from '../componentes/cargando/cargando.component';


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
    private router: Router
    ) {




      this.afAuth.getRedirectResult().then( (usuario) =>{

        if(usuario.user){
          console.log('Hay una sesion', usuario);
          this.cargarSesion( usuario.user.email );
        }


  
      });
   
  }

  ngOnInit(): void {


   
  
  
  }

  private mostrarCargando( mensaje:string , id:string ){

    this.matDialog.open( CargandoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: mensaje,
        id
      });


  }



  private cargarSesion( email:string ){

    this.mostrarCargando('Verificando datos del usuario','sesion');

    this.firestore.collection<IUsuario>('/users', ref => ref.limit(1).where( 'email', '==', email ))
    .get().subscribe( querySnapshot =>{
  
      if( querySnapshot.empty ){
        //console.log('El usuario no esta registrado ');
        this.mostrarAlerta('No estas registrado, registrate!', '')

      }else{
  
       // console.log('El usuario esta registrado ');
        querySnapshot.forEach( document =>{

          
          const usuario= document.data();
          usuario.id = document.id;
          

          if( usuario.authorized ){

            this.auth.cargarUsuario( usuario );
            

            switch( usuario.idRole){
  
              case 'superUser':
                this.router.navigateByUrl('super-user', { replaceUrl: true });
              break;
              case 'user':  this.router.navigateByUrl('inicio', { replaceUrl: true });
              break;
              case 'admin': this.router.navigateByUrl('admin', { replaceUrl: true });
              break;      

            }
            

          }else{

            this.mostrarAlerta('No estas autorizado para entrar...','errr')
          }
          
         });

      }
  
        this.matDialog.closeAll();
     
    }, err=>{
      this.matDialog.closeAll();
    });

  }

  public async iniciarSesion(){

   await this.auth.signInGoogle();


  }



private mostrarAlerta(mensaje:string, img:string ){

    this.matDialog.open( AlertaComponent,{
    hasBackdrop:true,
    disableClose:true,
    data:{
      mensaje
    },
    minWidth: 360
    });

  }




  public async estadoSesion(){

    const sesion = await this.afAuth.currentUser;

    if(sesion!= null){
     // console.log('Tiene una sesion cargada', sesion);
    }else{
     // console.log('No tiene ninguna sesion cargada');
    }

   
  }

  public async cerrarSesion(){

  await  this.afAuth.signOut();

  }








  // public configuracionOneSignal(){

  //   if( !localStorage.getItem('notificaciones') ){

  //     this.onesignal.subscribeState$.subscribe( estado =>{

  //       console.log('Estado de la app', estado);

  //       if(!estado.isSubscribed){
  //         this.nativePromp();

  //       }else{
         
          

  //         estado.userId


  //       }
  
  //     });

  //   }else{

  //     alert('El usuario ya estaba suscrito');

  //   }

  // }

  // onSubscribe() {
  //   //this.onesignal.subscribe();

  //   //this.onesignal.subscribeState$.subscribe()
  // }

  // onUnSubscribe() {
  //   this.onesignal.unsubscribe();
  // }

  // testPushPC() {
  //   this.onesignal.push([
  //     'sendTag',
  //     'usuarioPC',
  //     'valordellavePc',
  //     tagsSent => {
  //       console.log('tagsSent', tagsSent);
  //     },
  //   ]);
  // }

  // public testMovil(){
  //   this.onesignal.push([
  //     'sendTag',
  //     'usuarioMovil',
  //     'valordellaveMovil',
  //     tagsSent => {
  //       console.log('tagsSent', tagsSent);
  //     },
  //   ]);
  // }


  // public agregarTags(){
  //   this.onesignal.push([
  //     'sendTags',
  //     'planta1',
  //     'llavepl1',
  //     'planta2',
  //     'llavepl2',
  //     'planta3',
  //     'llavepl3',
  //     tagsSent => {
  //       console.log('Tags enviados', tagsSent);
  //     },
  //   ]);
  // }

  // getTags() {
  //   this.onesignal.push([
  //     'getTags',
  //     tags => {

  //       console.log('Tags obtenidos', tags );
  //       this.tagsSubscribe$.next(tags);
  //     },
  //   ]);
  // }
  // public getId(){

  //   console.log( this.onesignal.userId );
  // }

  // public estadoDelPermiso(){

  //   this.onesignal.push(['getNotificationPermission', (resp) =>{

  //     if(resp == 'granted' ){
  //       console.log('El usuario acepto las notificaciones y su id es: ', this.onesignal.userId);

  //     }      

  //   }]);

  // }






  // public nativePromp(){
  //   this.onesignal.push(['showNativePrompt', () =>{

  //     //this.estadoDelPermiso();
      
  //   }]);
    
  // }

}
