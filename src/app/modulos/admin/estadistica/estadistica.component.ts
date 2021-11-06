import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IIngresoNoticia } from 'src/app/modelos/actividadUsuarios';
import { ICategoria } from 'src/app/modelos/categoria';
import { INew } from 'src/app/modelos/noticia';
import { IReaccion } from 'src/app/modelos/reaccion';
import { IngresoNoticiaComponent } from '../../actividad-usuarios/ingreso-noticia/ingreso-noticia.component';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';
import { ConfirmarComponent } from '../../componentes/confirmar/confirmar.component';
import { EditarNoticiaComponent } from '../editar-noticia/editar-noticia.component';
import { GraficosComponent } from './graficos/graficos.component';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {


  public noticias: INew[] = [];

  public categorias: string[]=[];

  public plantasNombres : string[] = [];
  public departamentosNombres: string[] = [];
  public seleccionTipo: FormControl = new FormControl(0);
  public opciones:string []= ['Categorias regionales','Plantas','Departamentos'];
  public categoriasRegionales : string[] = [];


  constructor(
    private firestore: AngularFirestore,
    private firebaseDB: AngularFireDatabase,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {

  this.cargarCategoriasActivas();
  this.cargarZonas();


  }


  public cargarVisitas(noticiaIndex: number){

        let modal = {
          width: '100vw',
        height:  '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh'
      };
    
        if(window.innerWidth >= 1000){
          modal.width = '800px'
          modal.height ='100vh';
          modal.maxHeight = '100vh';
          modal.maxWidth = 'auto'
        }
  
  
        this.matDialog.open(IngresoNoticiaComponent,
          {
            disableClose: true,
            hasBackdrop:true,
            ...modal,
            data: {
              idNoticia:  this.noticias[noticiaIndex].id,
              fechaNoticia: this.noticias[noticiaIndex].date
            }
          });


  }

  public busquedaTipo(index:number ){


    if( index == 0){
     this.categorias = this.categoriasRegionales;
    }
    if(index == 1){

      this.categorias = this.plantasNombres;

    }else if( index == 2){
      this.categorias = this.departamentosNombres;
    }

    this.cambioCategoria(this.categorias[0]);

  }

  private cargarCategoriasActivas(){

   

    this.firebaseDB.database.ref('category')
    .orderByChild('status')
    .equalTo(true)
    .once('value')
    .then( (valor)=>{

      const categoriass = [];

      valor.forEach( categoria =>{

      const categoriaF :ICategoria= (categoria.toJSON() as any);

      categoriass.push(categoriaF.name);

      });

     this.categoriasRegionales = categoriass;

      this.categorias = this.categoriasRegionales;

      //console.log('Se cargaron ', this.categorias);

      //this.cambioCategoria(this.categorias[0]);



    });


  }

  private cargarZonas(){

    this.firebaseDB.database.ref('plant').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const planta :any= (categoria.toJSON() as any); 

      this.plantasNombres.push( planta.name);
     

      })
      //console.log('Se cargaron ', this.plantas);
    });

    this.firebaseDB.database.ref('departament').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const departamento :any= (categoria.toJSON() as any);
      

      this.departamentosNombres.push( departamento.name);
     

      })
      //console.log('Se cargaron ', this.departamentos);
    });


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

         // console.log('Se cargaron las noticias', this.noticias);

        }


    },err =>{
      console.log('Error al cargar las noticias', err);
    });


  }

  public async prueba(){

    const veces = [1,2,3,4,5];

    console.log('Empezo');

    for(const vez of veces){
      

    for await( const vez of veces){

       await  this.promesa();
          console.log('Ciclo');
        }

        console.log('Termino el ciclo await');

    }

    

    console.log('Termino');



  }


  private promesa(){
    return new Promise<void>( (resolve, reject) =>{

      const tiempo = setTimeout( ()=>{

        clearTimeout( tiempo);
        resolve()

      },1000);


    });
  }


  public editarNoticia( noticiaIndex: number ){

    let modal = {
      width: '100vw',
    height:  '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh'
  };

    if(window.innerWidth >= 1000){
      modal.width = '1000px'
      modal.height ='100vh';
      modal.maxHeight = '100vh';
      modal.maxWidth = 'auto';
    }

    this.matDialog.open( EditarNoticiaComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: { 
          noticia : this.noticias[ noticiaIndex],
          plantasNombres: this.plantasNombres,
          departamentosNombres : this.departamentosNombres,
          tipoSeleccion : this.seleccionTipo.value
        },
        ...modal,
        autoFocus:false,
      
      })
      .afterClosed().subscribe( respuesta =>{

        if( respuesta ){

          this.mostrarSnack('Se actualizo la noticia correctamente','snackVerde');

          if(( respuesta as INew).categoria != this.noticias[ noticiaIndex ].categoria ){
            this.noticias.splice(noticiaIndex,1);
          }else{
          this.noticias[ noticiaIndex ] = respuesta;
          this.noticias = this.noticias;
          }

          

        }


      })


  }


  public eliminarNoticia( noticiaIndex: number){


    this.matDialog.open( ConfirmarComponent,{
      hasBackdrop:true,
      disableClose:true,
      data:'¿ Estas seguro que quieres eliminar la noticia ?',
      autoFocus:false
    })
    .afterClosed().subscribe( async(respuesta )=>{

      if( respuesta ){

        this.mostrarCargando('Eliminando la noticia y las reacciones, espere...');

       await this.firestore.doc('news/'+this.noticias[ noticiaIndex ].id )
        .delete()
        .then( ()=>{

          this.mostrarSnack('Se elimino correctamente la noticia','snackVerde');
          

        })
        .catch(err =>{
          console.log('Error al elimnar la noticia ',err);
          this.mostrarSnack('Error al eliminar la noticia','snackRojo');
        });




    const reacciones = await this.firestore.collection('reacciones', query => query.where('idNoticia','==', this.noticias[ noticiaIndex ].id ))
        .get()
        .toPromise()
        .then( reaccionesDocs => reaccionesDocs.docs );

  
        for await( const reaccion of reacciones){

        await this.firestore.collection('reacciones').doc( reaccion.id).delete()

        }

        this.cerrarCargando();

        this.noticias.splice(noticiaIndex,1);

        

      }
      
      

    });

    






  }


