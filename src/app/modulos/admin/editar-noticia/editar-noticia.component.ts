import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { ICategoria } from 'src/app/modelos/categoria';
import { IMultimedia } from 'src/app/modelos/multimedia';
import { INew } from 'src/app/modelos/noticia';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';
import { SliderComponent } from '../../componentes/slider/slider.component';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-editar-noticia',
  templateUrl: './editar-noticia.component.html',
  styleUrls: ['./editar-noticia.component.css']
})
export class EditarNoticiaComponent implements OnInit {

  public noticiaForm:FormGroup;

  public videoYoutube: FormControl = new FormControl(null, 
    [Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$'),
    Validators.required
    ]);

  public link: FormControl= new FormControl(null, [Validators.required,
     Validators.pattern('https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}')]);  
  public links :string[]=[];

  public respuesta: FormControl = new FormControl(null, Validators.required);
  public respuestas:string[]=[];  

  public multimedia: IMultimedia[] = [];

  

  public categorias :string [] = [];

  public tieneMultimedia: boolean;

  public Editor = ClassicEditor;

  public config ={
    toolbar: [  'bold', 'italic', '|', 'bulletedList', 'numberedList',
    'alignment' ],
    alignment: {
      options: ['left', 'right', 'center', 'justify']
    },
  };


  public seleccionTipo: FormControl = new FormControl(0);
  public opciones:string []= ['Categorias regionales','Plantas','Departamentos'];


  @ViewChild(SliderComponent, {static:false }) slider: SliderComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IData,
   private matDialogRef: MatDialogRef<EditarNoticiaComponent>,
   private firebaseDB: AngularFireDatabase,
   private http:HttpClient,
   private firestore: AngularFirestore,
   private matDialog: MatDialog,
   private matSnack: MatSnackBar
  ) {

   }

  ngOnInit(): void {

    this.cargarFormulario();
    this.cargarCategorias();

    if( this.data.noticia.encuesta.length > 0){
      this.tieneMultimedia =false;
      this.respuestas = this.data.noticia.encuesta; 
    }else{
      this.tieneMultimedia = true;
    }

    this.links = this.data.noticia.links;
   

  
  }








  ngAfterViewInit(): void {


    if( this.data.noticia.encuesta.length == 0 && this.data.noticia.multimedia.length > 0){
      this.multimedia = this.data.noticia.multimedia;

      this.multimedia.forEach( multimedia =>{

        this.slider.agregarSlide({
          src: multimedia.src,
          tipo: multimedia.tipo
        });

     

      });

      
    }
    
  }

  private mostrarCargando(){

    this.matDialog.open( CargandoComponent,
      {
        disableClose:true,
        hasBackdrop:true,
        data:'Actualizando los cambios , espere...',
        id:'cargando'
      });

  }

  public mostrarSnack( mensaje:string, color:string){


    this.matSnack.open( mensaje, null,{
      duration: 3000,
      panelClass: color
    });

  }


  public async actualizarNoticia(){

    this.mostrarCargando();


    const noticiaActualizada :INew={
      admin : {
        fullName: this.data.noticia.admin.fullName,
        image: this.data.noticia.admin.image
      },
      adminId: this.data.noticia.adminId,
      title: this.noticiaForm.value.titulo,
      description: this.noticiaForm.value.texto,
      categoria: this.noticiaForm.value.categoria,
      encuesta: this.respuestas,
      date : this.data.noticia.date,
      links : this.links,
      multimedia:[]
    };

    if( this.tieneMultimedia ){

      for await( const multi of this.multimedia){


        if(multi.file){
  
          const fileId= await this.subirMultimedia( multi.file );
  
        if( multi.file.type.split('/')[0] == 'image' ){
  
          noticiaActualizada.multimedia.push({
            tipo:'image',
            src: fileId
          });
        
        }else{
  
          noticiaActualizada.multimedia.push({
            tipo:'video',
            src: fileId
          });
  
        }
  
        }
        
        else if(multi.tipo == 'youtube'){
  
          noticiaActualizada.multimedia.push( {
            tipo:'youtube',
            src: multi.src
          })
  
        }else if(multi.tipo == 'image'){

          noticiaActualizada.multimedia.push({
            tipo:'image',
            src: multi.src
          })

        }else{

          noticiaActualizada.multimedia.push({
            tipo:'video',
            src: multi.src
          })

        }
      
        
      }

      

    }


    this.firestore.doc('news/'+this.data.noticia.id).update( noticiaActualizada )
    .then( () =>{

      this.matDialog.getDialogById('cargando').close();

      //Al actualizar el elemento agregar el id para seguir identificandolo
      noticiaActualizada.id = this.data.noticia.id;

      this.matDialogRef.close( noticiaActualizada );

    }).catch(err =>{

      this.mostrarSnack('Error al actualizarla, trate de nuevo','snackRojo');
      console.log('Ocurrio un error al guardar la noticia',err);
    })




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
    this.noticiaForm.markAsDirty();


  }

  public eliminarMultimediaIndex(){

    this.multimedia.splice( this.slider.currentSlide,1 );
    this.slider.eliminarMultimediaIndex( this.slider.currentSlide );

  }


  public agregarRespuesta(){

    this.respuestas.push( this.respuesta.value );
    this.respuesta.reset(null);
    this.noticiaForm.markAsDirty();

  }

  public eliminarRespuesta(index:number){
    this.respuestas.splice(index,1);
    this.noticiaForm.markAsDirty();
  }

  public agregarLink(){
    this.links.push( this.link.value );
    this.link.reset(null);
    this.noticiaForm.markAsDirty();

  }

  public elminarLink( index:number ){
    this.links.splice(index,1);
    this.noticiaForm.markAsDirty();
  }

  public abrirLink( link:string ){

    const a = document.createElement('a');
    a.target='_blank';
    a.href= link;
    a.click();
    a.remove();

  }

  public cargarMultimedia(files: File[]){

    

    for( let i =0 ; i< files.length; i++){  
      const reader = new FileReader();


      reader.readAsDataURL( files[i] );
  
      reader.onload =( eventR : any)=>{

        if(files[i].type.split('/')[0] == 'image'){

          this.slider.agregarSlide({
            src: eventR.target.result,
            tipo:'image'
          });

          this.multimedia.push({
            tipo: 'image',
            file: files[i]
          });

  
        }else{

          this.slider.agregarSlide({
            src: eventR.target.result,
            tipo:'video'
          });

          this.multimedia.push({
            tipo:'video',
            file: files[i]
          });
  

        } 

        this.noticiaForm.markAsDirty();

      };

    }


  }

  private cargarCategorias(){

    this.firebaseDB.database.ref('category').get()
    .then( (valor)=>{

     

      valor.forEach( categoria =>{

      const categoriaF :ICategoria= (categoria.toJSON() as any);
      categoriaF.key = categoria.key;

      this.categorias.push( categoriaF.name );
      

      });

     // console.log('Se cargaron ', this.categorias)
    });
   

  }

  private cargarFormulario(){

    this.seleccionTipo.setValue(this.data.tipoSeleccion);

    this.noticiaForm = new FormGroup({
      titulo: new FormControl( this.data.noticia.title , Validators.required),
      texto: new FormControl( this.data.noticia.description, Validators.required),
      categoria: new FormControl(this.data.noticia.categoria, Validators.required),
    });

  }


  public cerrarModal( resultado : INew = null){

    this.matDialogRef.close( resultado );

  }

}

interface IData{
  noticia:INew;
  plantasNombres:string[];
  departamentosNombres:string[];
  tipoSeleccion:number;
}
