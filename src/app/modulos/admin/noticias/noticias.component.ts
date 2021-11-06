
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IIngresoApp, IIngresoNoticia } from 'src/app/modelos/actividadUsuarios';
import { ICategoria } from 'src/app/modelos/categoria';

import { INew } from 'src/app/modelos/noticia';
import { IReaccion } from 'src/app/modelos/reaccion';
import { AuthService } from 'src/app/services/auth.service';
import { NoticiaComponent } from './noticia/noticia.component';



@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NoticiasComponent implements OnInit {

  public noticias: INew[] = [];

  public categorias: string[]=[];

  
  constructor(
    private firestore: AngularFirestore,
    private firebaseDB: AngularFireDatabase,
    private router: Router,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar,
    private auth:AuthService
  ) {

    const idNoticia = this.router.url.split('/')[3];

    if( idNoticia){

    this.cargarNoticia(idNoticia);

    }




   }

  ngOnInit(): void {



  this.cargarCategoriasActivas();

  this.verificarIngresoApp();
  

  



  }


  private async verificarIngresoApp( ){

    const fechaHoy = new Date();
    fechaHoy.setHours(0,0,0,0);


    if(!localStorage.getItem('ingresoApp')){

      this.guardarIngreso();
    
      }else{

        const fechaGuardada = localStorage.getItem('ingresoApp');


        if(fechaHoy.toISOString() != fechaGuardada ){

        const actividad = await this.firestore.collection('actividadIngreso', query => 
        query
        .where('employeeNumber','==', this.auth.usuario.employeeNumber )
        .where('fecha','>=',fechaHoy.toISOString() )
         ).get().toPromise();
 
       if(actividad.empty){

        this.guardarIngreso();

       }


        }else{
          console.log('La fecha es igual a la guardada');
        }

    
      }


    
  

    
  
  }


  private guardarIngreso(){

    const fecha = new Date();

    const ingreso : IIngresoApp ={
      idDepartment: this.auth.usuario.idDepartment,
      fecha : fecha.toISOString(),
      idPlant: this.auth.usuario.idPlant,
      regional: this.auth.usuario.regional,
      fullName: this.auth.usuario.fullName,
      employeeNumber: this.auth.usuario.employeeNumber,
      email: this.auth.usuario.email,
      idRole:  this.auth.usuario.idRole,
      image:  this.auth.usuario.image
    };

    fecha.setHours(0,0,0,0);
  


    this.firestore.collection('actividadIngreso').add(ingreso)
    .then(()=>localStorage.setItem('ingresoApp', fecha.toISOString()))
    .catch(err =>console.log('Error al guardar ingreso ',err));

  }



  public cortarNoticia( caracteres : number ): boolean{
   
    return caracteres > 60;

  }

  private mostrarSnack( mensaje:string, color:string ){

    this.matSnack.open(mensaje, null,{
      duration: 3000,
      panelClass:color
    });


  }

  private cargarNoticia( id:string){

    this.firestore.doc<INew>('news/'+id)
    .get()
    .subscribe( resp =>{


      if(resp.exists){
        const noticia = resp.data();
        noticia.id = resp.id;

        this.verNoticia( noticia )

        console.log('Se descargo la noticia', noticia);
      }else{

        console.log('No se encontro la noticia');

        this.mostrarSnack('No se encontro la noticia','snackRojo')

      }

    })

  }

  public async verNoticia( noticia: INew){

    let modal = {
      width: '100vw',
    height:  '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh'
  };

    if(window.innerWidth >= 1000){
      modal.width = '650px'
      modal.height ='100vh';
      modal.maxHeight = '100vh';
      modal.maxWidth = 'auto'
    }

    const reacciones :IReaccion[] = [];

    if( noticia.encuesta.length > 0){

   await  this.firestore.collection<IReaccion>('reacciones', query => query.where('idNoticia','==', noticia.id ))
    .get().toPromise().then( resp =>{

      if(!resp.empty){

        resp.forEach( reaccionDoc =>{
          const reaccion :IReaccion = reaccionDoc.data();
          reaccion.id = reaccionDoc.id;
          reacciones.push( reaccion );
        });
    
      }


    })
    .catch(err =>{

      console.log('Error al cargar las reacciones',err);
      this.mostrarSnack('Error al cargar las reacciones','snackRojo');

    });


    this.matDialog.open(NoticiaComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: {
          noticia,
          reacciones
        },
        autoFocus:false,
        ...modal,
      });


    }else{

      this.matDialog.open(NoticiaComponent,
        {
          hasBackdrop:true,
          disableClose:true,
          data: {noticia},
          autoFocus:false,
          ...modal,
        });


    }

    


  }

  // @HostListener('mousewheel', ['$event']) 
  // onMousewheel(event) {
  //      console.log(event)

  //      console.log( 100 * event.pageY / (containeR.scrollHeight-containeR.clientHeight );

      
  // }


  public crearUrlImg(id: string): string{

    return `https://res.cloudinary.com/dlor7n05z/image/upload/v1607017792/noticias/${id}`
  }

  public crearUrlVideo(id: string): string{

    return `https://res.cloudinary.com/dlor7n05z/video/upload/v1607017792/noticias/${id}`
  }



  private cargarCategoriasActivas(){

    if( this.auth.usuario.plantasCategorias){

      this.auth.usuario.plantasCategorias.forEach( planta => this.categorias.push( planta ));

    } if( this.auth.usuario.departamentosCategorias){
      this.auth.usuario.departamentosCategorias.forEach( departamento => this.categorias.push( departamento ));
    }
   

    this.firebaseDB.database.ref('category')
    .orderByChild('status')
    .equalTo(true)
    .once('value')
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const categoriaF :ICategoria= (categoria.toJSON() as any);

      this.categorias.push(categoriaF.name);

      });

      //console.log('Se cargaron ', this.categorias);

     



    });

     this.cambioCategoria(this.categorias[0]);


  }




  public cambioCategoria( categoria:string){

    this.noticias = [];

    this.firestore.collection<INew>('news', query =>
    query
    
    .orderBy('date','desc')
    .where('categoria','==', categoria)

    )
    .get()
    .subscribe( documentos =>{

        if(!documentos.empty){


          documentos.forEach( (documento) =>{

            const noticia : INew = documento.data();
            noticia.id = documento.id;

           

            this.noticias.push( noticia );

          });

          //console.log('Se cargaron las noticias', this.noticias);

        }


    },err =>{
      console.log('Error al cargar las noticias', err);
    });


  }

}
