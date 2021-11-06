import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUsuario } from 'src/app/modelos/usuario';

@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.css']
})
export class CrearNotificacionComponent implements OnInit {

  public notificacionForm: FormGroup;

  public plantas : IZona[] = [];
  public departamentos: IZona []=[];
  public roles = ['superUser','admin','user'];

  public roleSeleccionado: FormControl = new FormControl('user');

  public tokenUsuario:string = null;

  constructor(
    private firebaseDB: AngularFireDatabase,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.cargargForm();

  }

  private cargargForm(){


    this.notificacionForm = new FormGroup({
      titulo: new FormControl( null, [Validators.required, Validators.maxLength(40)]),
      cuerpo: new FormControl(null , [Validators.required, Validators.maxLength(80)])
    })
  }


  public enviarATodos(){
    const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

    const data ={
      app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
      headings:{ en: this.notificacionForm.value.titulo, es : this.notificacionForm.value.titulo},
      contents:{ en: this.notificacionForm.value.cuerpo, es : this.notificacionForm.value.cuerpo},
      included_segments : ["Active Users", "Inactive Users"]
    };

    this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
    .subscribe( resp =>{

      this.notificacionForm.reset({
        titulo:'',
        cuerpo:''
      });

      this.mostrarSnack('Se envio correctamente','snackVerde');
      //console.log('Resp al enviar la notificacion',resp);
    }, err =>{
      console.log('Error al enviar la notificacion', err);
      this.mostrarSnack('Error al enviar', 'sncakRojo')
    });

  }

  public buscarUsuario( numero:string ){

    //console.log('Se busca el ', numero);

    const numeroR = parseInt( numero );

    this.firestore.collection<IUsuario>('users', query => query.where('employeeNumber','==', numeroR )
    .limit(1))
    .get().subscribe( documentos =>{  
    
      //console.log('Sale esto', documentos);

     if(!documentos.empty){


      documentos.forEach( usuario =>{

        const usuarioEncontrado = usuario.data();

        //console.log('Se encontro el usuario ', usuarioEncontrado);

        if( usuarioEncontrado.token && usuarioEncontrado.token != ''){
          this.tokenUsuario =  usuarioEncontrado.token;
          this.mostrarSnack('Se encotro el usuario','snackVerde');
        }else{
          this.tokenUsuario = null;
          this.mostrarSnack('El usuario no a activado las notificaciones','snackVerde');
        }

        

      });

  
 
     }else{

      this.tokenUsuario = null;
 
       this.mostrarSnack('No se encontro el usuario, o no activo las notificaciones','snackVerde');
       //console.log('No se encontraron');
     }

  });


  }

  public enviarAUsuario(){

    const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

    const data ={
      app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
      headings:{ en: this.notificacionForm.value.titulo, es : this.notificacionForm.value.titulo},
      contents:{ en: this.notificacionForm.value.cuerpo, es : this.notificacionForm.value.cuerpo},
      include_player_ids: [this.tokenUsuario]
    };

    this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
    .subscribe( resp =>{
      
      console.log('Resp al enviar la notificacion',resp);

      this.notificacionForm.reset({
        titulo:'',
        cuerpo:''
      });

      this.tokenUsuario= null;

      this.mostrarSnack('Se envio correctamente','snackVerde');

    }, err =>{
      console.log('Error al enviar la notificacion', err);
      this.mostrarSnack('Error al enviar', 'sncakRojo')
    });

  }

  public enviarARole(){

    const data ={
      app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
      headings:{ en: this.notificacionForm.value.titulo, es : this.notificacionForm.value.titulo},
      contents:{ en: this.notificacionForm.value.cuerpo, es : this.notificacionForm.value.cuerpo},
      filters:[{
        field:"tag",
        key:"role",
        relation :"=",
        value: this.roleSeleccionado.value
      }]
    };


    const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

    this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
      .subscribe( resp =>{

        //console.log('Resp al enviar la notificacion',resp);
        this.notificacionForm.reset({
          titulo:'',
          cuerpo:''
        });

       //console.log('Se envio la notificacion');
       this.mostrarSnack('Se envio correctamente','snackVerde');
        

      }, err =>{
        console.log('Error al enviar la notificacion', err);
        this.mostrarSnack('Error al enviar', 'sncakRojo')
      });



  }



  public enviarAZonas(){

    const data ={
      app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
      headings:{ en: this.notificacionForm.value.titulo, es : this.notificacionForm.value.titulo},
      contents:{ en: this.notificacionForm.value.cuerpo, es : this.notificacionForm.value.cuerpo},
      filters:[]
    };


    this.plantas.forEach( planta =>{
      if(planta.check) data.filters.push( {
        field:"tag",
        key:"plant",
        relation :"=",
        value: planta.key
      })
    });

    this.departamentos.forEach( departamento =>{
      if(departamento.check){

        data.filters.push({
          field:"tag",
          key:"departament",
          relation :"=",
          value: departamento.key
        });
  
      }
    });

    //console.log('ASi se enviara ', data);

    const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

    this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
      .subscribe( resp =>{

        console.log('Resp al enviar la notificacion',resp);
        this.notificacionForm.reset({
          titulo:'',
          cuerpo:''
        });

       //console.log('Se envio la notificacion');
       this.mostrarSnack('Se envio correctamente','snackVerde');
        

      }, err =>{
        console.log('Error al enviar la notificacion', err);
        this.mostrarSnack('Error al enviar', 'sncakRojo')
      });



  }

  public cargarZonas( index:number ){

    if(index == 3 && this.plantas.length == 0 ){

      this.firebaseDB.database.ref('plant').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const planta :any= (categoria.toJSON() as any); 

      this.plantas.push( {
        name: planta.name,
        key: categoria.key,
        check:false
      });
     

      })
      //console.log('Se cargaron ', this.plantas);
    });

    this.firebaseDB.database.ref('departament').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const departamento :any= (categoria.toJSON() as any);
      

      this.departamentos.push( {
        name: departamento.name,
        key: categoria.key,
        check:false
      });
     

      })
      //console.log('Se cargaron ', this.departamentos);
    });

   //if
   }

  }


  private mostrarSnack(mensaje:string, color:string){
    
    this.matSnack.open(mensaje, null ,{
      panelClass: color,
      duration: 3000
    });


  }






}

interface IZona{
name:string;
key:string;
check:boolean;
}
