import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { VistasZonasComponent } from '../../noticias/vistas-zonas/vistas-zonas.component';
import { NumeroEmpleadoComponent } from './numero-empleado/numero-empleado.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit, OnDestroy {


  private suscripcion : Subscription = new Subscription;

  // public perfilForm: FormGroup;

  public plantas: string[]=[];
  public departamentos: string[]=[];

  public notificaionesToogle: FormControl ;

  


  constructor(
    public auth:AuthService,
    private firebaseDB: AngularFireDatabase,
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar,
    private notificaciones: NotificacionesService,
    private matDialog: MatDialog
  ) { 

  

  }

  ngOnInit(): void {

    this.cargarFormulario();

    this.cargarZonas();

    this.cargarOneSignal();

    

  

  }




  public actualizarNumeroEmpleado(){

    this.matDialog.open( NumeroEmpleadoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
      } );
      

  }


  public agregarZonas( propiedadNombre:string ){

    let modal = {
      width: '100vw',
    height:  '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh'
  };

    if(window.innerWidth >= 1000){
      modal.width = '410px'
      modal.height ='auto';
      modal.maxHeight = '100vh';
      modal.maxWidth = '410px'
    }

    this.matDialog.open( VistasZonasComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data:{
          plantas: this.plantas,
          departamentos: this.departamentos,
          propiedadNombre
        },
        ...modal
      } )

  }

  ngOnDestroy(){


    this.suscripcion.unsubscribe();
  }

  public actualizarPlantaKey(nombre:string){

    console.log('Actualizar plana', nombre);


     this.firestore.doc('users/'+this.auth.usuario.id).update({
      idPlant: nombre,
      //idDepartment : this.perfilForm.value.departamento
    })
    .then(() =>{

      this.mostrarSnack('Se actualizo correctamente','snackVerde');
      // = this.perfilForm.value.departamento;
      this.auth.usuario.idPlant = nombre;


      if( localStorage.getItem('notificaciones') ){
     // this.getKeyOfNode('departament',this.auth.usuario.idDepartment).then( key => this.agregarTag('departament', key) )
      this.getKeyOfNode('plant',this.auth.usuario.idPlant).then( key => this.agregarTag('plant', key) )

      }
    })


  }



  public actualizarDepartamentoKey(nombre:string){

    this.firestore.doc('users/'+this.auth.usuario.id).update({
      idDepartment : nombre
    })
    .then(() =>{

      this.mostrarSnack('Se actualizo correctamente','snackVerde');

      this.auth.usuario.idDepartment =  nombre;

      if( localStorage.getItem('notificaciones') ){
      this.getKeyOfNode('departament',this.auth.usuario.idDepartment).then( key => this.agregarTag('departament', key) )
      

      }
    })

  }


  public usuarioRegional( cambio:boolean ){

    this.firestore.collection('users').doc( this.auth.usuario.id )
    .update({ regional: cambio })
    .then( ()=>{

      this.auth.usuario.regional = cambio;

      this.mostrarSnack('Se actualizo correctamente','snackVerde');
    })
    .catch(err =>{
      console.log('Error al cambiar de reginal',err);
    })



  }

  public activarNotificaciones( activar:boolean ){

    console.log('Valor ', activar);

    if(activar && !localStorage.getItem('notificaciones') ){
      this.nativePromp();
      console.log('Va apreguntar las notificaciones');
     
    }else if( activar ){
      this.notificaciones.onesignal.subscribe();
      console.log('Va a reactivar las notificaciones');
    }
    else{
      this.notificaciones.desuscribirse();
      console.log('Va a descativar las notificaciones');
    }


  }

  private cargarOneSignal(){


   const sub = this.notificaciones.onesignal.subscribeState$.subscribe( estado =>{

    console.log('Estado de las notificaciones', estado.isSubscribed);

    this.notificaionesToogle = new FormControl( estado.isSubscribed );

    if(estado.notificationPermission == 'granted' && !localStorage.getItem('notificaciones')){
 
      this.actualizarToken( this.auth.usuario.id, estado.userId )
      .then( () =>{

        this.agregarTag('role', this.auth.usuario.idRole);

        if( this.auth.usuario.idDepartment != ""){
          this.getKeyOfNode('departament',this.auth.usuario.idDepartment).then( key => this.agregarTag('departament', key) )
       
        }
        //Me equivoqueeeee
        if( this.auth.usuario.idPlant != ""){
          this.getKeyOfNode('plant',this.auth.usuario.idPlant).then( key => this.agregarTag('plant', key) )
        }
        
       // console.log('Se actualizo el token del usuario');
       localStorage.setItem('notificaciones', "true");
        
        ;
      });

    }else if( !estado.isSubscribed && localStorage.getItem('notificaciones') ){


        this.actualizarToken( this.auth.usuario.id,'').
        then(()=>{
          console.log('Desactivo las notificaciones');
          localStorage.removeItem('notificaciones')
        })
        .catch(err => console.log('Error al borrar token de usuario',err) );
      

    }

    });


    this.suscripcion.add( sub );
  }

  private getKeyOfNode(coleccion:string, nombre:string ):Promise<string>{

    return this.firebaseDB.database.ref(coleccion)
    .orderByChild('name')
    .equalTo(nombre)
    .once('value')
    .then( (departamento)=>{

  
  
      const departamentoObj =departamento.toJSON();
  
      for( const key in departamentoObj ){
        //console.log('La puta key es ', key);
        return key;
      }
  
    })
    .catch( err =>{
      console.log('Error al buscar el departamento',err);
  
      return '';
    });
  
  }
  
  private actualizarToken(idUser:string, token:string){
  
   return this.firestore.doc('users/'+idUser).update({token});
  
  }
  
  private agregarTag(tipo:string, id:string ){
   
    this.notificaciones.onesignal.push([
      'sendTag',
      tipo,
      id,
      tagsSent => {
       // console.log('Se agrego al tag', tagsSent);
      },
    ]);
  
  
  }
  
  
  private nativePromp(){
    this.notificaciones.onesignal.push(['showNativePrompt', () =>{

      
    }]);
    
  }


  

  public actualizarFoto(){



    this.firestore.doc('users/'+this.auth.usuario.id).update({
      image: this.auth.usuarioGoogle.photoURL
    })
    .then( () =>{

      this.mostrarSnack('Se actualizo correctamente','snackVerde');

    })
    .catch(err =>{
      console.log('Error al actualizar la foto',err);
      this.mostrarSnack('Error al actualizar la foto','snackRojo');
    });

  }



  public mostrarSnack(mensaje:string, color:string){

    this.matSnack.open(mensaje,null,{
      duration:3000,
      panelClass: color
    });


  }

  private cargarFormulario(){

    // this.perfilForm = new FormGroup({

    //   planta: new FormControl( this.auth.usuario.idPlant , Validators.required),

    //   departamento: new FormControl( this.auth.usuario.idDepartment, Validators.required)


    // });

  }


  private cargarZonas(){

    this.firebaseDB.database.ref('plant').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const planta :any= (categoria.toJSON() as any); 

      this.plantas.push( planta.name);
     

      })
      //console.log('Se cargaron ', this.plantas);
    });

    this.firebaseDB.database.ref('departament').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const departamento :any= (categoria.toJSON() as any);
      

      this.departamentos.push( departamento.name);
     

      })
      //console.log('Se cargaron ', this.departamentos);
    });


  }

}



