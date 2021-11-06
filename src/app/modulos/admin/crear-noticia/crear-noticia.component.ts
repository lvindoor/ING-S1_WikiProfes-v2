import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { ICategoria } from 'src/app/modelos/categoria';
import { INew } from 'src/app/modelos/noticia';
import { IUsuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';


import {IMultimedia} from 'src/app/modelos/multimedia';


import { SliderComponent } from '../../componentes/slider/slider.component';
import { MatDialog } from '@angular/material/dialog';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';


import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-crear-noticia',
  templateUrl: './crear-noticia.component.html',
  styleUrls: ['./crear-noticia.component.css']
})
export class CrearNoticiaComponent implements OnInit {

  public noticiaForm: FormGroup;
  public videoYoutube: FormControl = new FormControl(null, 
    [Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$'),
    Validators.required
    ]);

  public link: FormControl= new FormControl(null, [Validators.required,
     Validators.pattern('https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}')]);  
  public links :string[]=[];

  public respuesta: FormControl = new FormControl(null, Validators.required);
  public respuestas:string[]=[];  

  public slidesUrl= new FormControl(null, Validators.required );
  // public tiposNoticias = ['Multimedia','Encuesta','Presentacion'];

  public fileReader : FileReader;

  public multimedia: IMultimedia[] =[];



  public categorias :string [] = [];

  public plantas : IZona[] = [];
  public departamentos: IZona []=[];
  public plantasNombres : string[] = [];
  public departamentosNombres: string[] = [];

  public roles = ['superUser','admin','user'];

  public roleSeleccionado: FormControl = new FormControl('user');

  public tokenUsuario:string;


  public Editor = ClassicEditor;

  public config ={
    toolbar: [  'bold', 'italic', '|', 'bulletedList', 'numberedList',
    'alignment' ],
    alignment: {
      options: ['left', 'right', 'center', 'justify']
    },
  };

 @ViewChild(SliderComponent, {static:false }) slider: SliderComponent;



 public seleccionTipo: FormControl = new FormControl(0);

 public opciones:string []= ['Categorias regionales','Plantas','Departamentos'];

  constructor(
    private auth: AuthService,
    private firebaseDB: AngularFireDatabase,
    private matSnack: MatSnackBar,
    private http:HttpClient,
    private firestore: AngularFirestore,
    private matDialog: MatDialog
  ) {


   }


  ngOnInit(): void {


    this.cargarFormulario();

    this.cargarCategorias();

  }


// make sure to destory the editor
ngOnDestroy(): void {

}





public removerSlide(){
  this.multimedia.pop();
  
}

public agregarSlides(){


  this.multimedia.push({
    tipo:'slides',
    src: (this.slidesUrl.value as string).split('"')[1]
   }) ;

   console.log('se agrego ', this.multimedia);

}


public mostrarSlides(){

  return this.multimedia[0] && this.multimedia[0].tipo == 'slides';

}

 
public busquedaTipo( index:number){

  switch( index ){


    case 1: this.cargarPlantas();
  
    break;

    case 2: this.cargarDepartamentos();
    break;
   


  }


}


  public async crearNoticia(){

    

    const noticia :INew={
      admin : {
        fullName: this.auth.usuario.fullName,
        image: this.auth.usuario.image
      },
      adminId: this.auth.usuario.id,
      title: this.noticiaForm.value.titulo,
      description: this.noticiaForm.value.texto,
      categoria: (this.noticiaForm.value.categoria as string).toUpperCase(),
      encuesta: this.respuestas,
      date : new Date().toISOString(),
      links : this.links,
      multimedia:[]
    };

    if( !this.noticiaForm.value.encuesta){

      for await( const multi of this.multimedia){


        if(multi.file){
  
          const fileId= await this.subirMultimedia( multi.file );
  
        if( multi.file.type.split('/')[0] == 'image' ){
  
          noticia.multimedia.push({
            tipo:'image',
            src: fileId
          });
        
        }else{
  
          noticia.multimedia.push({
            tipo:'video',
            src: fileId
          });
  
        }
  
        }else if(multi.tipo== 'youtube'){
  
  
          noticia.multimedia.push( {
            tipo:'youtube',
            src: multi.src
          });
  
        }else{

          noticia.multimedia.push( {
            tipo:'slides',
            src: multi.src
          });

        }
      
        
      }

      

    }

  


    

  return  this.firestore.collection('news').add(noticia);
  }

  private cargarPlantas(){

    if( this.plantasNombres.length == 0){
       this.firebaseDB.database.ref('plant').get()
    .then( (plantas)=>{
    
      plantas.forEach( planta =>{
        
        const { name } = planta.toJSON() as any;
  
        this.plantasNombres.push( name );
        
      })
  
      //console.log('Se cargaron las plantas', this.plantas);
  
    });
    }

   


  }

  private cargarDepartamentos(){

    if( this.departamentosNombres.length == 0){
    this.firebaseDB.database.ref('departament').get()
        .then( (departamentos)=>{
        
          departamentos.forEach( departamento =>{
            
            const { name } = departamento.toJSON() as any;
      
            this.departamentosNombres.push( name );
            
          })
      
        });

    }

    


  }


