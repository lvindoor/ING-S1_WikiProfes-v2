import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';


import {ICategoria} from 'src/app/modelos/categoria';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';
import { ConfirmarComponent } from '../../componentes/confirmar/confirmar.component';
import { CategoriaModalComponent } from './categoria-modal/categoria-modal.component';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css']
})
export class CrearCategoriaComponent implements OnInit {

   @ViewChild(MatTable,{static:false}) categoriasTabla: MatTable<ICategoria>;
   @ViewChild(MatPaginator,{ static:false}) paginador;
   public categorias : MatTableDataSource<ICategoria> = new MatTableDataSource<ICategoria>([]);
   public columnas = ['nombre','activo','opciones'];


  constructor(
    private firebaseDB: AngularFireDatabase,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar,
    private firestore: AngularFirestore
  ) { 

    

  }

  ngOnInit(): void {
    this.cargarCategorias();
    

  }

  public crearCategoria(){

    this.matDialog.open( CategoriaModalComponent,
      {
        hasBackdrop:true,
        disableClose:true
      })
      .afterClosed().subscribe( respuesta =>{

        if( respuesta ){
          this.mostrarSnack('Se creo correctamente la categoria', true);

          this.categorias.data.push(respuesta);
          this.categoriasTabla.renderRows();
          this.categorias.paginator = this.paginador;
        }

      });


  }

  private cargarCategorias(){

    this.firebaseDB.database.ref('category').get()
    .then( (valor)=>{

     

      valor.forEach( categoria =>{

      const categoriaF :ICategoria= (categoria.toJSON() as any);
      categoriaF.key = categoria.key;

      this.categorias.data.push( categoriaF );
      this.categoriasTabla.renderRows();
      this.categorias.paginator = this.paginador;

      });

      //console.log('Se cargaron ', this.categorias.data);

    });
   

    

  }

  public eliminarCategoria(id:string, index:number){


    this.matDialog.open( ConfirmarComponent,
      {
        hasBackdrop:true,
        disableClose: true,
        data: '¿Estas seguro que quieres eliminar la categoria?'
      })
      .afterClosed().subscribe( resultado =>{

        if( resultado ){

          this.mostrarCargando('Eliminando las noticias y sus recciones');

          this.firebaseDB.list('category/'+id).remove().then( () =>{

            // console.log('Se elimino');

            const categoria = this.categorias.data[index].name;
       
             this.categorias.data.splice(index,1);
             this.categorias.data = this.categorias.data;
             
             this.mostrarSnack('Se elimino correctamente',true);
       
            //Eliminar las reacciones en cada noticia


             this.firestore.collection('news', query => query.where('categoria','==', categoria ) )
             .get().subscribe( documentos =>{
       
               documentos.forEach( async(documento) =>{


               await  this.firestore.doc('news/'+documento.id).delete();


               const reacciones = await this.firestore.collection('reacciones', query => query.where('idNoticia','==', documento.id ))
                  .get()
                  .toPromise()
                  .then( reaccionesDocs => reaccionesDocs.docs );

            
                  for await( const reaccion of reacciones){

                  await this.firestore.collection('reacciones').doc( reaccion.id).delete()

                  }

                


               });

               this.matDialog.closeAll();
               
               
        
             });
       
       
           }).catch( err =>{
             console.log('No se pudo borrar la categoria ',err);

             this.matDialog.closeAll();
             this.mostrarSnack('No se pudo eliminar',false);
           });

        }


      });


    


  }


  private mostrarCargando(mensaje:string){
    this.matDialog.open( CargandoComponent,{
      hasBackdrop: true,
      disableClose: true,
      data: mensaje
    });
  }


  public actualizarEstado(id:string, estado: boolean ){

    this.firebaseDB.database.ref('category/'+id).update({status: estado})
    .then( () =>{

      this.mostrarSnack('Se actualizo correctamente el estado', true);

    }).catch( err =>{

      this.mostrarSnack('Error al actualizar el estado', false);
      //console.log('Error al actualizar el estado',err);
    })


  }

  private mostrarSnack(mensaje:string,ok:boolean){


    this.matSnack.open(mensaje, null , {
      duration: 3000,
      panelClass: ok ? 'snackVerde' : 'snackRojo'  
    });

  }

}