private cerrarCargando(){
  this.matDialog.getDialogById('cargando').close();
}

private  mostrarCargando( mensaje: string){

    this.matDialog.open( CargandoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: mensaje,
        id:'cargando'
      });

  }




  public mostrarGraficos(noticia:INew){

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
      modal.maxWidth = 'auto';
    }


    this.firestore.collection<IReaccion>('reacciones', query => query.where('idNoticia','==', noticia.id ))
    .get().subscribe( resp =>{

      if(!resp.empty){

        const reacciones :IReaccion[] = [];

        resp.forEach( reaccionDoc =>{
          const reaccion :IReaccion = reaccionDoc.data();
          reaccion.id = reaccionDoc.id;
          reacciones.push( reaccion );
        });



        this.matDialog.open( GraficosComponent,
          {
            hasBackdrop:true,
            disableClose:true,
            data: {
              reacciones,
              noticia
            },
            ...modal
          });


      }else{

        //console.log('No se encontraron reacciones');

        this.mostrarSnack('No se encontraron reacciones aun','snackVerde');

      }


    },err =>{

      console.log('Error al cargar las reacciones',err);
      this.mostrarSnack('Error al cargar las reacciones','snackRojo');

    });

    


  }



  private mostrarSnack(mensaje: string, color:string ){

    this.matSnack.open( mensaje, null, {
      duration: 3000,
      panelClass: color
    });


  }

  public crearUrlImg(id: string): string{

    return `https://res.cloudinary.com/dlor7n05z/image/upload/v1607017792/noticias/${id}`
  }
  
  public crearUrlVideo(id: string): string{
  
    return `https://res.cloudinary.com/dlor7n05z/video/upload/v1607017792/noticias/${id}`
  }

}