  private mostrarCargando(){

    this.matDialog.open( CargandoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data:'Cargando archivos multimedia y publicando noticia, espere...'
      });


  }


  public encuestaToggle(encuesta:boolean){

    //console.log('Se cambio a ', encuesta);

    if(encuesta){

      this.eliminarMultimedia();

    }else{

      this.respuestas = [];
      
    }


  }

  private subirMultimedia(file: File):Promise<string>{

    const form = new FormData();
    form.append('upload_preset','sanminaNews' )
    form.append('file', file );
    
    return this.http.post<any>(`https://api.cloudinary.com/v1_1/dlor7n05z/upload`, form )
    .pipe(
      map( resp => resp.public_id.split('/')[1] )
    ).toPromise()

  }


  public agregarRespuesta(){

    this.respuestas.push( this.respuesta.value );
    this.respuesta.reset(null)

  }

  public eliminarRespuesta(index:number){
    this.respuestas.splice(index,1);
  }

  public agregarLink(){
    this.links.push( this.link.value );
    this.link.reset(null);

  }

  public elminarLink( index:number ){
    this.links.splice(index,1);
  }

  public abrirLink( link:string ){

    const a = document.createElement('a');
    a.target='_blank';
    a.href= link;
    a.click();
    a.remove();

  }
 

  public async cargarMultimedia(files: File[]){

    if(! this.fileReader ){
      this.fileReader = new FileReader();
    }

    
    for await(const archivo of files){

      if(archivo.type.split('/')[0] == 'image'){

        this.slider.agregarSlide({
          src: (await this.cargarImagen(archivo) ),
          tipo:'image'
        });

        this.multimedia.push({
          tipo: 'image',
          file: archivo
        });


      }else{

        this.slider.agregarSlide({
          src: (await this.cargarImagen(archivo) ),
          tipo:'video'
        });

        this.multimedia.push({
          tipo:'video',
          file: archivo
        })


      } 


  


    }
    



  }


  private cargarImagen( imagen: File ):Promise<string>{

    this.fileReader.readAsDataURL(imagen);

    return new Promise( (resolve, reject) =>{


      this.fileReader.onload  =( eventR: any) =>{

        resolve(eventR.target.result);

      };

    });


  }

  public eliminarMultimedia(){

    if(!this.noticiaForm.value.encuesta){
      this.multimedia = [];
      this.slider.elminarMultimedia();
    }

    

  }

  public agregarVideo(){

    

    let idVideo = '';

    if((this.videoYoutube.value as string).startsWith('https://www.youtube.com/watch?v=') ){

      idVideo = (this.videoYoutube.value as string).substring(32, (this.videoYoutube.value as string).length );

    }else{

      idVideo = (this.videoYoutube.value as string).substring(17, (this.videoYoutube.value as string).length );

    }

    //console.log('El id es', idVideo);

    //console.log('El arrego aqui', this.slider.slides);

    this.slider.slides.push({
      tipo:'youtube',
      src: idVideo
    });

    this.multimedia.push({
      tipo:'youtube',
      src: idVideo
    });

   
    
    this.videoYoutube.reset(null);


  }

  public async enviarATodos(){

    this.mostrarCargando();


    try{
      
     const noticia = await this.crearNoticia();

      

      this.eliminarMultimedia();
  
      this.links =[];
      this.respuestas =[];
  
      this.matDialog.closeAll();

      const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

      const data ={
        app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
        headings:{ en: this.noticiaForm.value.tituloNotificacion, es : this.noticiaForm.value.tituloNotificacion},
        contents:{ en: this.noticiaForm.value.cuerpoNotificacion, es : this.noticiaForm.value.cuerpoNotificacion},
        included_segments : ["Active Users", "Inactive Users"],
        web_url: 'https://sanminanewsapp.web.app/inicio/noticias/'+noticia.id
      };
  
      this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
      .subscribe( resp =>{

        this.noticiaForm.reset({
          titulo: null,
          texto: null,
          encuesta: false,
          categoria: null,
          tituloNotificacion: null,
          cuerpoNotificacion : null
        });
  
        this.mostrarSnack('Se publico la noticia correctamente','snackVerde');
        //console.log('Resp al enviar la notificacion',resp);
      }, err =>{
        console.log('Error al enviar la notificacion', err);
        this.mostrarSnack('Error al enviar', 'snackRojo')
      });


    }catch( err){

      this.matDialog.closeAll();
      this.mostrarSnack('Hubo un error al publicar la noticia','snackRojo')
    }

    

    

  

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
       this.mostrarSnack('No se encontro el usuario','snackVerde');
       //console.log('No se encontraron');
     }

  });


  }

  public async enviarAUsuario(){
    this.mostrarCargando();

    try{

      const noticia = await this.crearNoticia();


      this.eliminarMultimedia();
  
      this.links =[];
      this.respuestas =[];
  
      this.matDialog.closeAll();

      const headers = new HttpHeaders()
      .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');
  
      const data ={
        app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
        headings:{ en: this.noticiaForm.value.tituloNotificacion, es : this.noticiaForm.value.tituloNotificacion},
        contents:{ en: this.noticiaForm.value.cuerpoNotificacion, es : this.noticiaForm.value.cuerpoNotificacion},
        include_player_ids: [this.tokenUsuario],
        web_url: 'https://sanminanewsapp.web.app/inicio/noticias/'+noticia.id
      };

      //console.log('Se creo la noticia y se enviara notificacion');

      this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
      .subscribe( resp =>{

        //console.log('Resp al enviar la notificacion',resp);
  
       this.noticiaForm.reset({
        titulo: null,
        texto: null,
        encuesta: false,
        categoria: null,
        tituloNotificacion: null,
        cuerpoNotificacion : null
      });
  
        this.mostrarSnack('Se envio correctamente','snackVerde');
  
      }, err =>{
        console.log('Error al enviar la notificacion', err);
        this.mostrarSnack('Error al enviar', 'sncakRojo')
      });


    }catch( err ){

      this.matDialog.closeAll();

    }

    

  }

  public async enviarARole(){

    this.mostrarCargando();


    try{

      const noticia = await this.crearNoticia();

      

      this.eliminarMultimedia();
  
      this.links =[];
      this.respuestas =[];
  
      this.matDialog.closeAll();


      const data ={
        app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
        headings:{ en: this.noticiaForm.value.tituloNotificacion, es : this.noticiaForm.value.tituloNotificacion},
        contents:{ en: this.noticiaForm.value.cuerpoNotificacion, es : this.noticiaForm.value.cuerpoNotificacion},
        filters:[{
          field:"tag",
          key:"role",
          relation :"=",
          value: this.roleSeleccionado.value
        }],
        web_url: 'https://sanminanewsapp.web.app/inicio/noticias/'+noticia.id
      };


      const headers = new HttpHeaders()
    .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');

    this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
      .subscribe( resp =>{

       //console.log('Se envio la notificacion');
       this.mostrarSnack('Se envio correctamente','snackVerde');
        this.noticiaForm.reset({
        titulo: null,
        texto: null,
        encuesta: false,
        categoria: null,
        tituloNotificacion: null,
        cuerpoNotificacion : null
      });

      }, err =>{
        //console.log('Error al enviar la notificacion', err);
        this.mostrarSnack('Error al enviar', 'sncakRojo')
      });


    }catch(err){

      console.log('Error al publicar noticia',err);

      this.matDialog.closeAll();

    }

    


    



  }

  public async enviarAZonas(){

    this.mostrarCargando();

    try{

      const noticia = await this.crearNoticia();

      

      this.eliminarMultimedia();
  
      this.links =[];
      this.respuestas =[];
  
      this.matDialog.closeAll();

      const data ={
        app_id : "7852c893-cb4f-4643-ab53-7792a8c12e64",
        headings:{ en: this.noticiaForm.value.tituloNotificacion, es : this.noticiaForm.value.tituloNotificacion},
        contents:{ en: this.noticiaForm.value.cuerpoNotificacion, es : this.noticiaForm.value.cuerpoNotificacion},
        filters:[],
        web_url: 'https://sanminanewsapp.web.app/inicio/noticias/'+noticia.id
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
  
      
  
      const headers = new HttpHeaders()
      .append('Authorization','Basic YzE2YTJmMjQtZDA0My00NGM0LWFhOGItZGJmODhlNmMxZDk5');
  
      this.http.post('https://onesignal.com/api/v1/notifications',data , { headers })
        .subscribe( resp =>{
  
  
         //console.log('Se envio la notificacion');
         this.mostrarSnack('Se envio correctamente','snackVerde');
         this.noticiaForm.reset({
          titulo: null,
          texto: null,
          encuesta: false,
          categoria: null,
          tituloNotificacion: null,
          cuerpoNotificacion : null
        });
  
        }, err =>{
          console.log('Error al enviar la notificacion', err);
          this.mostrarSnack('Error al enviar', 'sncakRojo')
        });


    }catch(err){

      console.log('Error al publicar noticia',err);

      this.matDialog.closeAll();


    }

    



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
     // console.log('Se cargaron ', this.plantas);
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

  private cargarCategorias(){

    this.firebaseDB.database.ref('category').get()
    .then( (valor)=>{

     

      valor.forEach( categoria =>{

      const categoriaF :ICategoria= (categoria.toJSON() as any);
      categoriaF.key = categoria.key;

      this.categorias.push( categoriaF.name );
      

      });

      //console.log('Se cargaron ', this.categorias)
    });
   


  }

  private cargarFormulario(){

    this.noticiaForm = new FormGroup({
      titulo: new FormControl( null, Validators.required),
      texto: new FormControl( null, Validators.required),
      encuesta: new FormControl( false),
      categoria: new FormControl(null, Validators.required),
      tituloNotificacion: new FormControl(null, Validators.required),
      cuerpoNotificacion : new FormControl(null,Validators.required)
    });

  }

}

interface IZona{
  name:string;
  key:string;
  check:boolean;
  }
